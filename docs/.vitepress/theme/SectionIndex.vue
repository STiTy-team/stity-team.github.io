<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase, type DefaultTheme } from "vitepress";

const { theme, page, frontmatter } = useData<DefaultTheme.Config>();

const current = computed(() => {
  const path = page.value.relativePath;
  if (!path.endsWith("index.md") || frontmatter.value.sectionIndex === false)
    return null;
  const link = "/" + path.replace(/index\.md$/, "");
  const sidebar = (theme.value.sidebar ?? []) as DefaultTheme.SidebarItem[];
  if (link === "/") return sidebar;
  const find = (
    items: DefaultTheme.SidebarItem[],
  ): DefaultTheme.SidebarItem | undefined => {
    for (const item of items) {
      if (item.link === link) return item;
      const found = item.items && find(item.items);
      if (found) return found;
    }
  };
  return find(sidebar)?.items ?? null;
});
</script>

<template>
  <nav v-if="current?.length" class="section-index" aria-label="이 섹션의 문서">
    <a
      v-for="item in current"
      :key="item.text"
      :href="item.link ? withBase(item.link) : undefined"
      class="section-index-item"
    >
      <span class="section-index-title">{{ item.text }}</span>
      <span v-if="item.items?.length" class="section-index-count"
        >문서 {{ item.items.length }}개</span
      >
    </a>
  </nav>
</template>
