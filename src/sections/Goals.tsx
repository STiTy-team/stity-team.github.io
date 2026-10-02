import { copy } from "../content";

export function Goals() {
  const g = copy.goals;
  return (
    <section className="goals" aria-labelledby="goals-title">
      <div className="wrap">
        <p className="section-label">{g.label}</p>
        <h2 id="goals-title">{g.title}</h2>
        <ol className="goal-list">
          {g.items.map(([title, body], i) => (
            <li key={title}>
              <span className="goal-num">{i + 1}</span>
              <strong>{title}</strong>
              <span>{body}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
