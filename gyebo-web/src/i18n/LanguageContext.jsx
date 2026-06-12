/* ─────────────────────────────────────────
   경량 i18n 컨텍스트
   - 클라이언트 사이드 즉시 전환 (새로고침 없음)
   - 언어 변경 시 0.3s 크로스페이드 (fading 플래그)
   - localStorage 영속화 / 기본 'ko'
   ───────────────────────────────────────── */

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ui, mkg, LANGS } from './locales'

const STORAGE_KEY = 'gyebo.lang'
const FADE_MS = 300

const LanguageContext = createContext(null)

function initialLang() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LANGS.includes(saved)) return saved
  }
  return 'ko'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)
  const [fading, setFading]  = useState(false)

  // <html lang> 동기화
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang
  }, [lang])

  const setLang = useCallback((next) => {
    setLangState(cur => {
      if (next === cur || !LANGS.includes(next)) return cur
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      try { localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
      if (reduce) return next
      // 크로스페이드: 페이드아웃 → 텍스트 교체 → 페이드인
      setFading(true)
      window.setTimeout(() => {
        setLangState(next)
        setFading(false)
      }, FADE_MS)
      return cur   // 페이드아웃 동안은 현재 언어 유지
    })
  }, [])

  const t = useCallback((key) => {
    const dict = ui[lang] || ui.ko
    return dict[key] ?? ui.ko[key] ?? key
  }, [lang])

  // 막걸리 필드 현지화: tm(item, 'name' | 'region' | 'ingredient')
  const tm = useCallback((item, field) => {
    const entry = mkg[item.id]
    return entry?.[lang]?.[field] ?? entry?.ko?.[field] ?? item[field]
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tm, fading, fadeMs: FADE_MS }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
