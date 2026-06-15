/**
 * LangToggle — 접히는 글래스 언어 토글 (KR | EN | CN)
 *
 * · 평소엔 현재 언어 하나만 보이는 원형(FAB) — 화면 방해 최소화
 * · 탭하면 나머지 언어가 좌우로 펼쳐짐
 * · 언어 선택 또는 바깥 탭 시 다시 접힘
 */

import { useState, useRef, useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { LANGS, LANG_LABEL } from '../i18n/locales'
import styles from './LangToggle.module.css'

export default function LangToggle() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  /* 바깥 탭 시 접기 */
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc, true)
    return () => document.removeEventListener('pointerdown', onDoc, true)
  }, [open])

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div
        className={`${styles.track} ${open ? styles.open : ''}`}
        role="group"
        aria-label="언어 선택 / Language"
      >
        {LANGS.map(code => (
          <button
            key={code}
            className={`${styles.opt} ${lang === code ? styles.optOn : ''}`}
            onClick={() => {
              if (!open) { setOpen(true); return }   // 접힌 상태 → 펼치기
              setLang(code); setOpen(false)          // 펼친 상태 → 선택 후 접기
            }}
            aria-pressed={lang === code}
            aria-hidden={!open && lang !== code}
            lang={code === 'zh' ? 'zh-CN' : code}
          >
            {LANG_LABEL[code]}
          </button>
        ))}
      </div>
    </div>
  )
}
