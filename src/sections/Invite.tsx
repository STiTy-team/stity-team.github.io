import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { copy, LINKS } from "../content";
import { Actions } from "../ui/Actions";
import { Mascot } from "../ui/Mascot";
import type { LetterName } from "../ui/LetterArt";

const CREW: LetterName[] = ["s", "t1", "i", "t2", "y"];

function CrewMember({
  name,
  index,
  wave,
  active,
}: {
  name: LetterName;
  index: number;
  wave: number;
  active: boolean;
}) {
  const [hop, setHop] = useState(0);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (!wave) return;
    setDelay(index * 0.09);
    setHop((n) => n + 1);
  }, [wave, index]);

  const hopNow = () => {
    setDelay(0);
    setHop((n) => n + 1);
  };

  return (
    <Mascot
      name={name}
      state={active ? "idle" : "still"}
      hop={hop}
      hopDelay={delay}
      phase={index * 0.45}
      onHover={hopNow}
    />
  );
}

function Crew() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [wave, setWave] = useState(0);

  useEffect(() => {
    if (inView) setWave((n) => n + 1);
  }, [inView]);

  return (
    <div className="invite-crew" ref={ref}>
      {CREW.map((name, i) => (
        <CrewMember
          key={name}
          name={name}
          index={i}
          wave={wave}
          active={inView}
        />
      ))}
    </div>
  );
}

export function Invite() {
  return (
    <section className="invite" aria-labelledby="inv-title">
      <div className="wrap invite-grid">
        <div>
          <h2 id="inv-title">{copy.invite.title}</h2>
          <p>{copy.invite.lead}</p>
          <Actions
            primary="demo"
            secondary={["contact", "github"]}
            tone="blue"
          />
        </div>
        <Crew />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-row">
        <img
          src="assets/logo.webp"
          alt="STiTy"
          width="72"
          height="24"
          loading="lazy"
        />
        <p>{copy.foot}</p>
        {LINKS.github && <a href={LINKS.github}>GitHub</a>}
      </div>
    </footer>
  );
}
