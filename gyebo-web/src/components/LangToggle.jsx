/**
 * LangToggle — 글래스모피즘 캡슐 언어 토글 (KR | EN | CN)
 *
 * · 플로팅 sticky (우측 상단), 스크롤해도 항상 접근
 * · 활성 인디케이터가 스프링 물리로 미끄러져 이동 (GSAP back.out)
 * · CLS 방지: 3개 셀 균등 flex, 고정 너비
 */

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { useLang } from '../i18n/LanguageContext'
import { LANGS, LANG_LABEL } from '../i18n/locales'
import styles from './LangToggle.module.css'

export default function LangToggle() {
  const { lang, setLang } = useLang()
  const trackRef  = useRef(null)
  const pillRef   = useRef(null)
  const btnRefs   = useRef({})

  /* 활성 인디케이터를 현재 언어 버튼 위치로 이동 */
  useLayoutEffect(() => {
    const pill = pillRef.current
    const btn  = btnRefs.current[lang]
    const track = trackRef.current
    if (!pill || !btn || !track) return

    const tRect = track.getBoundingClientRect()
    const bRect = btn.getBoundingClientRect()
    const x = bRect.left - tRect.left
    const w = bRect.width

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to(pill, {
      x, width: w,
      duration: reduce ? 0 : 0.55,
      ease: 'back.out(1.7)',   // 스프링 느낌
    })
  }, [lang])

  return (
    <div className={styles.wrap}>
      <div ref={trackRef} className={styles.track} role="group" aria-label="언어 선택 / Language">
        <span ref={pillRef} className={styles.pill} aria-hidden="true" />
        {LANGS.map(code => (
          <button
            key={code}
            ref={el => { btnRefs.current[code] = el }}
            className={`${styles.opt} ${lang === code ? styles.optOn : ''}`}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            lang={code === 'zh' ? 'zh-CN' : code}
          >
            {LANG_LABEL[code]}
          </button>
        ))}
      </div>
    </div>
  )
}
