---
title: 클라이언트 연결하기
order: 20
---

# 클라이언트 연결하기

클라이언트는 `ws://<서버 주소>:8765/api/v1/ws`에 연결해요. 연결하면 `start`를 한
번 보내고, 그다음부터 마이크 소리를 계속 보내요. 서버는 받아쓰는 중인
글(`partial`)과 확정된 문장과 번역(`final`)을 계속 돌려줘요.

<!-- S02-C001-01 S07-C001-03 -->

## 메시지 순서

```
클라이언트                               서버
   │ ── 연결 ───────────────────────────→ │
   │ ←──────────────────────────── hello  │  서버 이름과 파이프라인 정보
   │ ── start ──────────────────────────→ │  내 언어, 받고 싶은 번역 언어
   │ ←──────────────────────────── ready  │  대화방 ID
   │ ── 소리 (바이너리) ────────────────→ │  계속 보내요
   │ ←────────────────────────── partial  │  받아쓰는 중인 글
   │ ←──────────────────────────── final  │  확정된 문장 + 번역
   │ ── finish 또는 stop ───────────────→ │
```

<!-- S07-C001-03 -->

## 클라이언트가 보내는 것

| 메시지                   | 내용                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `{"type":"start", ...}`  | 대화방에 들어가요. `lang`(내가 말할 언어, 기본 `auto`), `targetLang`(받고 싶은 번역 언어), `conversationId`(같은 방에 들어갈 때만) |
| 바이너리 프레임          | 마이크 소리. 16 kHz, 모노, 16비트 정수(s16le) PCM                                                                                  |
| `{"type":"config", ...}` | 들어간 뒤 `lang`, `targetLang`을 바꿔요. 서버는 `config_ok`로 답해요                                                               |
| `{"type":"finish"}`      | 남은 소리를 마저 처리하게 해요. 연결은 열어 둬요                                                                                   |
| `{"type":"stop"}`        | 마무리하고 방에서 나가며 연결을 닫아요                                                                                             |

<!-- S07-C001-03 -->

`conversationId`는 영문, 숫자, `_`, `-`로 64자까지예요. 안 보내면 서버가 새 ID를
만들어 `ready`에 담아 줘요. <!-- S07-C001-03 -->

## 서버가 보내는 것

| 메시지    | 예                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `hello`   | `{"type":"hello","message":"STiTy Server","serverConfig":{…}}`                                                                   |
| `ready`   | `{"type":"ready","message":"Ready to receive audio","conversationId":"…"}`                                                       |
| `partial` | `{"type":"partial","text":"word11 word12","language":"en","seq":14}`                                                             |
| `final`   | `{"type":"final","start":"0:00:01.00","end":"0:00:01.50","original":"…","translation":"…","language":"en","commitReason":"vad"}` |

<!-- S07-C001-03 S08-C001-03 -->

- `partial`의 `text`는 지금까지의 글 **전체**예요. 화면의 줄을 통째로 바꿔요. 빈
  문자열이 오면 그 줄을 지워요.
