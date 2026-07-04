import styles from './Launch.module.css';

export default function Launch() {
  return (
    <section id="launch" className={styles.launch}>
      <h1 className={styles.title}>Fatal Conversion</h1>
      <p className={styles.subtitle}>The Ariane 5 Flight V88 Catastrophe</p>
      <p className={styles.tagline}>
        Thirty-six seconds. One integer. Half a billion dollars.
      </p>

      <a href="#mission-briefing" className={styles.cta}>
        Land Safely
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      <p className={styles.intro}>
        On June 4, 1996, the maiden flight of Ariane 5 ended 36.7 seconds
        after liftoff. The cause was not a faulty sensor, not a structural
        failure, not weather. It was an integer that no longer fit.
      </p>
        
      <p className={styles.byline}>
        Campo, Bennette Enzo · Garcia, Andrea Gayle · Limpin, Kryster Knowell · Morgan, Jack Owen · Suarez, Santino Jose · 67 min read
      </p>
    </section>
  );
}