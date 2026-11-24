import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './CinematicEntrance.module.css';

export type EntranceStage =
  | 'door-closed'
  | 'door-opening'
  | 'reveal-playing'
  | 'reveal-complete';

interface CinematicEntranceProps {
  onDoorTouch: () => void;
  onRevealReady: () => void;
}

// Transition into reveal.mp4 right as the doors & curtains finish opening
const ENTRANCE_HANDOFF_SEC = 5.5;

export function CinematicEntrance({
  onDoorTouch,
  onRevealReady,
}: CinematicEntranceProps) {
  const [stage, setStage] = useState<EntranceStage>('door-closed');
  const [doorReady, setDoorReady] = useState(false);

  const entranceVideoRef = useRef<HTMLVideoElement | null>(null);
  const revealVideoRef = useRef<HTMLVideoElement | null>(null);

  const revealTriggeredRef = useRef(false);

  const playMuted = useCallback(async (video: HTMLVideoElement) => {
    video.muted = true;
    try {
      await video.play();
    } catch {
      // Ignore if interrupted
    }
  }, []);

  // Ensure closed door frame paints cleanly on iOS/mobile Safari without auto-playing
  const handleEntranceMetadata = useCallback(() => {
    const video = entranceVideoRef.current;
    if (!video) return;
    if (stage === 'door-closed' && video.paused) {
      try {
        video.currentTime = 0.01;
      } catch {
        // Safe to ignore if seek isn't ready yet
      }
    }
  }, [stage]);

  const handleEntranceLoaded = useCallback(() => {
    setDoorReady(true);
  }, []);

  useEffect(() => {
    const video = entranceVideoRef.current;
    if (video && video.readyState >= 2) {
      setDoorReady(true);
    }
    const fallbackTimer = window.setTimeout(() => setDoorReady(true), 2500);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  const startReveal = useCallback(() => {
    if (revealTriggeredRef.current) return;
    revealTriggeredRef.current = true;

    const entranceVideo = entranceVideoRef.current;
    const revealVideo = revealVideoRef.current;
    if (!revealVideo) return;

    setStage('reveal-playing');
    onRevealReady();

    revealVideo.currentTime = 0;
    void playMuted(revealVideo);

    gsap.to(revealVideo, {
      opacity: 1,
      duration: 0.45,
      ease: 'power1.inOut',
      onComplete: () => {
        if (entranceVideo) entranceVideo.pause();
      },
    });
  }, [onRevealReady, playMuted]);

  const handleDoorTouch = useCallback(() => {
    if (stage !== 'door-closed') return;

    const entranceVideo = entranceVideoRef.current;
    if (!entranceVideo) return;

    onDoorTouch();
    setStage('door-opening');
    entranceVideo.currentTime = 0;
    void playMuted(entranceVideo);
  }, [onDoorTouch, playMuted, stage]);

  const handleEntranceTimeUpdate = useCallback(() => {
    const video = entranceVideoRef.current;
    if (!video || stage !== 'door-opening' || revealTriggeredRef.current) return;
    if (video.currentTime >= ENTRANCE_HANDOFF_SEC) {
      startReveal();
    }
  }, [stage, startReveal]);

  const handleRevealEnded = useCallback(() => {
    setStage('reveal-complete');
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (stage === 'door-closed' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleDoorTouch();
      }
    },
    [handleDoorTouch, stage]
  );

  const isDoorClosed = stage === 'door-closed';

  return (
    <section
      className={styles.entranceSection}
      aria-label="Palace Entrance of Abubakar and Maryam"
    >
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.sideOrnamentLeft} aria-hidden="true" />
      <div className={styles.sideOrnamentRight} aria-hidden="true" />

      <div
        className={`${styles.stageFrame} ${isDoorClosed ? styles.stageInteractive : ''}`}
        onClick={isDoorClosed ? handleDoorTouch : undefined}
        onKeyDown={handleKeyDown}
        role={isDoorClosed ? 'button' : undefined}
        tabIndex={isDoorClosed ? 0 : undefined}
        aria-label={isDoorClosed ? 'Touch the palace doors to open and enter' : undefined}
      >
        <div className={styles.innerBorder} aria-hidden="true" />

        {/* Stage 1: Palace Door Entrance — muted, stays closed until touched */}
        <video
          ref={entranceVideoRef}
          className={`${styles.videoLayer} ${styles.entranceVideo}`}
          src="/assets/entramce.mp4"
          preload="auto"
          playsInline
          muted
          onLoadedMetadata={handleEntranceMetadata}
          onLoadedData={handleEntranceLoaded}
          onTimeUpdate={handleEntranceTimeUpdate}
          onEnded={startReveal}
        />

        {/* Stage 2: Reveal — muted, plays completely after the entrance opens */}
        <video
          ref={revealVideoRef}
          className={`${styles.videoLayer} ${styles.revealVideo}`}
          src="/assets/reveal.mp4"
          preload="auto"
          playsInline
          muted
          onEnded={handleRevealEnded}
        />

        {/* Initial loading veil */}
        <div
          className={`${styles.loaderVeil} ${doorReady ? styles.loaderHidden : ''}`}
          aria-hidden={doorReady}
        >
          <span className={styles.loaderMonogram}>A &amp; M</span>
          <span className={styles.loaderLine} />
        </div>
      </div>
    </section>
  );
}
