import { motion, useTransform } from 'framer-motion';
import StarField from '../background/StarField.jsx';
import SystemNoise from './SystemNoise.jsx';
import { useExhibit } from './ExhibitState.jsx';
import styles from './Backdrop.module.css';

// All ambient layers, fixed behind content, subscribing to the one instability value.
export default function Backdrop() {
  const { instability } = useExhibit();

  const amber = useTransform(instability, [0.15, 0.55, 0.9], [0, 0.32, 0.18]);
  const red = useTransform(instability, [0.55, 1], [0, 0.8]);
  const stars = useTransform(instability, [0, 0.4], [1, 0]);
  const wash = useTransform(instability, [0.6, 0.85, 1], [0, 0.3, 0.5]);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={`${styles.layer} ${styles.base}`} />
      <motion.div className={`${styles.layer} ${styles.amber}`} style={{ opacity: amber }} />
      <motion.div className={`${styles.layer} ${styles.red}`} style={{ opacity: red }} />
      <motion.div className={styles.stars} style={{ opacity: stars }}>
        <StarField count={70} />
      </motion.div>
      <SystemNoise />
      <motion.div className={`${styles.layer} ${styles.wash}`} style={{ opacity: wash }} />
    </div>
  );
}
