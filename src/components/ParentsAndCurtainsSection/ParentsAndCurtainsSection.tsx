import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ParentsAndCurtainsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export function ParentsAndCurtainsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const parentsWrapRef = useRef<HTMLDivElement | null>(null);
  const parentsVideoRef = useRef<HTMLVideoElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const curtainsWrapRef = useRef<HTMLDivElement | null>(null);
  const curtainsVideoRef = useRef<HTMLVideoElement | null>(null);

  const curtainsStartedRef = useRef(false);

  const safePlayMuted = useCallback(async (video: HTMLVideoElement | null) => {
    if (!video) return;
    video.muted = true;
    try {
      await video.play();
    } catch {
      // Ignore autoplay interruption
    }
  }, []);

  // Ensure curtains.mp4 shows frame 0 cleanly on mobile before scrolling into view
  const handleCurtainsMetadata = useCallback(() => {
    const video = curtainsVideoRef.current;
    if (!video || curtainsStartedRef.current) return;
    try {
      video.currentTime = 0.01;
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (parentsWrapRef.current) {
        if (!prefersReduced) {
          gsap.from(parentsWrapRef.current, {
            opacity: 0,
            y: 26,
            duration: 1.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: parentsWrapRef.current,
              start: 'top 82%',
              once: true,
            },
          });
        }

        ScrollTrigger.create({
          trigger: parentsWrapRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          onEnter: () => void safePlayMuted(parentsVideoRef.current),
          onEnterBack: () => void safePlayMuted(parentsVideoRef.current),
          onLeave: () => parentsVideoRef.current?.pause(),
          onLeaveBack: () => parentsVideoRef.current?.pause(),
        });
      }

      if (dividerRef.current && !prefersReduced) {
        gsap.from(dividerRef.current, {
          opacity: 0,
          y: 18,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }

      if (curtainsWrapRef.current) {
        if (!prefersReduced) {
          gsap.from(curtainsWrapRef.current, {
            opacity: 0,
            y: 26,
            duration: 1.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: curtainsWrapRef.current,
              start: 'top 82%',
              once: true,
            },
          });
        }

        ScrollTrigger.create({
          trigger: curtainsWrapRef.current,
          start: 'top 68%',
          once: true,
          onEnter: () => {
            if (curtainsStartedRef.current) return;
            curtainsStartedRef.current = true;
            const video = curtainsVideoRef.current;
            if (video) {
              video.currentTime = 0;
              void safePlayMuted(video);
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [safePlayMuted]);

  return (
    <section
      id="families-invitation"
      ref={sectionRef}
      className={styles.familyShowcaseSection}
      aria-label="Parents Invitation and Couple Reveal"
    >
      <div className={styles.topGoldSeam} aria-hidden="true" />

      {/* Section 1: Parents Names Motion Card */}
      <div ref={parentsWrapRef} className={styles.mediaBlock}>
        <div className={styles.mediaFrame}>
          <video
            ref={parentsVideoRef}
            className={styles.mediaVideo}
            src="/assets/parentsnames.mp4"
            preload="auto"
            playsInline
            muted
            loop
          />
        </div>
      </div>

      {/* Gap with Horizontal Line & Calligraphic Art Separator */}
      <div ref={dividerRef} className={styles.calligraphicDividerBand}>
        <div className={styles.dividerLineRow}>
          <span className={styles.horizontalRule} aria-hidden="true" />

          <div className={styles.calligraphyArt}>
            <svg
              className={styles.arabesqueSvg}
              width="120"
              height="18"
              viewBox="0 0 120 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 9C18 9 26 2 42 2C51 2 56 6 60 9C64 6 69 2 78 2C94 2 102 9 118 9"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M2 9C18 9 26 16 42 16C51 16 56 12 60 9C64 12 69 16 78 16C94 16 102 9 118 9"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.65"
              />
              <circle cx="60" cy="9" r="2.2" fill="currentColor" />
            </svg>

            <span className={styles.arabicCalligraphy} lang="ar" dir="rtl">
              بَارَكَ اللَّهُ لَهُمَا وَبَارَكَ عَلَيْهِمَا
            </span>

            <svg
              className={styles.arabesqueSvg}
              width="76"
              height="10"
              viewBox="0 0 76 10"
              fill="none"
              aria-hidden="true"
            >
              <line x1="0" y1="5" x2="31" y2="5" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.65" />
              <rect
                x="38"
                y="1.5"
                width="5"
                height="5"
                transform="rotate(45 38 1.5)"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <line x1="45" y1="5" x2="76" y2="5" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.65" />
            </svg>
          </div>

          <span className={styles.horizontalRule} aria-hidden="true" />
        </div>
      </div>

      {/* Section 2: Curtains Opening Reveal */}
      <div ref={curtainsWrapRef} className={styles.mediaBlock}>
        <div className={styles.mediaFrame}>
          <video
            ref={curtainsVideoRef}
            className={styles.mediaVideo}
            src="/assets/curtains.mp4"
            preload="auto"
            playsInline
            muted
            onLoadedMetadata={handleCurtainsMetadata}
          />
        </div>
      </div>
    </section>
  );
}
