---
title: worker 설치하기
order: 60
---

# worker 설치하기

GPU 머신 하나를 [Queue](../bench-manager/queue)에 올리려면 그 머신에 worker를 설치해요. worker는 systemd 서비스로 늘 돌면서 자기 머신의 대기열을 1분마다 보고, 시간표 안에서 job을 꺼내 `make bench`로 돌려요. 머신마다 한 번만 하면 되는 관리자 작업이에요. <!-- S01-C001-38 S01-C001-41 -->

::: info 이 문서는 머신 관리자용이에요
실험을 넣기만 할 거라면 이 문서는 건너뛰어도 돼요. 설치에는 `sudo`(관리자 권한)가 필요해요.
:::

## 준비할 것

| 준비물 | 확인 방법 |
|---|---|
| NVIDIA 드라이버 | `nvidia-smi`가 GPU 목록을 보여 줘요 |
| 암호 없이 `git fetch`하는 SSH 키 | 읽기 전용 deploy key가 좋아요. worker가 job마다 브랜치를 받아요 |
| 대기열에 넣을 데이터셋 | [설치하기](../getting-started/install#datasets) |
| 이 머신 전용 AWS 키 | 머신마다 따로 만든 IAM 사용자의 키 |
| systemd 231 이상 | Ubuntu 18.04 이후면 돼요 |

<!-- S01-C001-38 S07-C001-07 -->

`git`, `make`, `curl`, `uv`가 없으면 설치 스크립트가 알아서 설치해요. `STITY_DATA_ROOT` 폴더가 없으면 만들어요. <!-- S01-C001-38 -->

## 1. worker 전용 저장소 받기

worker는 자기만 쓰는 STiTy 저장소에서 돌아요. 평소 작업하는 폴더와 따로 받아요. 아래는 `~/stity-worker`에 받는 예예요. <!-- S01-C001-38 -->

```bash
git clone git@github.com:STiTy-team/STiTy.git ~/stity-worker
```

## 2. worker.env 만들기 {#worker-env}

홈 폴더에 `worker.env`를 만들어요. **한 줄에 `KEY=value`만** 써요. systemd는 `export`가 붙은 줄을 읽지 못해요. <!-- S01-C001-38 S07-C001-07 -->

```ini
STITY_S3_BUCKET=<팀 버킷 이름>
STITY_S3_PREFIX=stity/
STITY_HOST=<이 머신 이름, 예: 4090>
AWS_DEFAULT_REGION=ap-northeast-2
STITY_DATA_ROOT=/home/<사용자>/datasets
DISCORD_WEBHOOK_URL=<알림 받을 웹훅>
AWS_ACCESS_KEY_ID=<이 머신 전용 키>
AWS_SECRET_ACCESS_KEY=<이 머신 전용 비밀 키>
```

<!-- S01-C001-38 S07-C001-07 S07-C001-09 -->

`STITY_S3_BUCKET`과 `STITY_DATA_ROOT`는 꼭 있어야 해요. `STITY_HOST`는 Queue 페이지의 탭 이름이 돼요. 다른 머신이 이미 쓰는 이름이면 worker가 멈춰요. <!-- S07-C001-07 S07-C001-13 -->

## 3. 설치하고 켜기

```bash
sudo ~/stity-worker/scripts/bench/worker/start.sh --env-file ~/worker.env
```

스크립트는 이 순서로 일해요. <!-- S07-C001-07 S01-C001-38 -->

1. 필요한 프로그램과 `git fetch`가 되는지 확인해요.
2. AWS 키를 `/etc/stity-worker/aws-credentials`에, 나머지 설정을 `/etc/stity-worker/worker.env`에 root만 읽게 설치해요.
3. 넘긴 `worker.env`에서 **AWS 키 줄을 지워요.** 나머지 줄은 남아요.
4. `stity-worker` 서비스를 등록하고 켜요.
5. 15초 동안 살아 있는지 보고, 죽었으면 로그를 보여 주고 실패로 끝나요.

끝에 `[running] stity-worker.service`가 나오면 성공이에요. 실험 매니저의 Queue 페이지에 이 머신의 탭이 생겨요. 새 머신의 시간표는 매일 00:00–04:00이에요. 바꾸려면 [작업 시간표 정하기](../bench-manager/queue#timetable)를 봐요. <!-- S07-C001-07 S01-C001-39 -->

## 상태 보기와 끄기

| 하고 싶은 것 | 명령 |
|---|---|
| 로그를 실시간으로 보기 | `journalctl -u stity-worker -f` |
| worker 코드를 고친 뒤 다시 켜기 | 그 저장소에서 `git pull` 후 `sudo systemctl restart stity-worker` |
| 끄고 설치한 것 지우기 | `sudo ~/stity-worker/scripts/bench/worker/stop.sh` |

<!-- S01-C001-38 S01-C001-39 S07-C001-08 -->

끄거나 다시 켜면 돌던 job은 대기열로 돌아가요. 설정 오류로 멈춘 게 아니면 worker는 죽어도 10초 뒤 다시 켜지고, 머신을 켤 때도 켜져요. <!-- S01-C001-38 -->

## 설정 하나만 바꾸기

`start.sh`에 넘기는 파일에는 **바꿀 줄만** 있으면 돼요. 그 값이 설치된 값을 덮고, 나머지는 그대로예요. `--env-file` 없이 부르면 설치된 그대로 다시 켜요. <!-- S01-C001-38 -->

| 하고 싶은 것 | 하는 법 |
|---|---|
| AWS 키 바꾸기 | IAM에서 새 키를 만들고, 키 두 줄만 든 파일로 `sudo …/start.sh --env-file keys.env`. 옛 키는 IAM에서 지워요 |
| 설정 하나 바꾸기 | 그 줄만 든 파일로 `sudo …/start.sh --env-file one.env` |
| 머신 하나를 바로 끊기 | IAM에서 그 머신 키를 비활성화해요. 파일을 지우는 것만으로는 막히지 않아요 |
| 머신에서 치우기 | `sudo …/stop.sh` |

<!-- S01-C001-39 -->

## worker 설정값

| 변수 | 기본 | 뜻 |
|---|---|---|
| `STITY_S3_BUCKET` | (필수) | 팀 버킷 |
| `STITY_DATA_ROOT` | (필수) | 데이터셋 폴더 |
| `STITY_HOST` | hostname | 이 머신의 이름. 실행 ID 끝에 붙어요 |
| `STITY_WORKER_COMMAND` | `make bench CONFIG={pipeline} DATASET={dataset}` | job 하나를 돌리는 명령 |
| `STITY_WORKER_POLL_SEC` | 60 | 대기열을 보는 간격(초) |
| `STITY_WORKER_KILL_GRACE_SEC` | 30 | 멈추라고 한 뒤 강제로 끌 때까지(초) |
| `STITY_WORKER_BACKOFF_SEC` | `60,600,3600,10800` | GPU가 가득 찼을 때 쉬는 시간(초) |

<!-- S01-C001-41 S07-C001-09 -->

## worker가 알아서 하는 일

- 시간표가 끝나면 돌던 job을 멈추고 대기열로 되돌려요.
- job이 실패했는데 GPU 메모리 절반 이상을 다른 프로그램이 쓰고 있으면 "머신이 가득 참"으로 봐요. job을 되돌리고 1분 → 10분 → 1시간 → 3시간 쉬어요.
- 시각은 S3 응답의 시계를 써요. 머신 시계가 틀려도 시간표 판단은 맞아요.

<!-- S01-C001-41 -->

Discord(`DISCORD_WEBHOOK_URL`)에는 이런 알림이 와요. <!-- S01-C001-40 -->

| 언제 | 메시지 |
|---|---|
| 실행이 끝나 올라감 | ✅ bench 끝났어요 | <!-- vanessa-allow: emoji -->
| 머신이 job을 시작함 | ▶️ job을 시작했어요 | <!-- vanessa-allow: emoji -->
| 브랜치를 못 씀 | ❌ job을 시작하지 못했어요 | <!-- vanessa-allow: emoji -->
| job이 실패함 | ❌ job이 실패했어요 | <!-- vanessa-allow: emoji -->
| 시간대 끝, 멈추기, worker 재시작 | 🔁 job을 queue로 돌려놨어요 | <!-- vanessa-allow: emoji -->
| 실패했는데 GPU를 남이 쓰고 있음 | ⏳ GPU가 가득 찼어요 | <!-- vanessa-allow: emoji -->

## 보안: AWS 키는 어디에 있나요

키는 환경 변수로 들어가지 않아요. 서비스가 켜질 때 root 전용 파일에서 메모리 위의 `/run/stity-worker/aws`로 복사되고, 서비스가 꺼지면 사라져요. 

job도 결과를 올려야 해서 이 파일을 읽어요. 그래서 대기열에 넣은 브랜치의 코드는 키를 볼 수 있어요. 키는 머신마다 따로 만들고, 필요한 권한만 붙여요. <!-- S01-C001-38 S01-C001-42 -->

## 개발할 때

worker 코드를 고치는 중이라면 서비스 대신 터미널 앞에서 돌려요. 이때는 저장소의 `.env`를 읽어요. <!-- S01-C001-39 -->

```bash
make bench-worker
```
