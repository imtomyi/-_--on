import styles from './Onboarding.module.css'

export default function Onboarding({ onStart }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        <div className={styles.copy}>
          <p className={styles.line1}><span className={styles.accentGreen}>막걸리</span> 한 잔 들고,</p>
          <p className={styles.subLineLeft}><span className={styles.subGreen}>막걸리 계보</span>의 테이크아웃과 함께</p>
        </div>

        <div className={styles.btnGroup}>
          <button className={styles.cta} onClick={onStart}>
            산책 시작하기
            <span className={styles.arrow}>→</span>
          </button>
        </div>

        <div className={styles.bottomGroup}>
          <p className={styles.subLineRight}><span className={styles.subBrown}>공방거리</span>를 산책하는 코스 가이드</p>
          <p className={styles.line2}><span className={styles.accent}>공방거리</span>를 걷다</p>
        </div>

      </div>
    </div>
  )
}
