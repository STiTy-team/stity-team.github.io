import { useEffect, useState, type RefObject } from "react";
import { copy } from "../content";
import { Actions } from "../ui/Actions";
import { Mascot } from "../ui/Mascot";
import type { LetterName } from "../ui/LetterArt";

const LEFT: LetterName[] = ["s", "t1"];
const RIGHT: LetterName[] = ["i", "t2", "y"];

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  slotRef: RefObject<HTMLDivElement | null>;
};

function Crew({ names, offset }: { names: LetterName[]; offset: number }) {
  const [hop, setHop] = useState(0);
  useEffect(() => setHop(1), []);
  return (
    <div className="hero-crew-group">
      {names.map((name, i) => (
        <Mascot
          key={name}
          name={name}
          className={`hero-mascot hero-mascot-${name}`}
          hop={hop}
          hopDelay={0.5 + (offset + i) * 0.09}
          phase={(offset + i) * 0.5}
        />
      ))}
    </div>
  );
}

export function Hero({ sectionRef, slotRef }: Props) {
  const h = copy.hero;
  return (
    <section className="hero" ref={sectionRef} id="top">
      <div className="wrap hero-head">
        <p className="hero-label">{h.label}</p>
        <h1>
          {h.title[0]}
          <br />
          {h.title[1]} <span className="hero-name">{h.name}</span>
        </h1>
      </div>

      <div className="wrap hero-body">
        <div className="hero-side">
          <p className="hero-lead">{h.body}</p>
          <Actions primary="demo" secondary={["github"]} />
          <a className="hero-scroll" href="#demo">
            {h.scroll} ↓
          </a>
        </div>
        <div className="hero-slot" ref={slotRef} />
        <dl className="hero-side hero-facts">
          {h.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.value}</dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-crew" aria-hidden="true">
        <Crew names={LEFT} offset={0} />
        <Crew names={RIGHT} offset={2} />
      </div>
    </section>
  );
}
