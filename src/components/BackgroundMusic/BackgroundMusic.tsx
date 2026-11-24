import styles from './BackgroundMusic.module.css';

interface BackgroundMusicProps {
  visible: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function BackgroundMusic({
  visible,
  isMuted,
  onToggleMute,
}: BackgroundMusicProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      className={styles.floatingAudioBtn}
      onClick={onToggleMute}
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      aria-pressed={isMuted}
    >
      {isMuted ? (
        <svg
          className={styles.icon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          className={styles.icon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
      <span>{isMuted ? 'Music Off' : 'Music On'}</span>
    </button>
  );
}
