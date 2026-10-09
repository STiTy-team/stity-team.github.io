import { copy } from "../content";

function Modes() {
  return (
    <>
      <ul className="detail-list">
        {copy.modes.map((m) => (
          <li key={m.name}>
            <strong>{m.name}</strong>
            <span>{m.body}</span>
          </li>
        ))}
      </ul>
      <p className="detail-label">{copy.langsLabel}</p>
      <ul className="lang-chips">
        {copy.langs.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </>
  );
}

function Partial() {
  const p = copy.partial;
  return (
    <figure className="partial-demo">
      <figcaption className="detail-label">{p.label}</figcaption>
      <ol>
        {p.steps.map(([t, text]) => (
          <li key={t}>
            <span className="partial-t">{t}</span>
            <span className="partial-text">“{text}”</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function Speed() {
  const sp = copy.speed;
  return (
    <figure className="race">
      <figcaption className="detail-label">{sp.label}</figcaption>
      {sp.rows.map((r) => {
        const from = ("from" in r && r.from) || 0;
        return (
          <div className="race-row" key={r.name}>
            <span className="race-name">{r.name}</span>
            <span className="race-track">
              <span
                className={`race-bar race-${r.tone}`}
                style={{
                  left: `${(from / 5) * 100}%`,
                  width: `${((r.value - from) / 5) * 100}%`,
                }}
              />
            </span>
            <span className="race-value">{r.text}</span>
          </div>
        );
      })}
      <div className="race-axis" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((s) => (
          <span key={s}>{s}초</span>
        ))}
      </div>
      <p className="detail-source">{sp.source}</p>
    </figure>
  );
}

function Speakers() {
  const s = copy.speakers;
  return (
    <div className="speakers">
      <div className="speaker speaker-peer">
        <span className="speaker-bubble">
          <i className="dot en" />
          {s.peer}
        </span>
        <span>{s.peerLang}</span>
      </div>
      <div className="speaker speaker-mine">
        <span className="speaker-bubble">
          <i className="dot ko" />
          {s.mine}
        </span>
        <span>{s.mineLang}</span>
      </div>
    </div>
  );
}

function StagePhoto() {
  return (
    <figure className="stage-photo">
      <img
        src="assets/event-2.webp"
        alt="행사 무대 옆 모니터에 영어 자막이 떠 있다. 얼굴은 흐리게 처리됐다."
        width="960"
        height="960"
        loading="lazy"
      />
      <figcaption>{copy.stagePhoto}</figcaption>
    </figure>
  );
}

const DETAILS = [Modes, Partial, Speed, Speakers, StagePhoto];

export function StepDetail({ index }: { index: number }) {
  const Detail = DETAILS[index];
  return Detail ? <Detail /> : null;
}
