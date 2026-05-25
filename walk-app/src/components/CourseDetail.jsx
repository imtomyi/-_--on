import { useState, useRef, useEffect } from 'react'
import MapLibreMap from './MapLibreMap'
import styles from './CourseDetail.module.css'

const placeTypeLabel = {
  start:    '출발',
  end:      '도착',
  craft:    '공방',
  landmark: '명소',
  food:     '맛집',
}

const SNAP_HEIGHTS = [22, 52, 85] // % — 축소 / 중간 / 확장

export default function CourseDetail({ course, onBack }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [sheetHeight, setSheetHeight] = useState(52)
  const [isDragging, setIsDragging] = useState(false)

  // 각 거점 li 엘리먼트 ref (스크롤 동기화용)
  const placeRefs      = useRef([])
  const listRef        = useRef(null)
  const sheetHeightRef = useRef(sheetHeight)
  useEffect(() => { sheetHeightRef.current = sheetHeight }, [sheetHeight])

  // ── padding-bottom 동적 계산 ──────────────────────────────────
  // 마지막 거점도 상단에 스냅될 수 있도록
  // 필요 여백 = listHeight - lastItemHeight
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const recalc = () => {
      const lastItem = placeRefs.current[course.places.length - 1]
      if (!lastItem) return
      const needed = Math.max(0, list.clientHeight - lastItem.offsetHeight)
      list.style.paddingBottom = `${needed + 8}px`
    }
    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(list)
    return () => ro.disconnect()
  }, [course])

  // ── JS 스냅: 스크롤이 멈추면 가장 가까운 거점으로 정렬 ─────────
  // 85%일 때는 스냅 없이 자유 스크롤 (overflow:hidden으로 막혀있음)
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const snapNearest = () => {
      if (sheetHeightRef.current === 85) return
      const items = placeRefs.current.filter(Boolean)
      let nearest = items[0], minDist = Infinity
      items.forEach(item => {
        const dist = Math.abs(item.offsetTop - list.scrollTop)
        if (dist < minDist) { minDist = dist; nearest = item }
      })
      if (nearest) list.scrollTop = nearest.offsetTop
    }

    let timer
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(snapNearest, 80) }

    if ('onscrollend' in list) {
      list.addEventListener('scrollend', snapNearest, { passive: true })
    } else {
      list.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      clearTimeout(timer)
      list.removeEventListener('scrollend', snapNearest)
      list.removeEventListener('scroll', onScroll)
    }
  }, [course])

  // ── activeIdx 변경 시 해당 카드 상단으로 부드럽게 이동 ──────
  // 전체 펼침(85%)에서는 스크롤 없음
  useEffect(() => {
    if (sheetHeightRef.current === 85) return
    const item = placeRefs.current[activeIdx]
    if (item) item.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeIdx])

  const handlePointerDown = (e) => {
    e.preventDefault()
    const startY = e.clientY ?? e.touches?.[0]?.clientY
    const startHeight = sheetHeight
    setIsDragging(true)

    const onMove = (e) => {
      const currentY = e.clientY ?? e.touches?.[0]?.clientY
      const deltaPercent = ((startY - currentY) / window.innerHeight) * 100
      setSheetHeight(Math.min(88, Math.max(18, startHeight + deltaPercent)))
    }

    const onUp = () => {
      setIsDragging(false)
      setSheetHeight(prev => {
        const snapped = SNAP_HEIGHTS.reduce((a, b) =>
          Math.abs(b - prev) < Math.abs(a - prev) ? b : a
        )
        // 85% 전체 펼침 → 맨 위로 / 그 외 → 활성 카드로 즉시 이동
        requestAnimationFrame(() => {
          if (snapped === 85) {
            listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
          } else {
            const item = placeRefs.current[activeIdx]
            if (item) item.scrollIntoView({ behavior: 'instant', block: 'start' })
          }
        })
        return snapped
      })
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  return (
    <div className={styles.wrap}>

      {/* ── 지도: 전체 화면 ── */}
      <div className={styles.mapArea}>
        <MapLibreMap
          course={course}
          activeIdx={activeIdx}
          onMarkerClick={setActiveIdx}
          sheetHeight={sheetHeight}
        />
      </div>

      {/* ── 상단 플로팅 헤더 ── */}
      <div className={styles.floatingHeader}>
        <div className={styles.topBar}>
          <button className={styles.back} onClick={onBack}>←</button>
          <div className={styles.headerCenter}>
            <span className={styles.courseEyebrow}>{course.ko.duration} · {course.distance}</span>
            <span className={styles.courseTitle}>{course.ko.title}</span>
            <span className={styles.courseSub}>{course.ko.subtitle}</span>
          </div>
        </div>
      </div>

      {/* ── 바텀 시트: 장소 리스트 + 게이지 + CTA ── */}
      <div
        className={`${styles.bottomSheet} ${isDragging ? '' : styles.bottomSheetSnap}`}
        style={{ height: `${sheetHeight}%` }}
      >
        <div className={styles.sheetHandle} onPointerDown={handlePointerDown} />
        <ul
          className={`${styles.placeList} ${sheetHeight === 85 ? styles.placeListFull : ''}`}
          ref={listRef}
        >
          {course.places.map((place, idx) => {
            const isGyebo = place.type === 'start' || place.type === 'end'
            return (
              <li
                key={place.id}
                className={styles.placeItem}
                ref={el => placeRefs.current[idx] = el}
              >
                <button
                  className={`${styles.placeCard} ${idx === activeIdx ? styles.active : ''}`}
                  onClick={() => setActiveIdx(idx)}
                  onMouseDown={sheetHeight === 85 ? (e) => e.preventDefault() : undefined}
                >
                  <div className={`${styles.placeNum} ${isGyebo ? styles.placeNumGold : ''}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className={styles.placeInfo}>
                    <div className={styles.placeName}>{place.ko.name}</div>
                    <div className={styles.placeDesc}>{place.ko.desc}</div>
                  </div>
                  <span className={`${styles.typeBadge} ${styles['badge_' + place.type]}`}>
                    {placeTypeLabel[place.type]}
                  </span>
                </button>
                {idx < course.places.length - 1 && (
                  <div className={styles.connector}>
                    <div className={styles.connectorLine} />
                    <span className={styles.connectorTime}>
                      +{course.places[idx + 1].walkMin - place.walkMin}분 도보
                    </span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>

    </div>
  )
}
