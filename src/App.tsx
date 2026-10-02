import { MotionConfig } from "motion/react";
import { copy } from "./content";
import { Header } from "./sections/Header";
import { Strip } from "./sections/Strip";
import { Goals } from "./sections/Goals";
import { How } from "./sections/How";
import { Events } from "./sections/Events";
import { Footer, Invite } from "./sections/Invite";
import { Showcase } from "./story/Showcase";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main">
        {copy.skip}
      </a>
      <Header />
      <main id="main">
        <Showcase />
        <Strip />
        <Goals />
        <How />
        <Events />
        <Invite />
      </main>
      <Footer />
    </MotionConfig>
  );
}
