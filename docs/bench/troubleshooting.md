---
title: 자주 나는 오류
order: 70
---

# 자주 나는 오류

오류 메시지의 앞부분으로 찾아요. 실험 매니저 Queue의 **기록**에서 실패 원인 한 줄, 또는 **로그 보기**로 같은 메시지를 볼 수 있어요.

## `environment variables are missing or invalid`

```
environment variables are missing or invalid:
  STITY_DATA_ROOT: Field required
```

`.env`에 필수 값이 없어요. 이름이 나온 변수를 [.env 설정하기](../getting-started/env)대로 채워요. worker라면 `.env`가 아니라 [worker.env](./worker#worker-env)에 넣어요. <!-- S07-C001-09 S05-C001-03 -->

## `uncommitted changes would make this run impossible to trace back to a commit`

`core/`, `bench/`, `Qwen3-ASR/` 아래에 커밋하지 않은 파일이 있어요. 메시지 아래에 그 파일 목록이 나와요. 커밋한 뒤 다시 돌려요. 실험에 필요 없는 파일이면 지우거나 다른 곳으로 옮겨요. <!-- S07-C001-11 S01-C001-33 -->

## `install the dataset first: make install NAME=…`

데이터셋이 설치되지 않았어요. 그 데이터셋 폴더에 `.status`가 없거나 내용이 `success`가 아니에요. 돌릴 머신의 datasets 저장소에서 설치해요. <!-- S06-C001-09 S10-C001-02 -->

```bash
cd ~/datasets
make install NAME=<데이터셋 이름>
```

Queue의 job이라면 **그 GPU 머신**에서 설치해야 해요. 실패 원인에 `cannot read …/.status`가 보일 때도 같아요. <!-- S01-C001-35 S09-C001-01 -->

## `no pipeline config '…' in S3`

```
FAILED no pipeline config 'asr.qwen-seg-ko+mt.qwen3.5-4b' in S3; push it, or pass configs/pipelines/asr.qwen-seg-ko+mt.qwen3.5-4b.yml to run the local file
```

그 이름의 설정이 S3에 없어요. 둘 중 하나를 해요. <!-- S08-C001-06 -->

- [Configs](../bench-manager/configs)에서 만들거나 `make configs-push`로 올려요.
- 이름 대신 파일 경로를 줘요. [올리지 않은 설정으로 돌리기](./run-locally#local-config)

`make configs-list`로 S3에 있는 이름을 확인해요. 문서나 README의 예시 이름이 지금 S3에 없을 수 있어요. <!-- S08-C001-07 -->

## 이름이 이미 다른 뜻으로 쓰였어요

```
pipeline name '…' already means other content (claimed by … at …); give this one a new name or raise meta.version
```

같은 이름으로 다른 내용이 이미 실행됐어요. `meta.version`을 올리거나 새 이름을 지어요. [이름 규칙과 버전](./naming#version) <!-- S07-C001-10 S03-C001-07 S01-C001-34 -->

## `unknown key(s)`, `unknown mode`

```
dataset: unknown key(s) ['nmae']
commit: unknown mode 'nope'
```

설정 파일에 오타가 있어요. 앞의 이름이 문제가 난 위치예요. [설정 파일 쓰기](./configs)의 키와 맞춰 봐요. <!-- S01-C001-23 -->

## `gpu_memory_utilization is required`

파이프라인 설정 맨 아래의 `gpu_memory_utilization`이 빠졌어요. GPU를 다른 일과 나눠 쓴다면 0.5 이하로 적어요. 이 값이 없으면 모델이 남은 GPU 메모리를 전부 잡아서 같은 머신의 다른 job을 죽인 적이 있어요. <!-- S07-C001-14 -->

## `qwen3.5-vllm was not ready within 600.0s`

번역 모델 서버가 10분 안에 뜨지 않았어요. `/tmp/qwen3.5-vllm.log`를 봐요. 흔한 원인은 이래요. <!-- S09-C001-01 S02-C001-07 -->

- GPU 메모리가 모자라요. 다른 프로그램이 GPU를 쓰고 있는지 `nvidia-smi`로 봐요.
- `nvcc`가 오래됐어요. 로그에 `Unknown option '-generate-dependencies-with-compile'`가 있으면 `.env`의 `CUDA_HOME`을 새 CUDA 툴킷으로 바꿔요. `make env`로 확인해요.

<!-- S02-C001-05 S02-C001-03 -->

## job이 시작되지 않아요

[Queue](../bench-manager/queue)에서 확인할 것이에요. <!-- S01-C001-36 S01-C001-37 -->

| 보이는 것 | 원인과 할 일 |
|---|---|
| 탭의 점이 빨강 (연결 끊김) | worker가 꺼졌어요. 머신에서 `journalctl -u stity-worker -f`로 봐요 |
| 탭에 빨간 시간표 경고 | 시간표가 비어 있어요. ⋯ → **작업 시간표 수정** |
| GPU 막대 설명이 "시간표 밖이라 쉬는 중" | 다음 시간대를 기다려요. 급하면 **지금 실행** |
| 같은 job이 계속 되돌려져요 | 시간대보다 오래 걸려요. 취소하거나 **지금 실행**을 써요 |
