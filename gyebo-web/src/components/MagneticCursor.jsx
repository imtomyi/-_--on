/**
 * MagneticCursor — 데스크탑 전용 매그네틱 커서
 * GSAP 기반: 부드러운 추적 + 인터랙티브 요소 자석 효과
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './MagneticCursor.module.css'

const MAGNETIC_RADIUS  = 90   // px — 이 범위 안에서 자석 당김
const MAGNETIC_STRENGTH = 0.38 // 당김 강도 (0~1)

export default function MagneticCursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const posRef   = useRef({ x: -200, y: -200 })
  const activeEl = useRef(null)

  useEffect(() => {
    /* 터치 디바이스에선 렌더링 안 함 */
    if (window.matchMedia('(pointer: coarse)').matches) return

    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    /* 기본 커서 숨기기 */
    document.body.style.cursor = 'none'

    /* quickSetter — 매 프레임 직접 DOM 조작 (훨씬 빠름) */
    const setOX = gsap.quickSetter(outer, 'x', 'px')
    const setOY = gsap.quickSetter(outer, 'y', 'px')
    const setIX = gsap.quickSetter(inner, 'x', 'px')
    const setIY = gsap.quickSetter(inner, 'y', 'px')

    let ox = -200, oy = -200

    /* 부드러운 outer 트래킹 */
    gsap.ticker.add(() => {
      ox += (posRef.current.x - ox) * 0.12
      oy += (posRef.current.y - oy) * 0.12
      setOX(ox)
      setOY(oy)
    })

    const onMove = (e) => {
      const mx = e.clientX, my = e.clientY
      posRef.current = { x: mx, y: my }

      /* inner — 즉시 이동 */
      setIX(mx)
      setIY(my)

      /* 매그네틱 요소 탐색 */
      const magnets = document.querySelectorAll('[data-magnetic]')
      let pulled = false

      magnets.forEach(el => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width  / 2
        const cy = rect.top  + rect.height / 2
        const dx = mx - cx
        const dy = my - cy
        const dist = Math.hypot(dx, dy)

        if (dist < MAGNETIC_RADIUS) {
          const factor = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS
          /* 커서를 요소 중심으로 당김 */
          posRef.current = {
            x: mx - dx * factor * MAGNETIC_STRENGTH,
            y: my - dy * factor * MAGNETIC_STRENGTH,
          }
          /* 요소를 마우스 방향으로 살짝 당김 */
          gsap.to(el, {
            x: dx * factor * 0.22,
            y: dy * factor * 0.22,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
          if (activeEl.current !== el) {
            gsap.to(outer, { scale: 1.7, duration: 0.3, ease: 'power2.out' })
            activeEl.current = el
          }
          pulled = true
        } else if (activeEl.current === el) {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
        }
      })

      if (!pulled && activeEl.current) {
        gsap.to(outer, { scale: 1, duration: 0.3, ease: 'power2.out' })
        activeEl.current = null
      }
    }

    const onEnterLink = () =>
      gsap.to(outer, { scale: 1.4, duration: 0.25, ease: 'power2.out' })
    const onLeaveLink = () =>
      gsap.to(outer, { scale: 1.0, duration: 0.25, ease: 'power2.out' })

    /* 일반 링크/버튼 hover */
    const links = document.querySelectorAll('a, button')
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    window.addEventListener('mousemove', onMove)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink)
        el.removeEventListener('mouseleave', onLeaveLink)
      })
    }
  }, [])

  return (
    <>
      {/* 큰 링 — 부드럽게 따라옴 */}
      <div ref={outerRef} className={styles.outer} aria-hidden="true" />
      {/* 작은 점 — 즉시 이동 */}
      <div ref={innerRef} className={styles.inner} aria-hidden="true" />
    </>
  )
}
