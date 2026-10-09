import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { h } from "vue";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./style.css";
import SectionIndex from "./SectionIndex.vue";

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { "doc-footer-before": () => h(SectionIndex) }),
  enhanceApp({ app }) {
    app.component("SectionIndex", SectionIndex);
  },
} satisfies Theme;
