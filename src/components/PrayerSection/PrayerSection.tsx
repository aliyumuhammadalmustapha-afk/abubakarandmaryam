import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PrayerSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export function PrayerSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current!.children, {
        opacity: 0,
        y: 22,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="prayer"
      ref={sectionRef}
      className={styles.prayerSection}
      aria-labelledby="prayer-eyebrow"
    >
      <div className={styles.topBorder} aria-hidden="true" />

      <div ref={contentRef} className={styles.innerContainer}>
        <p id="prayer-eyebrow" className={styles.eyebrow}>
          A Prayer for the Blessed Day
        </p>

        <p className={styles.arabicPrayer} lang="ar" dir="rtl">
          اللَّهُمَّ بَلِّغْنَا هَذَا الْيَوْمَ الْمُبَارَكَ بِخَيْرٍ وَعَافِيَةٍ
        </p>

        <div className={styles.ornamentDivider} aria-hidden="true">
          <span className={styles.dividerLine} />
          <span className={styles.dividerStar} />
          <span className={styles.dividerLine} />
        </div>

        <p className={styles.englishPrayer}>
          We pray to Almighty Allah to spare our lives in good health, peace,
          and gratitude to witness this blessed day, and to shower His endless
          mercy, barakah, and tranquility upon the union of Abubakar &amp;
          Maryam.
        </p>

        <p className={styles.ameenArabic} lang="ar" dir="rtl">
          آمِينَ يَا رَبَّ الْعَالَمِينَ
        </p>
        <p className={styles.ameenEnglish}>Ameen, Ya Rabbal-Alamin</p>
      </div>
    </section>
  );
}
