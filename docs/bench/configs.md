---
title: 설정 파일 쓰기
order: 10
---

# 설정 파일 쓰기

설정 파일은 두 종류뿐이에요. **파이프라인 설정**은 무엇을 재는지(모델과 커밋 규칙)를, **데이터셋 설정**은 무엇을 먹이는지(녹음 묶음과 번역할 언어)를 적어요. 둘 다 YAML 파일이고, 원본은 팀 S3에 있어요. 보통 [Configs 페이지](../bench-manager/configs)에서 만들어요. <!-- S01-C001-13 -->

::: info YAML 읽는 법
YAML은 `키: 값`을 줄마다 적는 형식이에요. 들여쓰기(빈칸 2개)가 "이 키 안에 들어 있다"는 뜻이에요. `#` 뒤는 설명이라 무시돼요. `[a, b]`는 목록이에요.
:::

## 파이프라인 설정

영어 화자용 파이프라인의 실제 내용이에요. <!-- S11-C001-04 S01-C001-16 -->

```yaml
meta:
  description: English-finetuned Qwen3-ASR with SEG commits, then Qwen3.5-4B translation with one turn of context
  tags: [cascade, qwen-seg, en-asr, local-mt]
pipeline:
  name: cascade                 # 받아쓰기 → 번역을 차례로 잇는 파이프라인
  transcription:                # ASR (받아쓰기)
    name: qwen-seg
    model: Doo12/Qwen3-ASR-1.7B-en-silence-c80-merged
    chunk_size_sec: 2.0         # 모델에 딸린 값은 그 모델 밑에 써요
    max_new_tokens: 128
    dot_commit_confirm: true
    dot_commit_stall_chunks: 1
    rep_dedup: true
  translation:                  # MT (번역)
    name: qwen3.5
    url: http://127.0.0.1:8100/v1
    model: Qwen/Qwen3.5-4B
    gpu_memory_utilization: 0.52
    context_turns: 1
  vad:                          # 말 구간 찾기
    name: silero
    min_silence_ms: 800
commit: seg                     # seg | punct | always
gpu_memory_utilization: 0.30    # ASR 엔진이 쓸 GPU 메모리 몫
```

| 키 | 뜻 |
|---|---|
| `meta` | 설명과 태그. 실행 내용은 바꾸지 않아요. [이름 규칙과 버전](./naming#meta) |
| `pipeline.name` | 부품을 잇는 방식이에요. 지금 쓰는 것은 `cascade`와 `vela`예요 |
| `pipeline.transcription` | 받아쓰기 부품. `name`은 부품 이름, 그 아래는 그 부품의 설정이에요 |
| `pipeline.translation` | 번역 부품 |
| `pipeline.vad` | 말 구간 찾기 부품. `min_silence_ms`만큼 조용하면 말이 끝났다고 봐요 |
| `commit` | 언제 문장을 확정할지 (아래 표) |
| `gpu_memory_utilization` | ASR 엔진이 GPU 메모리의 몇 할을 쓸지. **반드시 적어요** |

<!-- S01-C001-16 S11-C001-04 S11-C001-05 S07-C001-14 -->

`translation: gpt`처럼 이름만 쓰면 `{name: gpt}`와 같아요. <!-- S01-C001-23 -->

### `commit` 값

| 값 | 문장을 확정하는 때 |
|---|---|
| `seg` | 모델이 문장 끝 표시(`<SEG>`)를 냈을 때 |
| `punct` | 마침표 같은 문장부호가 나왔을 때. 결과의 커밋 이유에는 `dot`으로 나와요 |
| `always` | 소리 조각마다 |

<!-- S01-C001-24 -->

### 언어마다 파이프라인이 따로예요

서버 하나는 모델 하나만 들고, 사용자는 언어에 맞는 서버에 붙어요. 그래서 파이프라인 설정도 언어마다 하나예요. 영어용은 `...-en-silence-c80-merged`, 한국어용은 `...-ko-silence-v4c900-merged` 모델을 써요. <!-- S01-C001-17 -->

## 데이터셋 설정

가장 작은 데이터셋 설정이에요. FLEURS 한국어 문장 두 개를 영어로 번역하고, 1분 안에 끝나요. 머신이 잘 도는지 확인할 때 써요. <!-- S11-C001-01 -->

```yaml
meta:
  description: Two FLEURS Korean sentences, translated to English -- checks a machine end to end in about a minute
  tags: [fleurs, sentence, clean, smoke]
dataset:
  name: fleurs/ko_kr    # 데이터 루트 아래 폴더 이름
  limit: 2              # 앞에서 2개만
target: en              # 들린 말을 모두 이 언어로 번역해요
```

| 키 | 뜻 |
|---|---|
| `dataset.name` | 데이터 루트(`STITY_DATA_ROOT`) 아래의 데이터셋 폴더 |
| `target` | 번역할 언어 하나. 실행 하나는 듣는 사람 한 명이에요 |
| `dataset.limit` | 앞에서 N개만 돌려요 |
| `dataset.pick: longest` | `limit`과 같이 쓰면 앞의 N개 대신 가장 긴 N개를 돌려요 |
| `dataset.longform` | 발표나 대화 전체를 한 번에 흘려요. [소음, 울림, 긴 발표](./augment#longform) |
| `augment` | 소음이나 울림을 입혀요. [소음, 울림, 긴 발표](./augment) |

<!-- S01-C001-18 S01-C001-20 S01-C001-21 S01-C001-22 S01-C001-25 -->

::: warning `limit`은 따로 된 파일에 둬요
결과 폴더 이름은 설정 이름에서 나와요. 같은 파일에 `limit`을 넣었다 뺐다 하면 일부만 돈 결과와 전부 돈 결과가 같은 폴더를 다퉈요. `fleurs_ko-en_top50`처럼 이름을 따로 지어요.
:::

<!-- S01-C001-20 -->

### 원래 말한 언어는 적지 않아요

어느 언어로 말했는지는 데이터셋 폴더의 `dataset.yml`이 정해요. 예를 들어 `fleurs/en_us`는 영어예요. <!-- S01-C001-19 -->

목표 언어로 말한 문장은 번역하지 않고 그대로 넘겨요. 그런 문장은 번역 점수(BLEU, COMET, LAAL)에서 빠져요. 받아쓰기 점수(WER, CER)에는 모두 들어가요. <!-- S01-C001-25 -->

## 꼭 지킬 것

- **모르는 키를 쓰면 실행이 멈춰요.** 오타가 조용히 무시되면 아무 일도 안 일어난 채 그럴듯한 점수가 나오기 때문이에요. 예: `dataset: unknown key(s) ['nmae']`
- **이름이 틀리면 있는 이름 목록을 보여 주고 멈춰요.**
- **소리를 흘리는 속도는 설정이 아니에요.** 200ms 조각, 끝에 붙이는 침묵 4초가 고정이에요.

<!-- S01-C001-23 -->

## 아직 S3에 없는 설정 시험하기

설정 이름 대신 파일 경로를 주면 S3를 거치지 않고 그 파일로 돌려요. 자세한 것은 [이 컴퓨터에서 돌리기](./run-locally#local-config)에 있어요. <!-- S01-C001-13 -->
