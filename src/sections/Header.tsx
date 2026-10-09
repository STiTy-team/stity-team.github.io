import { copy } from "../content";

export function Header() {
  return (
    <header className="top">
      <div className="wrap top-row">
        <a className="brand" href="#top" aria-label="STiTy">
          <img src="assets/logo.webp" alt="STiTy" width="96" height="32" />
        </a>
        <nav className="top-nav" aria-label="페이지">
          <a href="#why">{copy.nav.why}</a>
          <a href="#how">{copy.nav.how}</a>
          <a href="#events">{copy.nav.events}</a>
          <a href="docs/">{copy.nav.docs}</a>
        </nav>
      </div>
    </header>
  );
}
