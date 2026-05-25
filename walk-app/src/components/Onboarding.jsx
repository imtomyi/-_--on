import styles from './Onboarding.module.css'

export default function Onboarding({ onStart }) {
  return (
    <div className={styles.wrap}>

      {/* 상단 브랜드 */}
      <div className={styles.top}>
        <span className={styles.eyebrow}>행궁동 · 수원</span>
        <h1 className={styles.brand}>
          막걸리<br />
          <span className={styles.brandAccent}>산책</span>
        </h1>
      </div>

      {/* 중앙 카피 */}
      <div className={styles.mid}>
        <p className={styles.copy}>
          막걸리 계보에서<br />
          한 잔 테이크아웃하고,<br />
          공방거리를 걷다
        </p>
      </div>

      {/* 하단 CTA */}
      <div className={styles.bottom}>
        <p className={styles.sub}>행궁동 공방거리 코스 가이드</p>
        <button className={styles.cta} onClick={onStart}>
          산책 시작하기
          <span className={styles.arrow} aria-hidden="true">→</span>
        </button>
      </div>

    </div>
  )
}
