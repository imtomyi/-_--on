import styles from './Onboarding.module.css'
import logoImg from '../assets/logo.png'

export default function Onboarding({ onStart }) {
  return (
    <div className={styles.wrap}>

      {/* 배경 블롭 SVG — Figma: absolute x:-71 y:-119 from text container */}
      <div className={styles.blob} aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="282" height="453" viewBox="0 0 282 453" fill="none">
          <path
            d="M115.5 178.5C79.8278 124.718 26.5033 22.7571 0 0V429.5C80.1123 457.683 253.647 478.553 277.5 378C307.316 252.309 152.029 233.573 115.5 178.5Z"
            fill="url(#blob_grad)"
            style={{ mixBlendMode: 'multiply' }}
          />
          <defs>
            <linearGradient id="blob_grad" x1="234.464" y1="24.4149" x2="136.749" y2="259.013" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DDE0EC"/>
              <stop offset="1" stopColor="white"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Status bar placeholder */}
      <div className={styles.statusBar} />

      {/* 메인 콘텐츠 */}
      <div className={styles.main}>

        {/* 로고 이미지 영역 — Figma: 239px height, centered, image 127×121 */}
        <div className={styles.logoArea}>
          <img
            src={logoImg}
            alt="막걸리계보"
            className={styles.logoImg}
            width={127}
            height={121}
          />
        </div>

        {/* 텍스트 영역 — Figma: 269×180 */}
        <div className={styles.textArea}>
          {/* 자막 */}
          <p className={styles.subtitle}>막걸리 계보와 함께하는 코스 가이드</p>

          {/* 제목 — ts1: MaruBuriOTF #2C2C2A / ts2: MaruBuriOTF #C04830 */}
          <h1 className={styles.heading}>
            <span className={styles.headingDark}>공방거리를</span>
            <br/>
            <span className={styles.headingRed}>걷다</span>
          </h1>
        </div>

        {/* CTA — Figma: 257×51, white fill, #C04830 stroke 1px, radius 12 */}
        <button className={styles.cta} onClick={onStart}>
          <span className={styles.ctaText}>시작하기</span>
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M3 9h12M11 5l4 4-4 4"/>
          </svg>
        </button>

      </div>
    </div>
  )
}
