import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis 스무스 스크롤 초기화 훅
 * GSAP ticker + ScrollTrigger 연동 포함
 *
 * @param {object} opts
 * @param {function} opts.onScroll  - ({ scroll, velocity, progress }) => void
 */
export function useLenis({ onScroll } = {}) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.88,
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,   // 터치는 네이티브 속도 유지
    })
    lenisRef.current = lenis

    // GSAP ticker → Lenis.raf 연결
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // ScrollTrigger 동기화
    lenis.on('scroll', ScrollTrigger.update)
    if (onScroll) lenis.on('scroll', onScroll)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tick)
    }
  }, []) // eslint-disable-line

  return lenisRef
}
