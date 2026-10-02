import type { ReactNode } from "react";
import "./letters.css";

export type LetterName = "s" | "t1" | "i" | "t2" | "y";

type Palette = { base: string; shade: string; limb: string };

const PALETTE: Record<LetterName, Palette> = {
  s: { base: "#3F70E8", shade: "#2A52BF", limb: "#3463D6" },
  t1: { base: "#93C0F2", shade: "#6D9BD9", limb: "#7FAEE8" },
  i: { base: "#ABCDF4", shade: "#83ABE0", limb: "#94BBEB" },
  t2: { base: "#8ABD3C", shade: "#66952A", limb: "#79AB33" },
  y: { base: "#F7D04A", shade: "#D9AA20", limb: "#EDC03A" },
};

type Shape = { kind: "stroke"; d: string; width: number } | { kind: "rect"; x: number; y: number; w: number; h: number } | { kind: "circle"; cx: number; cy: number; r: number };

type Arm = { d: string; hand: [number, number]; wave?: boolean };

type Rig = {
  body: Shape[];
  shine: string[];
  face: [number, number];
  eyeGap: number;
  legs: [number, number];
  legTop: number;
  arms: [Arm, Arm];
  brows?: boolean;
};

const RIGS: Record<LetterName, Rig> = {
  s: {
    body: [{ kind: "stroke", d: "M90 44 C 84 22, 34 20, 33 48 C 32 74, 88 66, 88 100 C 88 134, 38 138, 28 110", width: 31 }],
    shine: ["M46 28 Q 58 24 72 28"],
    face: [60, 75],
    eyeGap: 20,
    legs: [50, 74],
    legTop: 126,
    arms: [
      { d: "M22 58 Q 10 52 8 34", hand: [8, 32], wave: true },
      { d: "M102 104 Q 112 112 108 126", hand: [108, 128] },
    ],
  },
  t1: {
    body: [
      { kind: "rect", x: 12, y: 30, w: 96, h: 40 },
      { kind: "rect", x: 38, y: 40, w: 44, h: 92 },
    ],
    shine: ["M22 40 L 48 40"],
    face: [60, 52],
    eyeGap: 26,
    legs: [50, 70],
    legTop: 126,
    arms: [
      { d: "M40 96 Q 26 102 24 116", hand: [24, 118] },
      { d: "M80 94 Q 98 92 100 74", hand: [100, 72] },
    ],
  },
  i: {
    body: [
      { kind: "circle", cx: 60, cy: 36, r: 19 },
      { kind: "rect", x: 39, y: 64, w: 42, h: 68 },
    ],
    shine: ["M50 28 Q 54 24 58 23", "M47 72 L 47 92"],
    face: [60, 92],
    eyeGap: 20,
    legs: [51, 69],
    legTop: 126,
    arms: [
      { d: "M40 104 Q 24 100 22 80", hand: [22, 78], wave: true },
      { d: "M80 104 Q 92 110 92 122", hand: [92, 124] },
    ],
  },
  t2: {
    body: [
      { kind: "rect", x: 12, y: 30, w: 96, h: 40 },
      { kind: "rect", x: 38, y: 40, w: 44, h: 92 },
    ],
    shine: ["M22 40 L 48 40"],
    face: [60, 52],
    eyeGap: 26,
    legs: [50, 70],
    legTop: 126,
    arms: [
      { d: "M40 94 Q 22 92 20 74", hand: [20, 72] },
      { d: "M80 96 Q 94 102 96 116", hand: [96, 118] },
    ],
    brows: true,
  },
  y: {
    body: [
      { kind: "stroke", d: "M34 46 L 56 96", width: 34 },
      { kind: "stroke", d: "M86 46 L 62 104 Q 54 124 38 126", width: 34 },
    ],
    shine: ["M30 40 L 36 54", "M84 40 L 80 52"],
    face: [68, 78],
    eyeGap: 20,
    legs: [46, 66],
    legTop: 128,
    arms: [
      { d: "M44 92 Q 26 90 16 72", hand: [16, 70], wave: true },
      { d: "M88 84 Q 104 78 108 60", hand: [108, 58] },
    ],
  },
};

