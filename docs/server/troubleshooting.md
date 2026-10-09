---
title: 자주 나는 오류
order: 30
---

# 자주 나는 오류

서버가 켜지지 않거나 클라이언트가 끊길 때 메시지로 찾아요.

## `unknown pipeline config '…'`

```
unknown pipeline config 'test' (available: [...] in .../configs/pipelines; `make configs-pull` fetches the shared ones from S3)
```

그 이름의 파일이 `configs/pipelines/`에 없어요. 괄호 안에 있는 이름 목록과
비교해요. <!-- S07-C001-02 -->

- `PIPELINE=`에 쓴 이름에 오타가 없는지 봐요. `.yml`은 빼고 써요.
- `PIPELINE` 없이 켰다면 `server/configs/application.local.yml`에 예전 이름이
  남아 있는지 봐요. [설정이 정해지는 순서](./run#config-order)
- S3에만 있는 설정이면 `make configs-pull ONLY=pipeline/<이름>`으로 받아요.

<!-- S07-C001-01 S07-C001-02 S01-C001-14 -->

## `Unknown option '-generate-dependencies-with-compile'`

번역 모델이 오래된 `nvcc`(`/usr/bin/nvcc`)로 컴파일하려다 실패했어요. `.env`의
`CUDA_HOME`을 새 CUDA 툴킷 폴더로 바꿔요. `make env`로 어떤 경로를 쓰는지
확인해요. <!-- S02-C001-05 -->

## 번역 모델이 뜨지 않아요

`/tmp/qwen3.5-vllm.log`를 봐요. GPU 메모리가 모자라면 여기에 나와요.
`nvidia-smi`로 다른 프로그램(bench 실행 등)이 GPU를 쓰고 있지 않은지 확인해요.

<!-- S02-C001-07 S02-C001-03 -->

## 첫 시작이 10분 넘게 걸려요

정상일 수 있어요. 처음에는 모델 파일, 컴파일 결과, 파이썬 환경 두 개를 처음부터
읽어요. HDD 머신에서는 13분이 걸린 적이 있어요. 로그에
`Application startup complete`가 나올 때까지 기다려요. <!-- S02-C001-08 -->

## 휴대폰이 서버에 붙지 않아요

- 서버를 `HOST=0.0.0.0`으로 켰나요? 기본값 `127.0.0.1`은 서버 컴퓨터 안에서만
  붙어요.
- 휴대폰과 서버가 같은 Wi-Fi에 있나요? 손님용 Wi-Fi는 기기끼리 막는 경우가
  많아요.
- 앱의 주소가 `ws://<IP>:8765`인가요? `/api/v1/ws`는 붙이지 않아요.

<!-- S02-C001-06 S02-C001-11 -->

## 연결이 4xxx 코드로 끊겨요

[연결이 닫힐 때의 코드](./connect#close-codes) 표에서 찾아요. 4500이면 서버
로그에 원인이 남아 있어요. <!-- S07-C001-04 -->

## `stop` 뒤에 `Exception in ASGI application`이 찍혀요

mock 서버에서 클라이언트가 `stop`을 보낸 뒤 서버 로그에 이 줄이 한 번 찍혔어요.
서버는 계속 살아 있었고 `healthz`도 `ok`였어요. <!-- S08-C001-04 -->
