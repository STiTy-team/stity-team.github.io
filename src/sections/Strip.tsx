import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";
import { copy } from "../content";
import { Mascot, type MascotState } from "../ui/Mascot";

type MiniProps = {
  side: "left" | "right";
  state: MascotState;
  hop?: number;
  hopDelay?: number;
  children: ReactNode;
};

function Mini({ side, state, hop = 0, hopDelay = 0, children }: MiniProps) {
  const left = side === "left";
  return (
    <div className={`mini mini-${side}`}>
      {children}
      <Mascot
        name={left ? "t1" : "t2"}
        state={state}
        hop={hop}
        hopDelay={hopDelay}
        lean={left ? 1 : -1}
        phase={left ? 0 : 0.8}
      />
    </div>
  );
}

export function Strip() {
  const w = copy.why;
  const strip = useRef<HTMLOListElement>(null);
  const inView = useInView(strip, { amount: 0.5 });
  const [hop, setHop] = useState(0);

  useEffect(() => {
    if (inView) setHop((n) => n + 1);
  }, [inView]);

  const rest: MascotState = inView ? "idle" : "still";

  return (
    <section className="strip-section" id="why" aria-labelledby="why-title">
      <div className="wrap">
        <p className="section-label">{w.label}</p>
        <h2 id="why-title">{w.title}</h2>
        <p className="section-lead">{w.lead}</p>
        <ol className="strip" ref={strip}>
          <li className="panel">
            <p className="caption-box">{w.p1}</p>
            <div className="panel-scene">
              <Mini side="left" state={rest}>
                <span className="mini-balloon">{w.p1a}</span>
              </Mini>
              <Mini side="right" state={rest} hop={hop} hopDelay={0.4}>
                <span className="mini-balloon">{w.p1b}</span>
              </Mini>
            </div>
          </li>
          <li className="panel panel-wait">
            <p className="caption-box">{w.p2}</p>
            <div className="panel-scene">
              <Mini side="left" state={rest}>
                <span className="mini-balloon">{w.p1a}</span>
              </Mini>
              <span className="sfx" aria-hidden="true">
                {w.sfx}
              </span>
              <Mini side="right" state={inView ? "wait" : "still"}>
                <span className="mini-balloon is-empty">…</span>
              </Mini>
            </div>
          </li>
          <li className="panel">
            <p className="caption-box">{w.p3}</p>
            <div className="panel-scene panel-rewrite">
              <div className="rewrite">
                {w.rewrite.map(([ko, en], i) => (
                  <p key={ko} className={i === 0 ? "rewrite-old" : undefined}>
                    <span className="mini-balloon">{ko}</span>
                    <span className="rewrite-arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="rewrite-out" lang="en">
                      {en}
                    </span>
                  </p>
                ))}
              </div>
              <Mini side="right" state={inView ? "wait" : "still"}>
                <span className="sfx sfx-q" aria-hidden="true">
                  ?
                </span>
              </Mini>
            </div>
          </li>
        </ol>

        <div className="reqs">
          {w.reqs.map((r, i) => (
            <div className={`req req-${i + 1}`} key={r.label}>
              <span>{r.label}</span>
              <strong>{r.title}</strong>
            </div>
          ))}
        </div>
        <p className="source">{w.source}</p>
      </div>
    </section>
  );
}
