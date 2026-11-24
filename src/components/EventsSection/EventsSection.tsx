import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './EventsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export function EventsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const swingingVideoRef = useRef<HTMLVideoElement | null>(null);

  const safePlayMuted = useCallback(async (video: HTMLVideoElement | null) => {
    if (!video) return;
    video.muted = true;
    try {
      await video.play();
    } catch {
      // Ignore autoplay interruption
    }
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (headerRef.current && !prefersReduced) {
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

      cardsRef.current.forEach((card, index) => {
        if (!card || prefersReduced) return;
        gsap.from(card, {
          opacity: 0,
          y: 28,
          duration: 1.05,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
        });
      });

      if (swingingVideoRef.current) {
        ScrollTrigger.create({
          trigger: swingingVideoRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          onEnter: () => void safePlayMuted(swingingVideoRef.current),
          onEnterBack: () => void safePlayMuted(swingingVideoRef.current),
          onLeave: () => swingingVideoRef.current?.pause(),
          onLeaveBack: () => swingingVideoRef.current?.pause(),
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [safePlayMuted]);

  return (
    <section
      id="events"
      ref={sectionRef}
      className={styles.eventsSection}
      aria-labelledby="events-heading"
    >
      <div className={styles.topHairline} aria-hidden="true" />

      <div className={styles.innerContainer}>
        <div ref={headerRef} className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Programme of Celebrations</p>
          <h2 id="events-heading" className={styles.heading}>
            Wedding Events
          </h2>
          <div className={styles.headerRule} aria-hidden="true">
            <span className={styles.ruleLine} />
            <span className={styles.ruleDiamond} />
            <span className={styles.ruleLine} />
          </div>
        </div>

        <div className={styles.eventsGrid}>
          {/* Event 1: Football Match */}
          <article
            ref={(el) => {
              cardsRef.current[0] = el;
            }}
            className={styles.eventCard}
          >
            <div className={styles.mediaBox}>
              <img
                className={styles.mediaAsset}
                src="/assets/football.gif"
                alt="Wedding Football Match celebration"
              />
            </div>

            <div className={styles.cardBody}>
              <span className={styles.eventTag}>Event 01</span>
              <h3 className={styles.eventTitle}>Football Match</h3>
              <div className={styles.cardDivider} aria-hidden="true" />

              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>4th December 2026</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Time</span>
                  <span className={styles.detailValue}>4:00 PM</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Venue</span>
                  <span className={styles.detailValue}>Malumfashi</span>
                </div>
              </div>
            </div>
          </article>

          {/* Event 2: Wedding Fatiha / Daurin Aure */}
          <article
            ref={(el) => {
              cardsRef.current[1] = el;
            }}
            className={styles.eventCard}
          >
            <div className={styles.mediaBox}>
              <video
                ref={swingingVideoRef}
                className={styles.mediaAsset}
                src="/assets/swinging.mp4"
                preload="auto"
                playsInline
                muted
                loop
              />
            </div>

            <div className={styles.cardBody}>
              <span className={styles.eventTag}>Event 02</span>
              <h3 className={styles.eventTitle}>Wedding Fatiha</h3>
              <p className={styles.eventSubtitle}>Daurin Aure</p>
              <div className={styles.cardDivider} aria-hidden="true" />

              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>5th December 2026</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Time</span>
                  <span className={styles.detailValue}>11:00 AM</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Venue</span>
                  <span className={styles.detailValue}>
                    Gwamutsawa, Malumfashi, Kofar Gidan Alh. Tukur Mai Magani
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Event 3: Walima */}
          <article
            ref={(el) => {
              cardsRef.current[2] = el;
            }}
            className={styles.eventCard}
          >
            <div className={styles.mediaBox}>
              <img
                className={styles.mediaAsset}
                src="/assets/walima.gif"
                alt="Walima reception celebration"
              />
            </div>

            <div className={styles.cardBody}>
              <span className={styles.eventTag}>Event 03</span>
              <h3 className={styles.eventTitle}>Walima</h3>
              <div className={styles.cardDivider} aria-hidden="true" />

              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>6th December 2026</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Venue</span>
                  <span className={styles.detailValue}>
                    No. 17 Chanchangi Road, After Enyo Filling Station, Rigasa,
                    Kaduna
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
