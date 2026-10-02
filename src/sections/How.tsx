import { copy } from "../content";

function Sentence({ mark, note, tone }: { mark: string; note: string; tone: "blue" | "green" }) {
  const [before, after] = copy.how.sentence;
  return (
    <div className="seg-row">
      <p>
        <span>{before}</span>
        <mark className={`seg-mark seg-${tone}`}>{mark}</mark>
        <span>{after}</span>
      </p>
      <span className={`seg-note seg-${tone}`}>↑ {note}</span>
    </div>
  );
}

export function How() {
  const h = copy.how;
  return (
    <section className="how" id="how" aria-labelledby="how-title">
      <div className="wrap">
        <p className="section-label">{h.label}</p>
        <h2 id="how-title">{h.title}</h2>
        <p className="section-lead">{h.lead}</p>

        <ol className="pipeline">
          {h.pipeline.map(([name, sub]) => (
            <li key={name} className={name === "<SEG>" ? "pipe-seg" : name === "Streaming ASR" ? "pipe-asr" : undefined}>
              <strong>{name}</strong>
              <span>{sub}</span>
            </li>
          ))}
        </ol>

        <div className="seg-compare">
          <div className="seg-card">
            <span className="seg-tag">{h.original.tag}</span>
            <h3>{h.original.title}</h3>
            {h.original.rows.map((r) => (
              <Sentence key={r.mark} mark={r.mark} note={r.note} tone="blue" />
            ))}
          </div>
          <div className="seg-card seg-card-tuned">
            <span className="seg-tag">{h.finetuned.tag}</span>
            <h3>{h.finetuned.title}</h3>
            <p className="seg-sub">{h.finetuned.sub}</p>
            <Sentence mark={h.finetuned.mark} note={h.finetuned.note} tone="green" />
          </div>
        </div>

        <div className="priority">
          <span>{h.priorityLabel}</span>
          <ol>
            {h.priority.map((p, i) => (
              <li key={p} className={i === 0 ? "priority-top" : undefined}>
                {p}
              </li>
            ))}
          </ol>
        </div>

        <div className="translate">
          <div>
            <h3>{h.translate.title}</h3>
            <p>{h.translate.body}</p>
          </div>
          <ol className="translate-flow">
            {h.translate.flow.map(([title, sub], i) => (
              <li key={title} className={`flow-${i}`}>
                <strong>{title}</strong>
                {sub && <span>{sub}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
