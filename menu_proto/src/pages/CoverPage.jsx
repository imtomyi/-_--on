import { useState, useEffect } from 'react';
import styles from './CoverPage.module.css';

export default function CoverPage({ onNext }) {
  const [isOpening, setIsOpening] = useState(false);
  const [activeLang, setActiveLang] = useState('한국어');
  
  const languages = ['한국어', 'ENGLISH', '日本語', '中文'];

  useEffect(() => {
    // 컴포넌트가 마운트되면 짧은 대기 후 오프닝 애니메이션 시작
    const timer = setTimeout(() => {
      setIsOpening(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      {/* 초기 검은 화면 & 오프닝 애니메이션 레이어 */}
      <div className={`${styles.curtain} ${isOpening ? styles.open : ''}`}>
        <h1 className={styles.introTitle}>막걸리 계보</h1>
      </div>

      {/* 메인 콘텐츠 (하얀 배경) */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.langSelector}>
            {languages.map((lang) => (
              <button 
                key={lang}
                className={`${styles.langBtn} ${activeLang === lang ? styles.active : ''}`}
                onClick={() => setActiveLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </header>

        <div className={styles.contentBody}>
          <div className={styles.titleSection}>
            <div className={styles.subtitle}>행궁동 수원 · HAENGGUNG-DONG</div>
            <h1 className={styles.mainTitle}>막걸리<br/>계보</h1>
            <p className={styles.description}>
              열 가지 막걸리가 남긴<br/>
              이야기,<br/>
              계보,
            </p>
          </div>

          <div className={styles.buttonSection}>
            <button className={styles.rippleButton} onClick={onNext}>
              <div className={styles.pulseLayer}></div>
              <div className={styles.pulseLayer} style={{ animationDelay: '0.5s' }}></div>
              <span className={styles.btnText}>버튼</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
