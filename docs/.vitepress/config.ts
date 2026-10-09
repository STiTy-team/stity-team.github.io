import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { buildSidebar } from "./sidebar";

const REPO = "https://github.com/STiTy-team/stity-team.github.io";
const srcDir = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  lang: "ko-KR",
  title: "STiTy 개발 문서",
  titleTemplate: ":title · STiTy 개발 문서",
  description: "STiTy 실시간 동시통역 시스템의 개발 문서",
  base: "/docs/",
  outDir: "../dist/docs",
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ["README.md", "**/_*.md"],
  head: [
    ["link", { rel: "icon", href: "/docs/assets/favicon.png" }],
    ["meta", { name: "theme-color", content: "#FFFFFF" }],
  ],
  vite: {
    publicDir: "../public",
  },
  markdown: {
    container: {
      tipLabel: "팁",
      infoLabel: "참고",
      warningLabel: "주의",
      dangerLabel: "위험",
      detailsLabel: "자세히",
    },
  },
  themeConfig: {
    logo: { src: "/assets/logo.webp", alt: "STiTy" },
    siteTitle: "개발 문서",
    nav: [
      {
        text: "소개 페이지",
        link: "https://stity-team.github.io/",
        target: "_self",
      },
    ],
    socialLinks: [{ icon: "github", link: REPO, ariaLabel: "GitHub 저장소" }],
    sidebar: buildSidebar(srcDir),
    outline: { level: [2, 3], label: "이 페이지에서" },
    editLink: {
      pattern: `${REPO}/edit/main/docs/:path`,
      text: "GitHub에서 이 페이지 고치기",
    },
    lastUpdated: {
      text: "마지막 수정",
      formatOptions: { dateStyle: "medium" },
    },
    docFooter: { prev: "이전", next: "다음" },
    darkModeSwitchLabel: "화면 테마",
    lightModeSwitchTitle: "밝은 테마로 바꾸기",
    darkModeSwitchTitle: "어두운 테마로 바꾸기",
    sidebarMenuLabel: "메뉴",
    returnToTopLabel: "맨 위로",
    externalLinkIcon: true,
    notFound: {
      title: "페이지를 찾을 수 없어요",
      quote: "주소가 바뀌었거나 아직 쓰지 않은 문서예요.",
      linkLabel: "문서 홈으로",
      linkText: "문서 홈으로 가기",
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "검색", buttonAriaLabel: "문서 검색" },
          modal: {
            displayDetails: "자세히 보기",
            resetButtonTitle: "검색어 지우기",
            backButtonTitle: "검색 닫기",
            noResultsText: "검색 결과가 없어요",
            footer: {
              selectText: "열기",
              selectKeyAriaLabel: "엔터",
              navigateText: "이동",
              navigateUpKeyAriaLabel: "위 화살표",
              navigateDownKeyAriaLabel: "아래 화살표",
              closeText: "닫기",
              closeKeyAriaLabel: "esc",
            },
          },
        },
      },
    },
  },
});
