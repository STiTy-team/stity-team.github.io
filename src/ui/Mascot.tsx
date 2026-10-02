import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { LetterArt, type LetterName } from "./LetterArt";

export type MascotState = "still" | "idle" | "talk" | "watch" | "wait";

type Props = {
  name: LetterName;
  state?: MascotState;
  hop?: number;
  lean?: 1 | -1;
  phase?: number;
  hopDelay?: number;
  className?: string;
  onHover?: () => void;
};

const breathe = (phase: number) => ({
  scaleY: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const, delay: phase },
  scaleX: { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const, delay: phase },
  default: { duration: 0.3, ease: "easeOut" as const },
});

function variants(lean: number, phase: number, hopDelay: number): Variants {
  return {
    still: { y: 0, rotate: 0, scaleX: 1, scaleY: 1 },
    idle: {
      y: 0,
      rotate: 0,
      scaleY: [1, 1.025, 1],
      scaleX: [1, 0.988, 1],
      transition: breathe(phase),
    },
    watch: {
      y: 0,
      rotate: 7 * lean,
      scaleY: [1, 1.025, 1],
      scaleX: [1, 0.988, 1],
      transition: breathe(phase),
    },
    talk: {
      y: [0, -7, 0, -3, 0],
      rotate: 4 * lean,
      scaleY: [1, 1.05, 0.95, 1.02, 1],
      scaleX: [1, 0.976, 1.04, 0.99, 1],
      transition: {
        default: { duration: 0.52, repeat: Infinity, ease: "easeOut" },
        rotate: { duration: 0.3, ease: "easeOut" },
      },
    },
    wait: {
      y: 0,
      rotate: [-2 * lean, -5 * lean, -2 * lean],
      scaleY: [0.98, 0.95, 0.98],
      scaleX: [1.01, 1.025, 1.01],
      transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
    },
    hop: {
      y: [0, 0, -30, 0, 0],
      rotate: 0,
      scaleY: [1, 0.86, 1.08, 0.9, 1],
      scaleX: [1, 1.08, 0.96, 1.06, 1],
      transition: {
        duration: 0.75,
        delay: hopDelay,
        times: [0, 0.14, 0.45, 0.78, 1],
        ease: ["easeOut", "easeOut", "easeIn", "easeOut"],
      },
    },
  };
}

export function Mascot({ name, state = "idle", hop = 0, lean = 1, phase = 0, hopDelay = 0, className, onHover }: Props) {
  const reduced = useReducedMotion();
  const [hopping, setHopping] = useState(false);
  const lastHop = useRef(hop);

  useEffect(() => {
    if (hop === lastHop.current) return;
    lastHop.current = hop;
    setHopping(true);
  }, [hop]);

  const current = reduced ? "still" : hopping ? "hop" : state;

  return (
    <motion.div
      aria-hidden="true"
      className={`mascot${current === "still" ? " is-still" : ""}${className ? ` ${className}` : ""}`}
      style={{ originY: 1, ["--blink-delay" as string]: `${phase * 1.7}s`, ["--wave-delay" as string]: `${phase}s` }}
      variants={variants(lean, phase, hopDelay)}
      initial={false}
      animate={current}
      onAnimationComplete={(definition) => definition === "hop" && setHopping(false)}
      onHoverStart={onHover}
    >
      <LetterArt name={name} talking={current === "talk"} />
    </motion.div>
  );
}
