export const BEATS = 6;

export type Screen = "setup" | "chat" | "stage";

export type Frame = {
  screen: Screen;
  pressed: boolean;
  myWords: number;
  myFinal: boolean;
  myTrans: boolean;
  peer2: "hidden" | "partial" | "final";
  peer2Words: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const progress = (b: number, from: number, to: number) => clamp01((b - from) / (to - from));

export function frameAt(b: number, myWordCount: number, peerWordCount: number): Frame {
  const screen: Screen = b < 1.5 ? "setup" : b < 4.55 ? "chat" : "stage";
  const myWords = Math.ceil(progress(b, 1.55, 2.35) * myWordCount);
  const peerWords = Math.ceil(progress(b, 3.45, 3.95) * peerWordCount);
  return {
    screen,
    pressed: b > 1.2,
    myWords,
    myFinal: b >= 2.55,
    myTrans: b >= 2.75,
    peer2: b < 3.45 ? "hidden" : b < 4.05 ? "partial" : "final",
    peer2Words: peerWords,
  };
}

export type Pose = { pos: [number, number, number]; rot: [number, number, number] };

export const POSES: Pose[] = [
  { pos: [0.1, -0.05, 0], rot: [0.1, -0.5, 0.07] },
  { pos: [0, 0, 0.2], rot: [0.02, -0.12, 0] },
  { pos: [0, 0.05, 0.55], rot: [0.06, 0.28, -0.03] },
  { pos: [0, 0.05, 0.8], rot: [0, 0.08, 0] },
  { pos: [0, 0, 0.45], rot: [0.05, -0.3, 0.04] },
  { pos: [0, 0, -0.6], rot: [0, 0.18, -Math.PI / 2] },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

export function poseAt(b: number): Pose {
  const i = Math.min(POSES.length - 2, Math.max(0, Math.floor(b)));
  const t = smooth(clamp01(b - i));
  const a = POSES[i];
  const c = POSES[i + 1];
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    pos: [mix(a.pos[0], c.pos[0]), mix(a.pos[1], c.pos[1]), mix(a.pos[2], c.pos[2])],
    rot: [mix(a.rot[0], c.rot[0]), mix(a.rot[1], c.rot[1]), mix(a.rot[2], c.rot[2])],
  };
}
