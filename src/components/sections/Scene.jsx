import clsx from 'clsx';
import styles from './Scene.module.css';

// Shared scene shell. The numbered kicker is a real sequence marker — the exhibit is
// a typed mission timeline — so the numbering carries information, not decoration.
export default function Scene({ id, index, kicker, className, innerClassName, children }) {
  return (
    <section id={id} className={clsx(styles.scene, className)}>
      <div className={clsx(styles.inner, innerClassName)}>
        {(index || kicker) && (
          <div className={styles.kicker}>
            {index && <span className={styles.index}>{index}</span>}
            {kicker && <span>{kicker}</span>}
            <span className={styles.rule} />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export { styles as sceneStyles };
