import { useState, useEffect } from "react";

const INTRO_DURATION = 2800;

const IntroLoader = ({ onComplete }) => {
  const [phase, setPhase] = useState("enter");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / INTRO_DURATION) * 100, 100));
    }, 16);

    const exitTimer = setTimeout(() => setPhase("exit"), INTRO_DURATION - 600);
    const doneTimer = setTimeout(() => onComplete?.(), INTRO_DURATION);

    return () => {
      clearInterval(tick);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div className={`intro-loader ${phase === "exit" ? "intro-loader--exit" : ""}`}>
      <div className="intro-loader__bg" />
      <div className="intro-loader__glow" />

      {/* Floating embers */}
      <div className="intro-embers" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="intro-ember"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Fire base */}
      <div className="intro-fire-pit" aria-hidden="true">
        <div className="intro-flame intro-flame--1" />
        <div className="intro-flame intro-flame--2" />
        <div className="intro-flame intro-flame--3" />
        <div className="intro-flame intro-flame--4" />
        <div className="intro-flame intro-flame--5" />
      </div>

      <div className="intro-loader__content">
        <p className="intro-tagline animate-flicker">PREMIUM STREETWEAR</p>
        <h1 className="intro-logo font-display">KGF</h1>
        <p className="intro-subtitle">IGNITE YOUR STYLE</p>

        <div className="intro-progress">
          <div className="intro-progress__track">
            <div
              className="intro-progress__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="intro-progress__text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
