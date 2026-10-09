export type Rect = { x: number; y: number; w: number; h: number };

export type Slots = {
  hero: Rect;
  stage: Rect;
  view: { w: number; h: number };
};

export function headerHeight() {
  return (
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
    ) || 64
  );
}

export function measureSlots(
  heroSlot: HTMLElement,
  stageSlot: HTMLElement,
  stage: HTMLElement,
): Slots {
  const top = headerHeight();
  const scrollY = window.scrollY;
  const hero = heroSlot.getBoundingClientRect();
  const slot = stageSlot.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  return {
    hero: {
      x: hero.left,
      y: hero.top + scrollY - top,
      w: hero.width,
      h: hero.height,
    },
    stage: {
      x: slot.left,
      y: slot.top - stageRect.top,
      w: slot.width,
      h: slot.height,
    },
    view: { w: window.innerWidth, h: window.innerHeight - top },
  };
}
