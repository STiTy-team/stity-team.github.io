# 개발 문서 쓰는 법

이 폴더는 [VitePress](https://vitepress.dev)로 만든 개발 문서예요. 배포하면 `https://stity-team.github.io/docs/`에 올라가요.

```bash
npm run docs:dev      # http://localhost:5173/docs/
npm run docs:build    # dist/docs/ 생성
```

## 문서 추가하기

마크다운 파일을 만들면 사이드바에 자동으로 들어가요. 설정 파일은 고치지 않아도 돼요.

| 하고 싶은 것 | 방법 |
|---|---|
| 새 문서 | 폴더 안에 `이름.md` 만들기. `_template.md`를 복사해서 시작해요 |
| 새 섹션 | 폴더를 만들고 그 안에 `index.md` 두기. `index.md`의 제목이 섹션 이름이 돼요 |
| 순서 바꾸기 | frontmatter의 `order` 숫자. 작을수록 위에 와요. 없으면 제목 가나다순 |
| 사이드바 제목 | frontmatter의 `title`. 없으면 첫 번째 `#` 제목을 써요 |
| 초안 숨기기 | 파일 이름을 `_`로 시작하기. 빌드와 사이드바에서 빠져요 |
| 이미지 | 문서 옆에 두고 상대 경로로 넣기: `![설명](./image.png)` |

섹션의 `index.md` 아래에는 그 섹션의 문서 목록이 자동으로 붙어요. 끄려면 frontmatter에 `sectionIndex: false`를 써요.

## 쓰는 규칙

- 한국어로만 써요. 문체는 소개 페이지와 같은 해요체예요.
- 문서 하나에 `#` 제목은 하나만 둬요. 그 아래는 `##`, `###`만 써요. 목차는 이 둘로 만들어져요.
- 코드, 파일 경로, 설정 키는 `` `백틱` ``으로 감싸요.
- 강조 상자는 `::: tip`, `::: info`, `::: warning`, `::: danger`를 써요.
- 학기마다 바뀌는 측정값은 날짜와 출처를 같이 적어요.

## 디자인 고치기

| 무엇 | 파일 |
|---|---|
| 색, 글꼴, 표·코드 블록 모양 | `.vitepress/theme/style.css` |
| 사이트 제목, 상단 메뉴, 검색, 한국어 문구 | `.vitepress/config.ts` |
| 사이드바 자동 생성 규칙 | `.vitepress/sidebar.ts` |
| 섹션 문서 목록 | `.vitepress/theme/SectionIndex.vue` |

색은 소개 페이지(`src/styles/global.css`)와 같은 STiTy 토큰을 써요. 어두운 테마는 `STiTy/DESIGN.md`의 bench 어두운 토큰이에요.
