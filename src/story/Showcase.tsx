import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { copy } from "../content";
import { Hero } from "./Hero";
import { PhoneScreen } from "./PhoneScreen";
import { StageCast } from "./StageCast";
import { StepDetail } from "./StepDetail";
import { BEATS } from "./frames";
import { measureSlots, type Slots } from "./slots";
import "./story.css";

const Phone3D = lazy(() => import("./Phone3D"));

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Showcase() {
  const showcase = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroSlot = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const stageSlot = useRef<HTMLDivElement>(null);
  const slots = useRef<Slots | null>(null);

  const reduced = useReducedMotion() ?? false;
  const active = useInView(showcase, { margin: "100px 0px" });
  const storyActive = useInView(story, { margin: "100px 0px" });
  const [webgl] = useState(hasWebGL);
  const [screenHost] = useState(() => document.createElement("div"));

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start 64px", "end 64px"],
  });
  const { scrollYProgress: storyProgress } = useScroll({
    target: story,
    offset: ["start 64px", "end end"],
  });
  const beat = useTransform(storyProgress, [0, 1], [1, BEATS - 1]);

  useLayoutEffect(() => {
    const measure = () => {
      if (heroSlot.current && stageSlot.current && stage.current) {
        slots.current = measureSlots(
          heroSlot.current,
          stageSlot.current,
          stage.current,
        );
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="showcase" ref={showcase}>
      {webgl && (
        <div className="showcase-track" aria-hidden="true">
          <div className="showcase-canvas">
            <Suspense fallback={null}>
              <Phone3D
                beat={beat}
                hero={heroProgress}
                slots={slots}
                reduced={reduced}
                active={active}
                screen={screenHost}
              />
            </Suspense>
            {createPortal(
              <PhoneScreen beat={beat} landscape={!reduced} />,
              screenHost,
            )}
          </div>
        </div>
      )}

      <Hero sectionRef={heroRef} slotRef={heroSlot} />

      <section className="story" ref={story} id="demo" aria-label="STiTy 데모">
        <div className="story-back" ref={stage} aria-hidden="true">
          <div className="stage-panel">
            <div className="stage-slot" ref={stageSlot}>
              {!webgl && (
                <div className="phone-flat">
                  <PhoneScreen beat={beat} landscape={false} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="story-front" aria-hidden="true">
          <div className="stage-cast">
            <StageCast beat={beat} active={storyActive} />
          </div>
        </div>

        <div className="story-steps">
          {copy.story.map((step, i) => (
            <article className="step" key={step.title}>
              <div className="step-card">
                <p className="section-label">{step.label}</p>
                <h2>{step.title}</h2>
                <p className="step-body">{step.body}</p>
                <div className="step-detail">
                  <StepDetail index={i} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
