import styles from './Placeholder.module.css';

export default function Postmortem() {
  return (
    <section id="postmortem" className={styles.section}>
      <h2 className={styles.heading}>Postmortem</h2>
      {/* TODO: refer to canva page, doc specs */}
      <p className={styles.placeholder}>[ placeholder — Person B ]</p>
    </section>
  );
}