import { copy, EVENT_META } from "../content";

export function Events() {
  const e = copy.events;
  return (
    <section className="events" id="events" aria-labelledby="ev-title">
      <div className="wrap">
        <p className="section-label">{e.label}</p>
        <h2 id="ev-title">{e.title}</h2>
        <p className="ev-lead">{e.lead}</p>
        <div className="ev-grid">
          {e.items.map((item, i) => (
            <figure
              className={`ev${i === 0 ? " ev-wide" : ""}`}
              key={EVENT_META[i].date}
            >
              <img
                src={EVENT_META[i].img}
                alt={item.alt}
                width="960"
                height="960"
                loading="lazy"
              />
              <figcaption>
                <strong>{item.title}</strong>
                <time dateTime={EVENT_META[i].date}>{EVENT_META[i].label}</time>
                <span>{item.body}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ol className="ev-timeline">
          {e.timeline.map(([term, body]) => (
            <li key={term}>
              <strong>{term}</strong>
              <span>{body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
