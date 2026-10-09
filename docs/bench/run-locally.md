---
title: 이 컴퓨터에서 돌리기
order: 40
---

# 이 컴퓨터에서 돌리기

`make bench`는 실행 하나를 이 컴퓨터의 GPU로 바로 돌려요. 결과는 Queue로 돈
실행과 똑같이 S3에 올라가요. 다만 그 머신의 시간표와 대기열을 거치지 않아요.
같은 GPU를 쓰는 다른 job과 부딪칠 수 있으니, 평소에는
[Queue](../bench-manager/queue)를 써요. <!-- S01-C001-06 -->

## 돌리기 전에 확인할 것

1. **코드 변경을 모두 커밋했나요?** `core/`, `bench/`, `Qwen3-ASR/` 아래에
   커밋하지 않은 변경이 있으면 bench가 돌지 않아요. 어느 코드로 돌았는지 되짚을
   수 없기 때문이에요. 새로 만든 파일도 변경으로 쳐요. 피해 가는 방법은 없어요.
   <!-- S01-C001-33 S07-C001-11 -->
2. **데이터셋을 설치했나요?** [설치하기](../getting-started/install#datasets)를
   봐요. <!-- S01-C001-35 -->
3. **GPU가 비어 있나요?** `nvidia-smi`로 다른 프로그램이 GPU 메모리를 쓰고 있지
   않은지 봐요. 대화 서버가 떠 있으면 먼저 꺼요. <!-- S02-C001-03 -->

## 실행 하나 돌리기

```bash
cd ~/STiTy
make bench CONFIG=<파이프라인 설정 이름> DATASET=<데이터셋 설정 이름>
```

예를 들어 지금 S3에 있는 설정으로는 이렇게 돌려요. <!-- S08-C001-07 -->

```bash
make bench CONFIG=vela DATASET=northstar_ko+en_en_cafe+restaurant
```

`make bench`는 세 단계를 차례로 해요.

<!-- S04-C001-01 S01-C001-29 S01-C001-32 -->

1. 결과 폴더 위치를 정해요.
2. 파이프라인을 녹음에 돌리고 점수를 매겨요.
3. 번역 품질 점수(COMET)를 따로 매기고, 결과를 S3에 올리고, Discord로 알려요.

설정은 **실행할 때마다 S3에서 읽어요.** 미리 받아 둘 필요가 없어요. 이 컴퓨터의
`configs/` 사본이 S3와 다르면 경고하고 S3 쪽을 써요. <!-- S01-C001-13 -->

결과가 어디에 생길지는 돌리지 않고 미리 볼 수 있어요.

<!-- S01-C001-26 S08-C001-08 -->

```bash
uv run --project bench python -m bench --config vela --dataset northstar_ko+en_en_cafe+restaurant --print-run-dir
```

```
bench/runs/northstar_ko+en_en_cafe+restaurant/vela
```

<!-- S08-C001-08 -->

## 올리지 않은 설정으로 돌리기 {#local-config}

이름 대신 파일 경로를 주면 S3를 거치지 않고 그 파일을 읽어요. 설정을 팀에 올리기
전에 시험할 때 써요. <!-- S01-C001-13 -->

```bash
make bench CONFIG=configs/pipelines/draft.yml DATASET=configs/datasets/fleurs_ko-en.yml
```

`.env`에 S3 버킷이 없으면 이름으로 줘도 `configs/` 폴더의 사본을 읽어요.

<!-- S01-C001-13 -->

## 여러 실행을 차례로 돌리기

목록 파일을 만들고 한 줄에 `파이프라인 데이터셋`을 하나씩 적어요. `#`으로
시작하는 줄과 빈 줄은 건너뛰어요. <!-- S01-C001-07 -->

```text
# my_runs.txt
asr.qwen-seg-ko+mt.qwen3.5-4b fleurs_ko-en
asr.qwen-seg-ko+mt.qwen3.5-4b fleurs_ko-en_cafe
```

오래 걸리니 tmux 안에서 돌려요. <!-- S01-C001-07 -->

```bash
tmux new-session -d -s bench -c ~/STiTy "make bench-batch LIST=my_runs.txt 2>&1 | tee my_runs.log"
```

하나가 실패해도 다음 줄로 넘어가요. 끝에 실패한 조합만 모아 보여 줘요.

<!-- S01-C001-07 -->

## 설정 내려받기와 올리기

설정 원본은 S3에 있고, `configs/` 폴더는 그 사본을 두는 자리예요. 파일로 고치고
싶을 때 이 명령을 써요. <!-- S01-C001-14 -->

| 명령                                     | 하는 일                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `make configs-list`                      | S3에 있는 설정을 최근에 바뀐 순으로 보여 줘요                             |
| `make configs-pull`                      | S3 → `configs/`. 여기서 고친 파일은 덮어쓰지 않아요                       |
| `make configs-pull ONLY=pipeline/<이름>` | 그 설정 하나만 받아요                                                     |
| `make configs-push`                      | `configs/` → S3. 마지막으로 받은 뒤 S3 쪽이 바뀌었으면 그 파일은 거절해요 |

<!-- S01-C001-14 S07-C001-10 -->

`make configs-list`는 이렇게 나와요. <!-- S08-C001-07 -->

```
2026-10-07T11:58:16+00:00  pipeline  vela
2026-10-07T11:58:10+00:00  pipeline  vela-removed_lid
2026-10-07T04:50:16+00:00  dataset   northstar_ko+en_ko_cafe+restaurant_longform
2026-10-06T10:22:06+00:00  dataset   northstar_ko+en_en_cafe+restaurant
```

`make configs-pull`이 파일마다 남기는 말은 이런 뜻이에요. <!-- S07-C001-10 -->

| 출력                                       | 뜻                                                         |
| ------------------------------------------ | ---------------------------------------------------------- |
| `pulled`                                   | 받았어요                                                   |
| `unpushed … edited here; push it to share` | 여기서 고친 파일이에요. 공유하려면 push해요                |
| `kept … edited here and in S3`             | 양쪽에서 고쳤어요. push하거나, 파일을 지우고 다시 pull해요 |
| `missing … not in S3`                      | S3에 없어요. 이 컴퓨터의 사본이 있으면 그것을 써요         |

## 지난 실행의 COMET만 다시 매기기 {#rescore-comet}

```bash
uv run --project bench/metrics/comet python -m bench.metrics.comet --run-dir bench/runs/<데이터셋>/<파이프라인>
```

처음 한 번은 COMET 모델(약 2.3 GB)을 받아요. <!-- S01-C001-29 -->
