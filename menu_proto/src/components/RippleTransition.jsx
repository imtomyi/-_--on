import styles from './RippleTransition.module.css';

export default function RippleTransition({ origin, isFadingOut }) {
  // 화면을 덮을 수 있는 충분히 큰 크기 (대각선 길이 고려)
  const size = 1500; 

  return (
    <div 
      className={`${styles.overlay} ${isFadingOut ? styles.fadeOut : ''}`}
      style={{
        '--origin-x': `${origin.x}px`,
        '--origin-y': `${origin.y}px`,
        '--size': `${size}px`
      }}
    >
      <div className={`${styles.ripple} ${isFadingOut ? styles.fullyExpanded : ''}`} />
    </div>
  );
}
