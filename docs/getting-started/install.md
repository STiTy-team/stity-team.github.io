---
title: 설치하기
order: 20
---

# 설치하기

필요한 프로그램은 네 가지예요. `git`과 `make`, `uv`, Node.js예요. 저장소는
STiTy와 datasets 두 개를 나란히 받아요.

파이썬은 따로 설치하지 않아도 돼요. uv가 알아서 맞는 버전을 준비해요.

<!-- S01-C001-08 S01-C001-09 S01-C001-04 -->

::: info 명령은 어디에 치나요 이 문서의 `bash` 상자는 터미널에 그대로 붙여 넣는
명령이에요. 터미널은 Linux와 macOS에서는 "Terminal" 앱이에요. GPU 서버에
접속했다면 그 접속 창이 터미널이에요([원격 서버에서 쓰기](./remote)). :::

::: tip GPU 서버에 설치한다면 먼저 [원격 서버에서 쓰기](./remote)의 SSH 접속부터
읽어요. 아래 명령은 모두 접속한 서버에서 쳐요. :::

## 1. 프로그램 설치하기

먼저 이미 있는지 확인해요. 버전 숫자가 나오면 설치된 거예요.

```bash
git --version
make --version
uv --version
node --version
```

없는 것만 설치해요.

| 프로그램              | 설치 방법 (Ubuntu 기준)                                                             |
| --------------------- | ----------------------------------------------------------------------------------- |
| `git`, `make`, `curl` | `sudo apt-get install -y git make curl`                                             |
| `uv`                  | `curl -LsSf https://astral.sh/uv/install.sh \| sh` 를 실행하고 터미널을 새로 열어요 |
| Node.js               | [nodejs.org](https://nodejs.org)에서 LTS 버전을 설치해요. 실험 매니저에만 필요해요  |

<!-- S07-C001-07 S01-C001-09 -->

## 2. GitHub 접근 준비하기

두 저장소는 `git@github.com:` 주소로 받아요. 이 주소는 SSH 키가 GitHub 계정에
등록돼 있어야 열려요. 키가 없다면 GitHub 안내서
[Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)를
따라 한 번 등록해요. STiTy-team 조직에 초대받았는지도 확인해요.

<!-- S08-C001-11 -->

## 3. 저장소 두 개 받기

같은 폴더 안에 `STiTy`와 `datasets`를 나란히 받아요. 아래는 홈 폴더(`~`)에 받는
예예요.

```bash
cd ~
git clone git@github.com:STiTy-team/STiTy.git
git clone git@github.com:STiTy-team/datasets.git
```

<!-- S08-C001-11 S01-C001-04 -->

`datasets` 폴더가 곧 **데이터 루트**(`STITY_DATA_ROOT`)예요. 다음 문서에서 이
경로를 `.env`에 적어요. <!-- S10-C001-01 -->

## 4. 데이터셋 설치하기 {#datasets}

저장소에는 스크립트만 있고 녹음 파일은 없어요. 쓸 데이터셋을 직접 설치해야 해요.
예를 들어 FLEURS 한국어는 이렇게 받아요. <!-- S10-C001-01 -->

```bash
cd ~/datasets
make install NAME=fleurs/ko_kr
```

설치가 성공하면 그 폴더에 `.status` 파일이 생기고 내용이 `success`가 돼요.
bench는 이 파일이 `success`인 데이터셋만 읽어요.

<!-- S10-C001-02 S01-C001-35 -->

| 확인하고 싶은 것                                    | 명령                                      |
| --------------------------------------------------- | ----------------------------------------- |
| 설치 상태 보기                                      | `make install NAME=fleurs/ko_kr STATUS=1` |
| 이미 있는 데이터를 다시 만들지 않고 설치됨으로 기록 | `make install NAME=fleurs/ko_kr ADOPT=1`  |

<!-- S10-C001-02 -->

어떤 데이터셋이 있는지는 datasets 저장소의 `README.md` 표에 있어요.
`northstar-260928`처럼 변환 결과가 저장소에 이미 들어 있는 것도 있어요.

<!-- S10-C001-03 -->

## 5. 첫 실행 때 기다릴 것

bench, 서버, COMET 채점은 각자 따로 파이썬 환경을 써요. 처음 부를 때 uv가 그
환경을 만들어요. 몇 GB를 받으니 처음 한 번은 시간이 걸려요. 그다음부터는 바로
시작해요. <!-- S01-C001-08 S01-C001-29 -->

다음: [.env 설정하기](./env)
