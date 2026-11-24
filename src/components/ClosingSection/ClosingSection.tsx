import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ClosingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.06 0C5.47 0 .11 5.36.11 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.25-1.64a11.9 11.9 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.19-1.24-6.19-3.49-8.41ZM12.06 21.82h-.01a9.89 9.89 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.88 9.88 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.87-9.91 9.87Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

export function ClosingSection() {
  const [copied, setCopied] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const prayerRef = useRef<HTMLDivElement | null>(null);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      [prayerRef.current, shareRef.current, closingRef.current].forEach((block) => {
        if (!block) return;
        gsap.from(block.children, {
          opacity: 0,
          y: 22,
          duration: 1.05,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 82%',
            once: true,
          },
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const handleCopyShareLink = useCallback(async () => {
    const shareUrl = window.location.href;
    let success = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        success = true;
      } catch {
        success = false;
      }
      document.body.removeChild(textarea);
    }

    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3500);
    }
  }, []);

  return (
    <div ref={wrapperRef}>
      {/* 1. Simple Prayer for the Couple */}
      <section
        id="couple-prayer"
        className={styles.couplePrayerSection}
        aria-labelledby="couple-prayer-eyebrow"
      >
        <div className={styles.topHairline} aria-hidden="true" />
        <div ref={prayerRef} className={styles.narrowInner}>
          <p id="couple-prayer-eyebrow" className={styles.eyebrow}>
            A Prayer for the Couple
          </p>

          <p className={styles.coupleArabicDua} lang="ar" dir="rtl">
            بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
          </p>

          <p className={styles.couplePrayerText}>
            May Almighty Allah bless Abubakar and Maryam, unite their hearts in
            goodness, and fill their home with everlasting love, peace, and
            barakah.
          </p>

          <div className={styles.smallDivider} aria-hidden="true">
            <span className={styles.dividerRule} />
            <span className={styles.dividerDot} />
            <span className={styles.dividerRule} />
          </div>
        </div>
      </section>

      {/* 2. Share on WhatsApp */}
      <section
        id="share-invitation"
        className={styles.shareSection}
        aria-labelledby="share-heading"
      >
        <div className={styles.topHairline} aria-hidden="true" />
        <div ref={shareRef} className={styles.shareCard}>
          <p className={styles.eyebrow}>Share the Invitation</p>
          <h2 id="share-heading" className={styles.shareHeading}>
            Share on WhatsApp
          </h2>
          <p className={styles.shareSubtext}>
            Tap below to copy the invitation link and share the joy with family
            and friends on WhatsApp.
          </p>

          <button
            type="button"
            className={`${styles.whatsappBtn} ${copied ? styles.whatsappBtnCopied : ''}`}
            onClick={handleCopyShareLink}
          >
            <WhatsAppIcon />
            <span>{copied ? 'Link Copied' : 'Share on WhatsApp'}</span>
          </button>

          <p
            className={`${styles.copiedHint} ${copied ? styles.copiedHintVisible : ''}`}
            role="status"
            aria-live="polite"
          >
            Invitation link copied — ready to paste in WhatsApp.
          </p>
        </div>
      </section>

      {/* 3. Closing Prayer — Surah Ar-Rum (30:21) */}
      <footer
        id="closing-verse"
        className={styles.closingFooter}
        aria-labelledby="closing-eyebrow"
      >
        <div className={styles.closingTopSeam} aria-hidden="true" />
        <div ref={closingRef} className={styles.closingInner}>
          <p id="closing-eyebrow" className={styles.closingEyebrow}>
            Closing Reflection
          </p>

          <p className={styles.surahArabic} lang="ar" dir="rtl">
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
          </p>

          <div className={styles.closingDivider} aria-hidden="true">
            <span className={styles.closingRule} />
            <span className={styles.closingDiamond} />
            <span className={styles.closingRule} />
          </div>

          <p className={styles.surahTranslation}>
            &ldquo;And of His signs is that He created for you from yourselves
            mates that you may find tranquility in them; and He placed between
            you affection and mercy. Indeed in that are signs for a people who
            give thought.&rdquo;
          </p>

          <p className={styles.surahRef}>Surah Ar-Rum · 30:21</p>

          <p className={styles.signOff}>Abubakar &amp; Maryam · December 2026</p>
        </div>
      </footer>
    </div>
  );
}
