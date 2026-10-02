import { useRef, useState } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "motion/react";
import { Mascot, type MascotState } from "../ui/Mascot";

type Cast = { s: MascotState; y: MascotState; sHop: number; yHop: number };

const MY_TALK: [number, number] = [1.55, 2.55];
const PEER_TALK: [number, number] = [3.45, 4.05];
const MY_TRANSLATED = 2.75;
const PEER_TRANSLATED = 4.05;
const STAGE = 4.55;

const within = (b: number, [from, to]: [number, number]) => b >= from && b < to;

function stateAt(b: number, talk: [number, number]): MascotState {
  if (b >= STAGE) return "watch";
  return within(b, talk) ? "talk" : "idle";
}

export function StageCast({ beat, active }: { beat: MotionValue<number>; active: boolean }) {
  const prev = useRef(beat.get());
  const [cast, setCast] = useState<Cast>(() => ({
    s: stateAt(beat.get(), MY_TALK),
    y: stateAt(beat.get(), PEER_TALK),
    sHop: 0,
    yHop: 0,
  }));

  useMotionValueEvent(beat, "change", (b) => {
    const crossed = (at: number) => prev.current < at && b >= at;
    const yHop = crossed(MY_TRANSLATED) ? 1 : 0;
    const sHop = crossed(PEER_TRANSLATED) ? 1 : 0;
    prev.current = b;
    setCast((c) => {
      const next = { s: stateAt(b, MY_TALK), y: stateAt(b, PEER_TALK), sHop: c.sHop + sHop, yHop: c.yHop + yHop };
      const same = next.s === c.s && next.y === c.y && next.sHop === c.sHop && next.yHop === c.yHop;
      return same ? c : next;
    });
  });

  const entrance = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 260, damping: 18, delay },
  });

  return (
    <>
      <motion.div className="stage-mascot stage-mascot-s" {...entrance(0.25)}>
        <Mascot name="s" state={active ? cast.s : "still"} hop={cast.sHop} lean={1} />
      </motion.div>
      <motion.div className="stage-mascot stage-mascot-y" {...entrance(0.4)}>
        <Mascot name="y" state={active ? cast.y : "still"} hop={cast.yHop} lean={-1} phase={1.1} />
      </motion.div>
    </>
  );
}
