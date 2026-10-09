import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import type { DefaultTheme } from "vitepress";

const IGNORED = new Set([".vitepress", "public", "node_modules"]);

interface Meta {
  title: string;
  order: number;
}

function readMeta(file: string, fallback: string): Meta {
  const source = readFileSync(file, "utf8");
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const field = (key: string) =>
    front.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, "m"))?.[1];
  const heading = source.match(/^#\s+(.+)$/m)?.[1];
  const order = Number(field("order"));
  return {
    title: field("title") ?? heading ?? fallback,
    order: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER,
  };
}

function toLink(root: string, file: string) {
  const path = relative(root, file).replace(/\\/g, "/").replace(/\.md$/, "");
  return "/" + path.replace(/(^|\/)index$/, "$1");
}

function isPage(name: string) {
  return name.endsWith(".md") && !name.startsWith("_") && name !== "README.md";
}

function byOrder(a: Meta, b: Meta) {
  return a.order - b.order || a.title.localeCompare(b.title, "ko");
}

function readSection(
  root: string,
  dir: string,
): (DefaultTheme.SidebarItem & Meta)[] {
  const entries = readdirSync(dir).filter(
    (name) => !IGNORED.has(name) && !name.startsWith("."),
  );

  const pages = entries
    .filter((name) => isPage(name) && name !== "index.md")
    .map((name) => {
      const file = join(dir, name);
      return {
        ...readMeta(file, name.replace(/\.md$/, "")),
        link: toLink(root, file),
      };
    });

  const sections = entries
    .filter((name) => statSync(join(dir, name)).isDirectory())
    .flatMap((name) => {
      const sub = join(dir, name);
      const index = join(sub, "index.md");
      const hasIndex = readdirSync(sub).includes("index.md");
      const items = readSection(root, sub);
      if (!hasIndex && items.length === 0) return [];
      const meta = hasIndex
        ? readMeta(index, name)
        : { title: name, order: Number.MAX_SAFE_INTEGER };
      return [
        {
          ...meta,
          link: hasIndex ? toLink(root, index) : undefined,
          items,
          collapsed: false,
        },
      ];
    });

  return [...pages, ...sections].sort(byOrder);
}

export function buildSidebar(root: string): DefaultTheme.SidebarItem[] {
  const strip = ({
    title,
    items,
    order: _order,
    ...rest
  }: DefaultTheme.SidebarItem & Meta): DefaultTheme.SidebarItem => ({
    ...rest,
    text: title,
    ...(items?.length
      ? { items: (items as (DefaultTheme.SidebarItem & Meta)[]).map(strip) }
      : {}),
  });
  return readSection(root, root).map(strip);
}
