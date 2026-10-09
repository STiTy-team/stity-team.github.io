---
title: .env 설정하기
order: 30
---

# .env 설정하기

`.env`는 이 컴퓨터에만 있는 설정 파일이에요. STiTy 폴더 맨 위에 두고, git에는
올라가지 않아요. 최소한 `STITY_DATA_ROOT` 한 줄은 꼭 있어야 해요. 없으면 bench와
실험 매니저가 시작하자마자 멈춰요. <!-- S05-C001-01 S05-C001-03 -->

## 1. 예시 파일을 복사하기

```bash
cd ~/STiTy
cp .env.example .env
```

그다음 편집기로 `.env`를 열어 값을 채워요. <!-- S05-C001-01 -->

::: warning 쓰는 규칙

- 경로는 `/home/...`처럼 처음부터 다 쓴 **절대 경로**로 써요. `~`는 쓰지 않아요.
- 값에 따옴표를 붙이지 않아요. `make`도 이 파일을 통째로 읽어서, 따옴표가 값에
  그대로 들어가요. :::

<!-- S05-C001-01 -->

## 2. 키마다 채우기

`.env.example`에 있는 키는 아래와 같아요.

<!-- S05-C001-02 S05-C001-03 S05-C001-04 S05-C001-05 -->

```ini
CUDA_HOME=/usr/local/cuda
STITY_DATA_ROOT=/home/you/datasets
DISCORD_WEBHOOK_URL=
STITY_S3_BUCKET=
STITY_S3_PREFIX=
STITY_HOST=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-northeast-2
```

| 키                                           | 꼭 필요한가요                       | 무엇을 적나요                                                    | 비워 두면                                                   |
| -------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `STITY_DATA_ROOT`                            | **필수**                            | `datasets` 저장소를 받은 폴더의 절대 경로                        | bench와 실험 매니저가 바로 멈춰요                           |
| `CUDA_HOME`                                  | GPU로 번역 모델을 돌릴 때           | CUDA 툴킷 폴더. 번역 모델이 여기 있는 `nvcc`로 코드를 컴파일해요 | `/usr/local/cuda`를 써요                                    |
| `STITY_S3_BUCKET`                            | 실험 매니저의 Queue·Configs를 쓸 때 | 팀 S3 버킷 이름                                                  | 결과가 이 컴퓨터에만 남아요. Queue·Configs 페이지는 못 써요 |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | S3를 쓸 때                          | S3에 접근하는 AWS 키 두 개                                       | S3에 접근하지 못해요                                        |
| `AWS_DEFAULT_REGION`                         | S3를 쓸 때                          | `ap-northeast-2` (서울) 그대로 둬요                              |                                                             |
| `STITY_S3_PREFIX`                            | 아니요                              | 버킷 안의 폴더 이름                                              | `stity/`                                                    |
| `STITY_HOST`                                 | 아니요                              | 이 컴퓨터의 이름. 실행 ID 끝에 붙어요                            | 컴퓨터의 hostname                                           |
| `DISCORD_WEBHOOK_URL`                        | 아니요                              | 실행 결과를 알릴 Discord 웹훅 주소                               | 알림을 보내지 않아요                                        |

<!-- S05-C001-02 S05-C001-03 S05-C001-05 S01-C001-31 -->

Discord 웹훅 주소는 채널 설정에서 얻어요. 연동(Integrations) → 웹후크(Webhooks)
→ 새 웹후크 → 웹후크 URL 복사 순서예요. <!-- S05-C001-04 -->

::: danger AWS 키는 비밀번호예요 AWS 키는 채팅이나 문서, 스크린샷에 붙이지
않아요. git에도 올리지 않아요. `.env`는 git이 무시하도록 설정돼 있지만, 다른
파일에 복사하면 그 파일은 올라갈 수 있어요. :::

## 3. 제대로 읽히는지 확인하기

```bash
cd ~/STiTy
make env
```

이렇게 두 줄이 나오면 돼요. <!-- S04-C001-04 S08-C001-09 -->

```
CUDA_HOME=/usr/local/cuda
STITY_DATA_ROOT=/home/you/datasets
```

`STITY_DATA_ROOT=(not set - required)`가 나오면 `.env`에 그 줄이 없거나 오타가
있는 거예요. <!-- S04-C001-04 -->

## 누가 이 파일을 읽나요

bench와 실험 매니저, 대화 서버는 실행할 때 `.env`를 직접 읽어요. COMET 채점
단계도 마찬가지예요. 터미널에서 같은 이름의 변수를 이미 정했다면 그 값이
`.env`보다 먼저예요.

`make`도 이 파일을 읽지만, 실제로 쓰는 값은 `CUDA_HOME` 하나예요. 단, systemd로
도는 worker는 `.env`를 읽지 않아요. worker는 같은 키를 `worker.env`에서 읽어요.
worker 설정은 [worker 설치하기](../bench/worker)에서 따로 해요.

<!-- S05-C001-01 S04-C001-05 S07-C001-01 S01-C001-38 -->

다음: [원격 서버에서 쓰기](./remote)