function shapes(body: Shape[], fill: string, dy = 0, extraWidth = 0): ReactNode {
  return body.map((s, i) => {
    if (s.kind === "stroke") {
      return (
        <path
          key={i}
          d={s.d}
          transform={dy ? `translate(0 ${dy})` : undefined}
          fill="none"
          stroke={fill}
          strokeWidth={s.width + extraWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    if (s.kind === "rect") {
      return <rect key={i} x={s.x - extraWidth / 2} y={s.y + dy - extraWidth / 2} width={s.w + extraWidth} height={s.h + extraWidth} rx={(Math.min(s.w, s.h) + extraWidth) / 2} fill={fill} />;
    }
    return <circle key={i} cx={s.cx} cy={s.cy + dy} r={s.r + extraWidth / 2} fill={fill} />;
  });
}

export function LetterArt({ name, talking = false }: { name: LetterName; talking?: boolean }) {
  const rig = RIGS[name];
  const c = PALETTE[name];
  const [fx, fy] = rig.face;
  const g = rig.eyeGap / 2;

  return (
    <svg className={`letter letter-${name}${talking ? " is-talking" : ""}`} viewBox="0 0 120 160" aria-hidden="true">
      <ellipse cx="60" cy="152" rx="34" ry="5" fill="#1b2a4a" opacity="0.12" />

      {rig.legs.map((x) => (
        <g key={x}>
          <rect x={x - 6} y={rig.legTop} width="12" height="18" rx="6" fill={c.shade} />
          <ellipse cx={x} cy={147} rx="11.5" ry="7.5" fill={c.shade} />
        </g>
      ))}

      {rig.arms.map((arm, i) => (
        <g
          key={i}
          className={arm.wave ? "letter-arm is-waving" : "letter-arm"}
          style={{ transformOrigin: `${arm.d.split(" ")[0].slice(1)}px ${arm.d.split(" ")[1]}px` }}
        >
          <path d={arm.d} fill="none" stroke={c.limb} strokeWidth="8" strokeLinecap="round" />
          <circle cx={arm.hand[0]} cy={arm.hand[1]} r="7.5" fill={c.limb} />
        </g>
      ))}

      {shapes(rig.body, c.shade, 5)}
      {shapes(rig.body, c.base)}
      <g stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.45">
        {rig.shine.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <g className="letter-face">
        <ellipse cx={fx - g - 3} cy={fy + 8} rx="6" ry="3.8" fill="#FF8FA3" opacity="0.6" />
        <ellipse cx={fx + g + 3} cy={fy + 8} rx="6" ry="3.8" fill="#FF8FA3" opacity="0.6" />
        <g className="letter-eyes" style={{ transformOrigin: `${fx}px ${fy}px` }}>
          {[-g, g].map((dx) => (
            <g key={dx}>
              <ellipse cx={fx + dx} cy={fy} rx="4.6" ry="6.2" fill="#1B1F2A" />
              <circle cx={fx + dx + 1.5} cy={fy - 2.4} r="1.9" fill="#fff" />
            </g>
          ))}
        </g>
        {rig.brows && (
          <g stroke="#1B1F2A" strokeWidth="2.2" strokeLinecap="round">
            <path d={`M${fx - g - 5} ${fy - 11} L${fx - g + 4} ${fy - 7.5}`} />
            <path d={`M${fx + g + 5} ${fy - 11} L${fx + g - 4} ${fy - 7.5}`} />
          </g>
        )}
        <g className="letter-mouth" style={{ transformOrigin: `${fx}px ${fy + 7}px` }}>
          <path d={`M${fx - 7} ${fy + 6} Q ${fx} ${fy + 7.5} ${fx + 7} ${fy + 6} Q ${fx + 6} ${fy + 16} ${fx} ${fy + 16} Q ${fx - 6} ${fy + 16} ${fx - 7} ${fy + 6} Z`} fill="#7A2230" />
          <path d={`M${fx - 4} ${fy + 13.4} Q ${fx} ${fy + 10.4} ${fx + 4} ${fy + 13.4} Q ${fx} ${fy + 16.2} ${fx - 4} ${fy + 13.4} Z`} fill="#F0687A" />
        </g>
      </g>
    </svg>
  );
}
