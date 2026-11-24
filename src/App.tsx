import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CinematicEntrance } from './components/CinematicEntrance/CinematicEntrance';
import { CountdownSection } from './components/CountdownSection/CountdownSection';
import { PrayerSection } from './components/PrayerSection/PrayerSection';
import { ParentsAndCurtainsSection } from './components/ParentsAndCurtainsSection/ParentsAndCurtainsSection';
import { EventsSection } from './components/EventsSection/EventsSection';
import { ClosingSection } from './components/ClosingSection/ClosingSection';
import { BackgroundMusic } from './components/BackgroundMusic/BackgroundMusic';

const AUDIO_SRC =
  '/assets/YTDown.com_YouTube_Media_PHbZ9SXHJwA_Maher-Zain-For-The-Rest-Of-My-Life-Official-Music-Video_009_vbr.mp3';

export default function App() {
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioStartedRef = useRef(false);

  // Always start at the closed entrance door on load/refresh — no scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Lock both html and body until the palace doors open
  useEffect(() => {
    document.documentElement.classList.toggle('scroll-locked', !scrollUnlocked);
    document.body.classList.toggle('scroll-locked', !scrollUnlocked);
    return () => {
      document.documentElement.classList.remove('scroll-locked');
      document.body.classList.remove('scroll-locked');
    };
  }, [scrollUnlocked]);

  // Prime audio during the user's door tap so mobile browsers allow playback right after the door opens
  const handleDoorTouch = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioStartedRef.current) return;
    audio.muted = true;
    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          if (!audioStartedRef.current) {
            audio.pause();
            audio.currentTime = 0;
          }
        })
        .catch(() => {
          // Will retry when reveal starts
        });
    }
  }, []);

  // Start Maher Zain soundtrack smoothly right after the door finishes opening
  const handleRevealReady = useCallback(() => {
    setScrollUnlocked(true);
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const audio = audioRef.current;
    if (audio && !audioStartedRef.current) {
      audioStartedRef.current = true;
      audio.currentTime = 0;
      audio.muted = false;
      audio.volume = 0;
      setMusicMuted(false);

      audio
        .play()
        .then(() => {
          gsap.to(audio, {
            volume: 0.72,
            duration: 1.5,
            ease: 'power1.out',
          });
        })
        .catch(() => {
          audio.muted = true;
          setMusicMuted(true);
        });
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setMusicMuted((prev) => {
      const nextMuted = !prev;
      audio.muted = nextMuted;
      if (!nextMuted) {
        audio.volume = 0.72;
        if (audio.paused) {
          void audio.play();
        }
      }
      return nextMuted;
    });
  }, []);

  return (
    <main>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" loop />

      <CinematicEntrance
        onDoorTouch={handleDoorTouch}
        onRevealReady={handleRevealReady}
      />

      {scrollUnlocked && (
        <>
          <CountdownSection />
          <PrayerSection />
          <ParentsAndCurtainsSection />
          <EventsSection />
          <ClosingSection />
        </>
      )}

      <BackgroundMusic
        visible={scrollUnlocked}
        isMuted={musicMuted}
        onToggleMute={handleToggleMute}
      />
    </main>
  );
}
