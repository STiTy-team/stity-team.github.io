import { copy, LINKS } from "../content";

type LinkKey = keyof typeof LINKS;

const LABEL: Record<LinkKey, "demo" | "code" | "contact"> = {
  demo: "demo",
  github: "code",
  contact: "contact",
};

type Props = {
  primary: LinkKey;
  secondary: LinkKey[];
  tone?: "paper" | "blue";
};

export function Actions({ primary, secondary, tone = "paper" }: Props) {
  const available = [primary, ...secondary].filter((key) => LINKS[key]);
  if (!available.length) return null;

  return (
    <div className="actions">
      {available.map((key, i) => {
        const kind = i === 0 ? "primary" : "secondary";
        return (
          <a key={key} className={`btn btn-${tone}-${kind}`} href={LINKS[key]!}>
            {copy.cta[LABEL[key]]}
          </a>
        );
      })}
    </div>
  );
}
