# STiTy 랜딩 페이지

Vite + React + TypeScript. 빌드 결과는 정적 파일이라 GitHub Pages에 그대로
올라가요.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 확인
```

## 고칠 곳

| 무엇                                         | 파일                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| 모든 문구, 행사 기록, 링크(`LINKS`)          | `src/content.ts`                                             |
| 첫 화면(히어로)                              | `src/story/Hero.tsx`                                         |
| 히어로 → 데모로 이어지는 스크롤, 휴대폰 위치 | `src/story/Showcase.tsx`, `slots.ts`                         |
| 스크롤 단계별 휴대폰 화면과 자세             | `src/story/frames.ts`                                        |
| 휴대폰 화면 UI                               | `src/story/PhoneScreen.tsx`, `phone-screen.css`              |
| 3D 휴대폰 모델과 조명                        | `src/story/Phone3D.tsx`                                      |
| 각 단계 옆 상세 블록                         | `src/story/StepDetail.tsx`                                   |
| 캐릭터 움직임                                | `src/ui/Mascot.tsx`, 스토리 연동은 `src/story/StageCast.tsx` |
| 아래쪽 섹션들                                | `src/sections/`                                              |

`LINKS`의 값이 `null`이면 그 버튼은 숨겨지고 다음 버튼이 주 버튼이 돼요. 데모
주소와 연락처가 생기면 채우면 돼요.

학기마다 바뀌는 내용(측정값, 학기 계획)은 이 페이지에 넣지 않아요. 새 행사는
`copy.events`에 추가하면 돼요.

## 배포

`.github/workflows/deploy.yml`이 `main`에 push될 때 GitHub Pages로 배포해요.
저장소 설정 → Pages → Source를 "GitHub Actions"로 바꿔야 해요. 이 폴더가 더 큰
저장소 안에 들어간다면 workflow 파일을 저장소 루트의 `.github/workflows/`로
옮기고, 각 `run` 단계에 `working-directory: landing`, 업로드 경로를
`landing/dist`로 바꿔요.
