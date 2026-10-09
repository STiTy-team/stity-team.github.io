---
title: 서버 켜기
order: 10
---

# 서버 켜기

처음에는 **mock 서버**로 시작해요. mock 파이프라인은 모델을 올리지 않고 가짜 받아쓰기와 번역을 내요. GPU 없이 몇 초 만에 떠서, 서버와 클라이언트가 잘 연결되는지 먼저 확인할 수 있어요. 그다음 실제 모델로 띄워요. <!-- S07-C001-06 S08-C001-02 -->

## mock 서버로 시험하기 {#mock}

```bash
cd ~/STiTy
make server PIPELINE=mock
```

이런 줄이 나오면 준비된 거예요. <!-- S08-C001-02 -->

```
INFO:     Starting STiTy server (cascade pipeline) on port 8765
INFO:     Loading models for pipeline [cascade]
INFO:     Loaded models in 0.0s
INFO:     Started STiTy server (pid 220711, Python 3.12.13, FastAPI 0.141.1)
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8765 (Press CTRL+C to quit)
```

S3를 쓰는 컴퓨터라면 맨 앞에 `missing  pipeline mock: not in S3, the local copy is used if there is one`이 먼저 나와요. mock 설정은 S3에 없고 저장소에 들어 있어서 괜찮아요. <!-- S08-C001-05 S08-C001-10 -->

다른 터미널에서 상태를 물어봐요. <!-- S08-C001-02 -->

```bash
curl localhost:8765/api/v1/healthz
```

```json
{"status":"ok","pipeline":{"pipeline":"cascade","transcription":{"backend":"mock"},"vad":{"backend":"mock","speech_chunks":5},"correction":{"backend":"mock"},"translation":{"backend":"mock"}}}
```

`"status":"ok"`면 서버가 살아 있어요. `pipeline`에는 지금 쓰는 부품이 나와요. 이제 [클라이언트 연결하기](./connect)로 메시지를 주고받아 봐요. <!-- S08-C001-02 S07-C001-05 -->

끌 때는 서버 터미널에서 `Ctrl+C`를 눌러요.

## 실제 모델로 켜기

### 필요한 것

- GPU에 약 **22 GB**의 빈 메모리가 있어야 해요. RTX 4090(24 GB) 기준이에요. 받아쓰기 엔진이 GPU 메모리의 0.30, 번역 모델이 0.52를 써요.
- 같은 GPU에서 다른 일을 돌리면 안 돼요. bench 실행이 돌고 있으면 먼저 멈춰요.
- API 키는 필요 없어요. 모델은 HuggingFace에서 받아 와요.

<!-- S02-C001-03 S02-C001-09 -->

### 켜기

tmux 안에서 켜요. 터미널을 닫아도 서버가 계속 돌아요. <!-- S02-C001-10 -->

```bash
tmux new -s server
cd ~/STiTy
make server PIPELINE=asr.qwen-seg-en+mt.qwen3.5-4b HOST=0.0.0.0   # 영어로 말하는 사람용
```

한국어로 말하는 사람용은 `PIPELINE=asr.qwen-seg-ko+mt.qwen3.5-4b`예요. <!-- S02-C001-04 -->

| 옵션 | 기본값 | 뜻 |
|---|---|---|
| `PIPELINE` | `mock` | `configs/pipelines/` 안의 설정 파일 이름 (`.yml` 빼고) |
| `HOST` | `127.0.0.1` | 누가 붙을 수 있는지. `127.0.0.1`은 이 컴퓨터만, `0.0.0.0`은 같은 네트워크의 휴대폰도 붙어요 |
| `PORT` | `8765` | 서버 포트 |

<!-- S02-C001-06 S04-C001-03 -->

`.env`에 S3 버킷이 있으면 서버는 켜기 전에 그 파이프라인 설정을 S3에서 `configs/`로 받아요. 여기서 고친 파일은 덮어쓰지 않아요. <!-- S02-C001-06 S04-C001-03 -->

### 얼마나 기다리나요

처음 켤 때는 오래 걸려요. HDD 머신에서 처음 켰을 때 13분이 걸렸어요. 모델 파일과 컴파일 결과를 처음 읽기 때문이에요.

그다음부터는 몇 분이에요. 로그에 `Application startup complete`가 나오고 `healthz`가 `"status": "ok"`를 돌려주면 준비된 거예요. <!-- S02-C001-08 -->

### 번역 모델 서버는 따로 켜지 않아요

서버가 켜질 때 `http://127.0.0.1:8100/v1`에 번역 모델이 있는지 봐요. 없으면 직접 띄우고, 서버를 끌 때 같이 꺼요. 그 로그는 `/tmp/qwen3.5-vllm.log`에 있어요. 8100에 이미 같은 모델이 떠 있으면 그 번역 서버를 같이 써요. <!-- S02-C001-07 -->

## 끄기

서버 터미널에서 `Ctrl+C`를 눌러요. 열린 대화방을 닫고 이런 줄로 끝나요. <!-- S07-C001-05 -->

```
INFO:     Shutting down STiTy server (pid …)
INFO:     Closing N open conversation(s)
INFO:     Stopped STiTy server
```

## 설정이 정해지는 순서 {#config-order}

`make server`의 옵션은 환경 변수로 바뀌어 서버에 전해져요. 같은 설정을 여러 곳에 적으면 위쪽이 이겨요. <!-- S07-C001-01 S02-C001-06 -->

1. 환경 변수 `STITY_STITY__PIPELINE`, `STITY_SERVER__HOST`, `STITY_SERVER__PORT` (`make server`의 옵션이 이것이 돼요)
2. `server/configs/application.local.yml` (git에 올라가지 않는 내 컴퓨터용 파일)
3. `server/configs/application.yml` (기본: `pipeline: mock`, `port: 8765`)

```yaml
# server/configs/application.local.yml 예시
stity:
  pipeline: asr.qwen-seg-ko+mt.qwen3.5-4b
server:
  host: 0.0.0.0
```

::: warning application.local.yml을 확인해요
`make server`를 `PIPELINE` 없이 부르면 이 파일의 파이프라인을 써요. 예전에 적어 둔 이름이 남아 있으면 엉뚱한 설정으로 뜨거나 시작하지 못해요.
:::

<!-- S07-C001-01 S07-C001-02 -->
