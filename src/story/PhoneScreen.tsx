import { useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { CONVERSATION, copy as allCopy } from "../content";
import { frameAt, type Frame } from "./frames";
import "./phone-screen.css";

const myWords = CONVERSATION.mine.text.split(" ");
const peerWords = CONVERSATION.peer2.text.split(" ");

const copy = allCopy.phone;

type Props = {
  beat: MotionValue<number>;
  landscape: boolean;
};

const sameFrame = (a: Frame, b: Frame) =>
  a.screen === b.screen &&
  a.pressed === b.pressed &&
  a.myWords === b.myWords &&
  a.myFinal === b.myFinal &&
  a.myTrans === b.myTrans &&
  a.peer2 === b.peer2 &&
  a.peer2Words === b.peer2Words;

export function PhoneScreen({ beat, landscape }: Props) {
  const [frame, setFrame] = useState(() =>
    frameAt(beat.get(), myWords.length, peerWords.length),
  );

  useMotionValueEvent(beat, "change", (b) => {
    const next = frameAt(b, myWords.length, peerWords.length);
    setFrame((prev) => (sameFrame(prev, next) ? prev : next));
  });

  return (
    <div className="screen" aria-hidden="true">
      <div className="island" />
      {frame.screen === "setup" && <Setup pressed={frame.pressed} />}
      {frame.screen === "chat" && <Chat frame={frame} />}
      {frame.screen === "stage" && <Stage landscape={landscape} />}
    </div>
  );
}

function TopBar() {
  return (
    <div className="ps-top">
      <img src="assets/logo.webp" alt="" />
      <svg viewBox="0 0 24 24" className="ps-icon">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </svg>
    </div>
  );
}

function Setup({ pressed }: { pressed: boolean }) {
  return (
    <div className="ps-setup">
      <TopBar />
      <h3 className="ps-title">{copy.setupTitle}</h3>
      <div className="ps-cards">
        <div className="ps-card">
          <span className="ps-label">{copy.mine}</span>
          <span className="ps-lang">
            <i className="dot ko" />
            {copy.korean}
          </span>
        </div>
        <span className="ps-swap">⇄</span>
        <div className="ps-card">
          <span className="ps-label">{copy.theirs}</span>
          <span className="ps-lang">
            <i className="dot en" />
            {copy.english}
          </span>
        </div>
      </div>
      <span className="ps-label ps-mode-label">{copy.listen}</span>
      <div className="ps-seg">
        {copy.modes.map((m, i) => (
          <span key={m} className={i === 0 ? "on" : undefined}>
            {m}
          </span>
        ))}
      </div>
      <div className={`ps-cta${pressed ? " pressed" : ""}`}>{copy.start}</div>
    </div>
  );
}

function Chat({ frame }: { frame: Frame }) {
  const showMine = frame.myWords > 0;
  return (
    <div className="ps-chat">
      <TopBar />
      <div className="ps-chips">
        <span className="chip">{copy.chips}</span>
        <span className="chip live">
          <i className="dot pulse" />
          {copy.live}
        </span>
      </div>
      <div className="ps-feed">
        <div className="bubble peer">
          <p>
            <i className="dot en" />
            {CONVERSATION.peer1.text}
          </p>
          <p className="tr">{CONVERSATION.peer1.trans}</p>
        </div>
        {showMine && (
          <div className={`bubble mine${frame.myFinal ? "" : " partial"}`}>
            <p>{myWords.slice(0, frame.myWords).join(" ")}</p>
            {frame.myTrans && <p className="tr">{CONVERSATION.mine.trans}</p>}
          </div>
        )}
        {frame.peer2 !== "hidden" && (
          <div
            className={`bubble peer${frame.peer2 === "partial" ? " partial" : ""}`}
          >
            <p>
              <i className="dot en" />
              {frame.peer2 === "final"
                ? CONVERSATION.peer2.text
                : peerWords.slice(0, frame.peer2Words).join(" ")}
            </p>
            {frame.peer2 === "final" && (
              <p className="tr">{CONVERSATION.peer2.trans}</p>
            )}
          </div>
        )}
      </div>
      <div className="ps-stop">{copy.stop}</div>
    </div>
  );
}

function Stage({ landscape }: { landscape: boolean }) {
  return (
    <div className={`ps-stage${landscape ? " landscape" : ""}`}>
      <div className="ps-stage-inner">
        <span className="ps-stage-title">{copy.stageTitle}</span>
        <div className="lane">
          <i className="dot ko" />
          <p lang="ko">{CONVERSATION.mine.text}</p>
        </div>
        <div className="lane">
          <i className="dot en" />
          <p lang="en">{CONVERSATION.mine.trans}</p>
        </div>
      </div>
    </div>
  );
}