- `final`의 `translation`이 번역이에요. 따로 오는 번역 메시지는 없어요.
- `commitReason`은 문장이 확정된 이유예요. 뜻은
  [Replay](../bench-manager/replay#tabs)의 표와 같아요.

<!-- S01-C001-27 S07-C001-03 S09-C001-15 -->

## 파이썬으로 직접 붙어 보기

[mock 서버](./run#mock)를 켜 두고 아래 파일을 `~/STiTy/try_ws.py`로 저장해요.
1.5초 분량의 무음을 보내고 받은 메시지를 모두 찍어요. <!-- S08-C001-03 -->

```python
import asyncio
import json

import websockets


async def main():
    async with websockets.connect("ws://127.0.0.1:8765/api/v1/ws") as ws:
        print("<-", await ws.recv())
        await ws.send(json.dumps({"type": "start", "lang": "en", "targetLang": "ko"}))
        print("<-", await ws.recv())
        chunk = bytes(6400)
        for _ in range(15):
            await ws.send(chunk)
            await asyncio.sleep(0.2)
        await ws.send(json.dumps({"type": "finish"}))
        try:
            while True:
                print("<-", await asyncio.wait_for(ws.recv(), 3))
        except asyncio.TimeoutError:
            pass
        await ws.send(json.dumps({"type": "stop"}))


asyncio.run(main())
```

`bytes(6400)`은 0.2초 분량의 무음이에요. 16,000 샘플/초 × 0.2초 × 2바이트예요.
서버의 파이썬 환경으로 돌려요. `websockets` 라이브러리가 그 환경에 이미 들어
있어서 따로 설치하지 않아요. <!-- S08-C001-03 -->

<!-- vanessa-allow: glossary-avoid -->

```bash
cd ~/STiTy
uv run --project server python try_ws.py
```

mock 서버는 소리와 상관없이 `word1 word2 …`를 받아쓰고, 번역은 앞에 `[ko]`를
붙여 돌려줘요. 이런 줄이 보이면 성공이에요. <!-- S08-C001-03 S07-C001-06 -->

```
<- {"type": "partial", "text": "word11 word12 word13", "language": "en", "seq": 15}
<- {"type": "final", "start": "0:00:01.00", "end": "0:00:01.50", "original": "word11 word12 word13 word14 word15", "translation": "[ko] word11 word12 word13 word14 word15", "language": "en", "commitReason": "vad"}
```

## 연결이 닫힐 때의 코드 {#close-codes}

서버가 연결을 끊으면 닫힘 코드로 이유를 알려 줘요. 1000이 아닌 코드는 4000 +
HTTP 상태 코드예요. <!-- S07-C001-04 -->

| 코드 | 이유                             | 원인                                                         |
| ---- | -------------------------------- | ------------------------------------------------------------ |
| 1000 |                                  | 정상 종료 (`stop`)                                           |
| 4409 | `conversation_not_started`       | `start` 전에 소리나 `finish`를 보냈어요                      |
| 4410 | `conversation_closed`            | 닫힌 대화방에 들어가려 했어요                                |
| 4422 | `invalid_message`                | 메시지의 값이 잘못됐어요. 예: 허용되지 않는 `conversationId` |
| 4422 | `too_slow`                       | 클라이언트가 메시지를 너무 늦게 가져가서 쌓였어요            |
| 4500 | `audio_failed`, `internal_error` | 서버 안에서 오류가 났어요. 서버 로그를 봐요                  |
| 4503 | `shutdown`                       | 서버가 꺼지는 중이에요                                       |

<!-- S07-C001-04 -->

## 휴대폰 앱 연결하기

1. 서버를 `HOST=0.0.0.0`으로 켜요.
2. STiTy 저장소 안 `STiTy-Mobile/src/context/WebSocketContext.tsx`의
   `RUNPOD_SERVER_URL`을 `ws://<서버의 내부망 IP>:8765`로 바꿔요. `/api/v1/ws`는
   앱이 알아서 붙여요.
3. `STiTy-Mobile/`에서 `npm start`로 앱을 켜요.
4. 휴대폰이 그 IP에 닿아야 해요. 같은 Wi-Fi에 있고, 공유기가 기기끼리 막지
   않아야 해요.

<!-- S02-C001-11 -->

앱은 `conversationId`를 보내지 않아서 휴대폰마다 따로 대화방이 생겨요.

<!-- S02-C001-11 -->

## 웹 데모 연결하기

웹 데모의 프록시를 모든 경로가 이 서버로 가도록 띄워요. <!-- S02-C001-12 -->

```bash
cd ~/STiTy
S=ws://127.0.0.1:8765/api/v1/ws
uv run --project server python STiTy-Mobile/demo-web/partial_demo/demo_proxy.py 8080 \
  --route en=$S,ko=$S --default $S
```

브라우저에서
`http://localhost:8080/show.html?src=en&tgt=ko&layout=tag&pick=ko`를 열고 마이크
버튼을 눌러요. 주소의 `layout=tag&pick=<번역 언어>`를 꼭 붙여요. 기본 화면은
언어마다 칸을 따로 그려서, 이 서버에서는 빈 칸이 생겨요. <!-- S02-C001-12 -->
