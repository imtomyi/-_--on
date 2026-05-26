import { useState } from 'react'
import { makgeolliList } from '../data/makgeolli'
import styles from './FlavorMap.module.css'

/* ── SVG 좌표 ──────────────────────────────
   X: sweet − dry  (−3 → +3)  달다 ↔ 드라이
   Y: body         (2 → 5)    가볍다 ↔ 묵직
──────────────────────────────────────────── */
const W = 300, H = 260
const P = 28   // padding
const PW = W - P * 2, PH = H - P * 2

function pos(item) {
  return {
    x: P + (item.flavor.sweet - item.flavor.dry + 3) / 6 * PW,
    y: P + (item.flavor.body - 2) / 3 * PH,
  }
}

export default function FlavorMap({ onBack }) {
  const [active, setActive] = useState(null)

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack} aria-label="목록으로">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          목록
        </button>
        <span className={styles.title}>맛 계보도</span>
        <div style={{ width: 52 }} />
      </header>

      {/* 차트 */}
      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg}
          role="img" aria-label="막걸리 맛 분포도">

          {/* 축 — 두 줄만 */}
          <line x1={P} y1={P + PH / 2} x2={P + PW} y2={P + PH / 2}
            stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          <line x1={P + PW / 2} y1={P} x2={P + PW / 2} y2={P + PH}
            stroke="rgba(0,0,0,0.12)" strokeWidth="1" />

          {/* 축 레이블 */}
          <text x={P + 3} y={P + PH / 2 - 5}
            fontSize="8" fill="rgba(0,0,0,0.35)" letterSpacing="0.05em">달다</text>
          <text x={P + PW - 3} y={P + PH / 2 - 5}
            fontSize="8" fill="rgba(0,0,0,0.35)" letterSpacing="0.05em" textAnchor="end">드라이</text>
          <text x={P + PW / 2 + 4} y={P + 9}
            fontSize="8" fill="rgba(0,0,0,0.35)" letterSpacing="0.05em">가볍다</text>
          <text x={P + PW / 2 + 4} y={P + PH - 4}
            fontSize="8" fill="rgba(0,0,0,0.35)" letterSpacing="0.05em">묵직</text>

          {/* 도트 */}
          {makgeolliList.map((item, idx) => {
            const { x, y } = pos(item)
            const on = active?.id === item.id
            return (
              <g key={item.id}
                onClick={() => setActive(on ? null : item)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={item.name}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setActive(on ? null : item)}
              >
                <circle cx={x} cy={y} r={on ? 13 : 11}
                  fill={on ? '#1A1A1A' : '#E0E0E0'}
                  stroke={on ? '#1A1A1A' : 'rgba(0,0,0,0.15)'}
                  strokeWidth="1"
                  style={{ transition: 'r 0.15s, fill 0.15s' }}
                />
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  fontSize="8.5" fontWeight="700"
                  fill={on ? '#FFFFFF' : 'rgba(0,0,0,0.55)'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  {idx + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* 선택된 항목 — 심플 텍스트 */}
      <div className={styles.activeRow} aria-live="polite">
        {active ? (
          <>
            <span className={styles.activeNum}>
              {makgeolliList.findIndex(i => i.id === active.id) + 1}
            </span>
            <span className={styles.activeName}>{active.name}</span>
            <span className={styles.activeMeta}>{active.region} · {active.flavor.abv}도</span>
          </>
        ) : (
          <span className={styles.hint}>도트를 탭하면 정보가 표시됩니다</span>
        )}
      </div>

      {/* 번호 인덱스 */}
      <ul className={styles.index} aria-label="막걸리 목록">
        {makgeolliList.map((item, idx) => (
          <li key={item.id}
            className={`${styles.indexItem} ${active?.id === item.id ? styles.indexItemOn : ''}`}
            onClick={() => setActive(active?.id === item.id ? null : item)}
          >
            <span className={styles.indexNum}>{idx + 1}</span>
            <span className={styles.indexName}>{item.name}</span>
          </li>
        ))}
      </ul>

      {/* 한반도 배경 */}
      <div className={styles.peninsulaBg} aria-hidden="true">
        <svg viewBox="0 0 100 180" className={styles.peninsulaSvg}>
          {/* 한반도 윤곽
              동해안(우): x 78~86, 직선에 가깝게 남하
              서해안(좌): x가 중간(y≈50)에서 x=9까지 서쪽 돌출 — 핵심 비대칭 */}
          <path d="
            M 24,5
            C 44,1 62,1 77,5
            L 84,18 L 87,36 L 85,56
            L 82,76 L 78,98 L 74,118
            L 68,136 C 63,146 57,154 50,158
            C 43,153 36,143 28,131
            L 20,116 L 13,96
            L 9,72 L 9,50
            L 13,30 L 18,16 L 24,5 Z
          " />
        </svg>
      </div>

    </div>
  )
}
