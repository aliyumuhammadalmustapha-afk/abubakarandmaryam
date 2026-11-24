import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CountdownSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// Wedding events begin on 4th December 2026 (WAT / UTC+1)
const TARGET_DATE_MS = new Date('2026-12-04T00:00:00+01:00').getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function getTimeRemaining(): TimeRemaining {
  const diff = TARGET_DATE_MS - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isComplete: false };
}

function padTwo(value: number): string {
  return String(value).padStart(2, '0');
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => getTimeRemaining());

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const unitRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 1.0,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      if (cardRef.current) {
        gsap.from(cardRef.current, {
          opacity: 0,
          y: 26,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 84%',
            once: true,
          },
        });
      }

      const units = unitRefs.current.filter(Boolean);
      if (units.length > 0) {
        gsap.from(units, {
          opacity: 0,
          y: 14,
          duration: 0.9,
          stagger: 0.1,
          delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 84%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const units = [
    { label: 'Days', value: padTwo(timeLeft.days) },
    { label: 'Hours', value: padTwo(timeLeft.hours) },
    { label: 'Minutes', value: padTwo(timeLeft.minutes) },
    { label: 'Seconds', value: padTwo(timeLeft.seconds) },
  ];

  return (
    <section
      id="countdown"
      ref={sectionRef}
      className={styles.countdownSection}
      aria-labelledby="countdown-heading"
    >
      <div className={styles.topGoldSeam} aria-hidden="true" />

      <div className={styles.innerContainer}>
        <div ref={headerRef} className={styles.headerBlock}>
          <p className={styles.eyebrow}>Counting Down To</p>
          <h2 id="countdown-heading" className={styles.coupleHeading}>
            Abubakar<span className={styles.coupleAmpersand}>&amp;</span>Maryam
          </h2>
          <div className={styles.datePlaque}>
            <span className={styles.dateRule} aria-hidden="true" />
            <span className={styles.dateText}>4th December 2026</span>
            <span className={styles.dateRule} aria-hidden="true" />
          </div>
        </div>

        <div ref={cardRef} className={styles.countdownCard}>
          {timeLeft.isComplete ? (
            <p className={styles.celebrationBegun}>The Celebration Has Begun</p>
          ) : (
            <div
              className={styles.timerRow}
              role="timer"
              aria-live="polite"
              aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds until the wedding events begin`}
            >
              {units.map((unit, index) => (
                <div
                  key={unit.label}
                  ref={(el) => {
                    unitRefs.current[index] = el;
                  }}
                  className={styles.unitCell}
                >
                  <span className={styles.unitValue}>{unit.value}</span>
                  <span className={styles.unitLabel}>{unit.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
