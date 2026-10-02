import { createRoot } from "react-dom/client";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./styles/global.css";
import "./styles/sections.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
<App />,
);
