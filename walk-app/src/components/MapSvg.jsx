import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './MapSvg.module.css'
import { DXF_BUILDINGS, DXF_ROADS, DXF_GREEN, DXF_WATER } from '../data/dxfGeo'

// ── GEO TRANSFORM ──────────────────────────────────────────────────────────
const BOUNDS = { minLat: 37.272, maxLat: 37.291, minLng: 127.007, maxLng: 127.022 }
const W = 360, H = 500

function geo(lat, lng) {
  return {
    x: ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W,
    y: (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H,
  }
}
function pts(coords) {
  return coords.map(([lat, lng]) => {
    const { x, y } = geo(lat, lng)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}
function ptStr(path) {
  return path.map(p => {
    const { x, y } = geo(p.lat, p.lng)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}
function lerp(a, b, t) { return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t } }
function walkPath(path, t) {
  const n = path.length - 1
  const raw = t * n
  const i = Math.min(Math.floor(raw), n - 1)
  return lerp(path[i], path[i + 1], raw - i)
}

// ── PALETTE ────────────────────────────────────────────────────────────────
// 메인 컬러: #fff0aa (노랑) / #87cfbd (청록) / #ba2028 (단청 빨강)
const C = {
  paper:       '#FAF5D5',  // fff0aa 연하게 — 지도 배경
  park:        '#9ACFC5',  // 87cfbd 계열 — 공원
  parkDeep:    '#6BBDB0',  // 87cfbd 진하게 — 나무 그늘
  stream:      '#C0EAE4',  // 87cfbd 아주 연하게 — 수면
  carRoad:     '#EDE4B0',  // fff0aa 계열 — 차도
  carRoadEdge: '#C8B870',  // 황토 골드 — 도로 엣지
  alleyBase:   '#E8E0B0',  // fff0aa 계열 — 골목
  alleyHi:     '#F0EBD0',  // fff0aa 밝게 — 골목 하이라이트
  alleyJoint:  '#B8A868',  // 황토 — 골목 이음새
  wall:        '#C0A840',  // 황토 금빛 — 성벽
  wallGold:    '#C8A818',  // --gold — 성벽 금장
  route:       '#BA2028',  // 단청 빨강 — 산책 루트
  routeGlow:   '#D84050',  // 빨강 글로우
  palace:      '#C8A818',  // --gold — 궁궐
  ink:         '#1A0C08',
  muted:       '#6B5E52',
  pin:         '#BA2028',  // 단청 빨강 — 일반 핀
  pinGyebo:    '#C8A818',  // --gold — 막걸리 계보 핀
  surface:     '#FFFCF0',  // fff0aa 기반 흰면
}

// ── ROAD DATA (editorial-simplified) ──────────────────────────────────────
const CAR_ROADS = [
  // 정조로 (N-S main road, east side)
  [[37.2726,127.0164],[37.2751,127.0167],[37.2812,127.0166],[37.2832,127.0163],
   [37.2849,127.0158],[37.2854,127.0156]],
  // 팔달문 approach / roundabout roads
  [[37.2771,127.0167],[37.2773,127.0164],[37.2775,127.0163],[37.2778,127.0164],[37.2779,127.0167]],
  [[37.2751,127.0167],[37.2749,127.0164],[37.2740,127.0157],[37.2724,127.0144]],
  // 팔달산로 (W side, near park)
  [[37.2742,127.0104],[37.2760,127.0110],[37.2764,127.0095],[37.2769,127.0079],[37.2788,127.0066]],
  // 영화로 (cuts through upper area)
  [[37.2893,127.0094],[37.2880,127.0103],[37.2874,127.0108]],
  // 창룡대로 (upper-right diagonal)
  [[37.2818,127.0165],[37.2818,127.0175],[37.2818,127.0180]],
]

// Pedestrian alleys — widened editorially via thick stroke
const ALLEYS_MAJOR = [
  // 화서문로 (공방거리 N-S backbone)
  [[37.2848983,127.0108078],[37.2849893,127.0114413],[37.2850937,127.0119941],[37.2852089,127.0124979],
   [37.2852805,127.0128855],[37.2853596,127.0132394],[37.2854424,127.0136485],[37.2855271,127.0140824],
   [37.2857152,127.0150309],[37.2857904,127.0154120],[37.2858116,127.0155197]],
  // 신풍로 (E-W lateral)
  [[37.2876926,127.0133426],[37.2870354,127.0135778],[37.2867539,127.0136795],
   [37.2862461,127.0138588],[37.2858362,127.0139993],[37.2855271,127.0140824],
   [37.2845519,127.0143806],[37.2837348,127.0146729],[37.2832574,127.0147420]],
]
const ALLEYS_MINOR = [
  // 화서문로42번길
  [[37.2836906,127.0141139],[37.2843417,127.0131573],[37.2847431,127.0127866],[37.2852089,127.0124979]],
  // 화서문로48번길
  [[37.2853596,127.0132394],[37.2847452,127.0137334],[37.2844956,127.0138805],
   [37.2838524,127.0140615],[37.2836906,127.0141139]],
  // 화서문로 upper connector
  [[37.2852805,127.0128855],[37.2858096,127.0127158],[37.2863547,127.0125416],[37.2869720,127.0124018]],
  // 화서문로17번길
  [[37.2869720,127.0124018],[37.2860519,127.0108056],[37.2858393,127.0101765]],
  // 신풍로63번길
  [[37.2867539,127.0136795],[37.2866147,127.0129814],[37.2865315,127.0124842]],
  // 정조로885번길
  [[37.2869847,127.0151040],[37.2868344,127.0140734],[37.2867539,127.0136795]],
  // 화서문로72번길
  [[37.2840911,127.0169061],[37.2848900,127.0165288],[37.2853105,127.0163288],[37.2858844,127.0158363]],
  // 화서문로75번길
  [[37.2872317,127.0171233],[37.2862890,127.0164915],[37.2859472,127.0163275]],
]

// 화성 fortress wall
const FORTRESS = [
  [[37.2805613,127.0103058],[37.2803014,127.0102951],[37.2798786,127.0102121],[37.2795245,127.0101653],
   [37.2789825,127.0100996],[37.2786395,127.0102644],[37.2783605,127.0103900],[37.2779303,127.0105944],
   [37.2775784,127.0112920],[37.2774166,127.0116542],[37.2771289,127.0118004]],
]

// 수원천 stream
const STREAM = [
  [[37.2872858,127.0180663],[37.2861200,127.0178874],[37.2852880,127.0179850],[37.2840217,127.0181433],
   [37.2825474,127.0183204],[37.2808770,127.0185507],[37.2793648,127.0188101],[37.2783138,127.0189960]],
]

// Shops / cafes along 공방거리
const SHOPS = [
  { lat: 37.2843, lng: 127.0133, type: 'craft',   emoji: '🏺', label: '도자기\n공방' },
  { lat: 37.2854, lng: 127.0127, type: 'textile',  emoji: '🎨', label: '천연염색' },
  { lat: 37.2862, lng: 127.0138, type: 'craft',   emoji: '✂️', label: '가죽\n공방' },
  { lat: 37.2870, lng: 127.0127, type: 'craft',   emoji: '🪡', label: '공방' },
  { lat: 37.2871, lng: 127.0141, type: 'cafe',    emoji: '☕', label: '카페' },
  { lat: 37.2847, lng: 127.0144, type: 'craft',   emoji: '🖼️', label: '' },
  { lat: 37.2858, lng: 127.0152, type: 'cafe',    emoji: '🍵', label: '카페' },
  { lat: 37.2866, lng: 127.0133, type: 'rest',    emoji: '🪑', label: '쉼터' },
]

const POS_PALDALMUN = geo(37.2775, 127.0167)
const POS_HAENGGUNG = geo(37.2862, 127.0119)
const POS_GYEBO     = geo(37.2837, 127.0135)

// ── ZOOM / PAN ─────────────────────────────────────────────────────────────
const VB0 = { x: 0, y: 0, w: W, h: H }
const VB_MIN_W = W / 3.5   // max zoom ~3.5×
const VB_MAX_W = W * 1.1   // slight zoom out allowed

function clampVb({ x, y, w, h }) {
  const cw = Math.max(VB_MIN_W, Math.min(VB_MAX_W, w))
  const ch = H * (cw / W)
  const cx = Math.max(-cw * 0.25, Math.min(W - cw * 0.75, x))
  const cy = Math.max(-ch * 0.25, Math.min(H - ch * 0.75, y))
  return { x: cx, y: cy, w: cw, h: ch }
}

// ── COMPONENT ─────────────────────────────────────────────────────────────
export default function MapSvg({ course, activeIdx, onMarkerClick }) {
  const [gpsPos, setGpsPos] = useState(null)
  const [demoT, setDemoT] = useState(0)
  const [vb, setVb] = useState(VB0)
  const vbRef = useRef(VB0)
  const svgRef = useRef(null)
  const ges = useRef({}) // gesture scratch state

  // GPS
  useEffect(() => {
    if (!navigator.geolocation) return
    const id = navigator.geolocation.watchPosition(
      p => setGpsPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      null, { enableHighAccuracy: true, timeout: 8000 },
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  // Demo walk animation
  useEffect(() => {
    let t = 0
    const id = setInterval(() => { t = (t + 0.002) % 1; setDemoT(t) }, 100)
    return () => clearInterval(id)
  }, [course])

  const applyVb = useCallback((next) => {
    const c = clampVb(next)
    vbRef.current = c
    setVb(c)
  }, [])

  // ── Wheel zoom ────────────────────────────────────────────────────────
  const onWheel = useCallback((e) => {
    if (!e.ctrlKey && !e.metaKey) return  // let page scroll normally without modifier key
    e.preventDefault()
    const curr = vbRef.current
    const rect = svgRef.current.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * curr.w + curr.x
    const my = ((e.clientY - rect.top) / rect.height) * curr.h + curr.y
    const f = e.deltaY > 0 ? 1.18 : 0.85
    applyVb({
      x: mx - (mx - curr.x) * f,
      y: my - (my - curr.y) * f,
      w: curr.w * f, h: curr.h * f,
    })
  }, [applyVb])

  // ── Mouse drag ────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    ges.current.drag = { sx: e.clientX, sy: e.clientY, vb: vbRef.current }
  }, [])
  const onMouseMove = useCallback((e) => {
    const d = ges.current.drag
    if (!d) return
    const rect = svgRef.current.getBoundingClientRect()
    applyVb({
      ...d.vb,
      x: d.vb.x - ((e.clientX - d.sx) / rect.width) * d.vb.w,
      y: d.vb.y - ((e.clientY - d.sy) / rect.height) * d.vb.h,
    })
  }, [applyVb])
  const onMouseUp = useCallback(() => { ges.current.drag = null }, [])

  // ── Touch pan + pinch zoom ────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      ges.current.drag = { sx: e.touches[0].clientX, sy: e.touches[0].clientY, vb: vbRef.current }
      ges.current.pinch = null
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      ges.current.pinch = {
        dist: Math.hypot(dx, dy),
        mx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        my: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        vb: vbRef.current,
      }
      ges.current.drag = null
    }
  }, [])

  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    const rect = svgRef.current.getBoundingClientRect()
    if (e.touches.length === 1 && ges.current.drag) {
      const d = ges.current.drag
      applyVb({
        ...d.vb,
        x: d.vb.x - ((e.touches[0].clientX - d.sx) / rect.width) * d.vb.w,
        y: d.vb.y - ((e.touches[0].clientY - d.sy) / rect.height) * d.vb.h,
      })
    } else if (e.touches.length === 2 && ges.current.pinch) {
      const p = ges.current.pinch
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const f = p.dist / Math.hypot(dx, dy)
      const mx = ((p.mx - rect.left) / rect.width) * p.vb.w + p.vb.x
      const my = ((p.my - rect.top) / rect.height) * p.vb.h + p.vb.y
      applyVb({
        x: mx - (mx - p.vb.x) * f,
        y: my - (my - p.vb.y) * f,
        w: p.vb.w * f, h: p.vb.h * f,
      })
    }
  }, [applyVb])

  const onTouchEnd = useCallback(() => { ges.current.drag = null; ges.current.pinch = null }, [])

  // Attach non-passive listeners
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [onWheel, onTouchMove])

  const resetZoom = () => applyVb(VB0)

  // Derived render values
  const userLatLng = gpsPos ?? walkPath(course.heatmapPath, demoT)
  const rawU = geo(userLatLng.lat, userLatLng.lng)
  const u = { x: Math.max(8, Math.min(W - 8, rawU.x)), y: Math.max(8, Math.min(H - 8, rawU.y)) }

  const aPlace = course.places[activeIdx]
  const aPos = geo(aPlace.lat, aPlace.lng)
  const lblX = Math.max(54, Math.min(aPos.x, W - 54))
  const lblY = aPos.y > 44 ? aPos.y - 46 : aPos.y + 24

  const routePts = ptStr(course.heatmapPath)
  const isZoomed = vb.w < W * 0.85

  return (
    <div className={styles.wrap}>
      <svg
        ref={svgRef}
        viewBox={`${vb.x.toFixed(2)} ${vb.y.toFixed(2)} ${vb.w.toFixed(2)} ${vb.h.toFixed(2)}`}
        className={styles.svg}
        style={{ cursor: ges.current.drag ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <defs>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="dropShadow">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(30,20,10,0.20)" />
          </filter>
          <filter id="pinShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="rgba(30,20,10,0.30)" />
          </filter>
          {/* subtle dot texture for sidewalks */}
          <pattern id="dotGrid" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.6" fill={C.alleyJoint} fillOpacity="0.35" />
          </pattern>
        </defs>

        {/* ── 1. PAPER BACKGROUND ─────────────────────────────────── */}
        <rect width={W} height={H} fill={C.paper} />

        {/* ── 1b. DXF TOPOGRAPHIC BASE (full canvas) ───────────────── */}
        <g opacity="0.60">
          {DXF_GREEN.map((p, i) => <polygon key={i} points={p} fill={C.park} stroke="none" />)}
        </g>
        <g opacity="0.65">
          {DXF_ROADS.map((p, i) => <polygon key={i} points={p} fill={C.carRoad} stroke="none" />)}
        </g>
        <g opacity="0.28">
          {DXF_BUILDINGS.map((p, i) => (
            <polygon key={i} points={p} fill="#C4B490" stroke="#A89060" strokeWidth="0.5" />
          ))}
        </g>
        <g opacity="0.45">
          {DXF_WATER.map((p, i) => (
            <polyline key={i} points={p} fill="none" stroke={C.stream} strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>

        {/* ── 2. 팔달산 PARK — organic green blob ──────────────────── */}
        <path
          d="M0,0 L52,0 C60,30 72,80 88,130 C102,180 108,240 104,310
             C100,370 88,430 74,500 L0,500 Z"
          fill={C.park} fillOpacity="0.30"
        />
        <path
          d="M0,0 L38,0 C44,28 56,75 70,120 C84,165 88,225 85,290
             C82,350 72,420 58,500 L0,500 Z"
          fill={C.parkDeep} fillOpacity="0.14"
        />
        {/* tree canopy dots */}
        {[[14,70],[26,140],[18,220],[28,310],[16,390],[24,460]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="9" fill={C.parkDeep} fillOpacity="0.16" />
            <circle cx={x} cy={y} r="6" fill={C.park} fillOpacity="0.22" />
          </g>
        ))}
        <text x="19" y="228" textAnchor="middle" fontSize="7" fontWeight="700"
          fill={C.parkDeep} fillOpacity="0.5" fontFamily="Pretendard, sans-serif"
          transform="rotate(-90,19,228)">팔달산</text>

        {/* ── 3. 수원천 STREAM ─────────────────────────────────────── */}
        {STREAM.map((seg, i) => (
          <g key={i}>
            <polyline points={pts(seg)} fill="none"
              stroke={C.stream} strokeWidth="6" strokeOpacity="0.45"
              strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={pts(seg)} fill="none"
              stroke="#D8EEFA" strokeWidth="2.5" strokeOpacity="0.55"
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* ── 4–6. ROADS/ALLEYS replaced by DXF base layer ─────────── */}

        {/* ── 7. 화성 FORTRESS WALL ─────────────────────────────────── */}
        {FORTRESS.map((seg, i) => (
          <g key={i}>
            {/* stone mass */}
            <polyline points={pts(seg)} fill="none"
              stroke={C.wall} strokeWidth="8"
              strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.50" />
            {/* top surface gold */}
            <polyline points={pts(seg)} fill="none"
              stroke={C.wallGold} strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.65" />
            {/* crenellation dashes */}
            <polyline points={pts(seg)} fill="none"
              stroke={C.wallGold} strokeWidth="5"
              strokeLinecap="square"
              strokeDasharray="10 6" strokeOpacity="0.45" />
          </g>
        ))}

        {/* ── 8. 팔달문 GATE ─────────────────────────────────────────── */}
        {/* roundabout approach road circle */}
        <circle cx={POS_PALDALMUN.x} cy={POS_PALDALMUN.y}
          r="16" fill={C.carRoad} stroke={C.carRoad} strokeWidth="5" />
        <circle cx={POS_PALDALMUN.x} cy={POS_PALDALMUN.y}
          r="8" fill={C.paper} stroke={C.carRoadEdge} strokeWidth="1" />
        {/* gate icon */}
        <g filter="url(#dropShadow)">
          <rect x={POS_PALDALMUN.x - 14} y={POS_PALDALMUN.y - 20}
            width="28" height="20" rx="2"
            fill={C.wallGold} fillOpacity="0.25" stroke={C.wall} strokeWidth="1.2" />
          <rect x={POS_PALDALMUN.x - 9} y={POS_PALDALMUN.y - 28}
            width="18" height="10" rx="1.5"
            fill={C.palace} fillOpacity="0.30" stroke={C.wallGold} strokeWidth="1" />
          <polyline
            points={`${POS_PALDALMUN.x - 11},${POS_PALDALMUN.y - 28} ${POS_PALDALMUN.x},${POS_PALDALMUN.y - 34} ${POS_PALDALMUN.x + 11},${POS_PALDALMUN.y - 28}`}
            fill="none" stroke={C.wallGold} strokeWidth="1.2" strokeLinejoin="round" />
          {/* gate arch */}
          <path d={`M${POS_PALDALMUN.x - 5},${POS_PALDALMUN.y - 20}
            A5,6 0 0 1 ${POS_PALDALMUN.x + 5},${POS_PALDALMUN.y - 20}`}
            fill="none" stroke={C.wall} strokeWidth="1" />
        </g>
        <text x={POS_PALDALMUN.x} y={POS_PALDALMUN.y + 13}
          textAnchor="middle" fontSize="7.5" fontWeight="800"
          fill="#5A3A1A" fontFamily="Pretendard, sans-serif">팔달문</text>

        {/* ── 9. 화성행궁 PALACE COMPLEX ───────────────────────────── */}
        <g filter="url(#dropShadow)">
          {/* outer wall / compound */}
          <rect x={POS_HAENGGUNG.x - 28} y={POS_HAENGGUNG.y - 22}
            width="56" height="40" rx="4"
            fill={C.palace} fillOpacity="0.08"
            stroke={C.palace} strokeWidth="1.2" strokeDasharray="5 2.5" />
          {/* main hall body */}
          <rect x={POS_HAENGGUNG.x - 16} y={POS_HAENGGUNG.y - 14}
            width="32" height="22" rx="2"
            fill={C.palace} fillOpacity="0.22" stroke={C.wallGold} strokeWidth="1.2" />
          {/* hip roof */}
          <polygon
            points={`${POS_HAENGGUNG.x - 18},${POS_HAENGGUNG.y - 14} ${POS_HAENGGUNG.x},${POS_HAENGGUNG.y - 24} ${POS_HAENGGUNG.x + 18},${POS_HAENGGUNG.y - 14}`}
            fill={C.palace} fillOpacity="0.30" stroke={C.wallGold} strokeWidth="1" strokeLinejoin="round" />
          {/* roof ridge */}
          <line x1={POS_HAENGGUNG.x - 18} y1={POS_HAENGGUNG.y - 14}
            x2={POS_HAENGGUNG.x + 18} y2={POS_HAENGGUNG.y - 14}
            stroke={C.wallGold} strokeWidth="1.5" strokeOpacity="0.6" />
          {/* side wings */}
          {[[-27, -10, 10, 12], [17, -10, 10, 12]].map(([dx, dy, w, h], i) => (
            <g key={i}>
              <rect x={POS_HAENGGUNG.x + dx} y={POS_HAENGGUNG.y + dy}
                width={w} height={h} rx="1"
                fill={C.palace} fillOpacity="0.15" stroke={C.wallGold} strokeWidth="0.8" />
              <polygon
                points={`${POS_HAENGGUNG.x + dx},${POS_HAENGGUNG.y + dy} ${POS_HAENGGUNG.x + dx + w / 2},${POS_HAENGGUNG.y + dy - 6} ${POS_HAENGGUNG.x + dx + w},${POS_HAENGGUNG.y + dy}`}
                fill={C.palace} fillOpacity="0.20" stroke={C.wallGold} strokeWidth="0.6" strokeLinejoin="round" />
            </g>
          ))}
        </g>
        <text x={POS_HAENGGUNG.x} y={POS_HAENGGUNG.y + 6}
          textAnchor="middle" fontSize="6" fontWeight="800"
          fill="#7A5A1C" fontFamily="Pretendard, sans-serif">화성행궁</text>

        {/* ── 10. CRAFT SHOP ICONS — removed (DXF buildings show area) ─ */}

        {/* ── 11. AREA LABELS ──────────────────────────────────────── */}
        {/* 공방거리 area label */}
        {(() => { const p = geo(37.2856, 127.0132); return (
          <g>
            <text x={p.x} y={p.y - 2}
              textAnchor="middle" fontSize="9" fontWeight="900"
              fill="#6A4A20" fillOpacity="0.60" fontFamily="Pretendard, sans-serif"
              letterSpacing="2.5">공방거리</text>
            <line x1={p.x - 22} y1={p.y + 2} x2={p.x + 22} y2={p.y + 2}
              stroke="#C4932A" strokeWidth="1" strokeOpacity="0.45" />
          </g>
        )})()}
        {/* 공방거리 입구 badge */}
        {(() => { const p = geo(37.2838, 127.0136); return (
          <g>
            <rect x={p.x - 23} y={p.y - 9} width="46" height="14" rx="7"
              fill="#F7DCE1" stroke="#E89AA5" strokeWidth="0.9" />
            <text x={p.x} y={p.y + 1.5} textAnchor="middle"
              fontSize="6.5" fill="#A03060" fontFamily="Pretendard, sans-serif"
              fontWeight="700">공방거리 입구</text>
          </g>
        )})()}
        {/* 행궁동 neighborhood watermark */}
        {(() => { const p = geo(37.2850, 127.0107); return (
          <text x={p.x} y={p.y} textAnchor="middle" fontSize="12" fontWeight="700"
            fill="#8A6A3A" fillOpacity="0.22" fontFamily="Pretendard, sans-serif">행궁동</text>
        )})()}
        {/* 성곽길 */}
        {(() => { const p = geo(37.2793, 127.0102); return (
          <text x={p.x} y={p.y} textAnchor="middle" fontSize="6.5"
            fill={C.wallGold} fillOpacity="0.80" fontFamily="Pretendard, sans-serif"
            fontWeight="700" transform={`rotate(-36,${p.x},${p.y})`}>성곽길</text>
        )})()}
        {/* 정조로 road label */}
        {(() => { const p = geo(37.2760, 127.0165); return (
          <text x={p.x} y={p.y} textAnchor="middle" fontSize="5.5"
            fill={C.muted} fillOpacity="0.6" fontFamily="Pretendard, sans-serif"
            transform={`rotate(-88,${p.x},${p.y})`}>정조로</text>
        )})()}

        {/* ── 12. WALKING ROUTE (terracotta) ────────────────────────── */}
        {/* outer glow */}
        <polyline points={routePts} fill="none"
          stroke={C.routeGlow} strokeWidth="14"
          strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.12" />
        {/* main route dashes */}
        <polyline points={routePts} fill="none"
          stroke={C.route} strokeWidth="4.5"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="10 7" strokeOpacity="0.90" />
        {/* white center dots for depth */}
        <polyline points={routePts} fill="none"
          stroke="#FFFCF5" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="0 17" strokeOpacity="0.55" />

        {/* ── 13. ACTIVE PLACE GLOW ─────────────────────────────────── */}
        <circle cx={aPos.x} cy={aPos.y} r="32" fill={C.route} fillOpacity="0.06" />
        <circle cx={aPos.x} cy={aPos.y} r="20" fill={C.route} fillOpacity="0.08" />

        {/* ── 14. PLACE MARKERS ─────────────────────────────────────── */}
        {course.places.map((place, idx) => {
          const pt = geo(place.lat, place.lng)
          const isGyebo  = place.type === 'start' || place.type === 'end'
          const isActive = idx === activeIdx
          const r = isActive ? 15 : 10
          return (
            <g key={place.id} onClick={() => onMarkerClick?.(idx)} style={{ cursor: 'pointer' }}>
              {/* drop shadow */}
              <circle cx={pt.x + 1.5} cy={pt.y + 2.5} r={r} fill="rgba(30,20,10,0.20)" />
              {/* marker body */}
              <circle cx={pt.x} cy={pt.y} r={r}
                fill={isGyebo ? C.pinGyebo : isActive ? '#FAE8DC' : C.surface}
                stroke={isGyebo ? '#8A6010' : isActive ? C.route : '#CCC4B0'}
                strokeWidth={isActive ? 2.5 : 1.5}
                filter={isActive ? 'url(#pinShadow)' : undefined}
              />
              <text x={pt.x} y={pt.y + 4.5} textAnchor="middle"
                fontSize={isGyebo ? 12 : 8.5} fontWeight="800"
                fill={isGyebo ? '#FFFCF5' : C.ink}
                fontFamily="Pretendard, sans-serif"
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {isGyebo ? '🍶' : idx + 1}
              </text>
            </g>
          )
        })}

        {/* ── 15. ACTIVE PLACE LABEL ────────────────────────────────── */}
        <g filter="url(#pinShadow)">
          <rect x={lblX - 52} y={lblY} width="104" height="23" rx="11.5"
            fill="#1E140A" fillOpacity="0.84" />
        </g>
        <text x={lblX} y={lblY + 15} textAnchor="middle"
          fontSize="9.5" fontWeight="700" fill="#FFFCF5"
          fontFamily="Pretendard, sans-serif" style={{ pointerEvents: 'none' }}>
          {aPlace.name}
        </text>

        {/* ── 16. USER DOT ─────────────────────────────────────────── */}
        <circle cx={u.x} cy={u.y} r="14" fill="#4A9880" fillOpacity="0.15">
          <animate attributeName="r" values="14;24;14" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.15;0;0.15" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={u.x} cy={u.y} r="6.5" fill="#4A9880" />
        <circle cx={u.x} cy={u.y} r="6.5" fill="none" stroke="white" strokeWidth="2" />
        {!gpsPos && (
          <text x={u.x + 12} y={u.y + 4} fontSize="7" fill="#4A9880"
            fontFamily="Pretendard, sans-serif" fillOpacity="0.75">데모</text>
        )}

        {/* ── 17. COMPASS ──────────────────────────────────────────── */}
        <g transform={`translate(${W - 30}, 30)`}>
          <circle r="19" fill={C.surface} fillOpacity="0.94" stroke="#DDD0B8" strokeWidth="1.2" />
          <polygon points="0,-13 -4.5,2 0,-1 4.5,2" fill={C.pinGyebo} />
          <polygon points="0,13 -4.5,-2 0,1 4.5,-2" fill="#CCC4B0" />
          <text y="-5.5" textAnchor="middle" fontSize="7" fontWeight="800"
            fill={C.pinGyebo} fontFamily="Pretendard, sans-serif">N</text>
        </g>

        {/* ── 18. SCALE BAR ────────────────────────────────────────── */}
        <g transform="translate(14, 487)">
          <rect x="-2" y="-12" width="60" height="18" rx="3"
            fill={C.surface} fillOpacity="0.80" />
          <line x1="0" y1="0" x2="50" y2="0" stroke="#9A8870" strokeWidth="1.5" />
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#9A8870" strokeWidth="1.5" />
          <line x1="50" y1="-4" x2="50" y2="4" stroke="#9A8870" strokeWidth="1.5" />
          <text x="25" y="-7" textAnchor="middle" fontSize="6.5"
            fill="#9A8870" fontFamily="Pretendard, sans-serif">200m</text>
        </g>

        {/* ── 19. ZOOM HINT (shown when not zoomed) ────────────────── */}
        {!isZoomed && (
          <g transform={`translate(${W / 2}, ${H - 16})`}>
            <rect x="-46" y="-10" width="92" height="14" rx="7"
              fill={C.ink} fillOpacity="0.35" />
            <text y="1.5" textAnchor="middle" fontSize="6.5" fill={C.surface}
              fontFamily="Pretendard, sans-serif" fillOpacity="0.85">
              핀치 또는 Ctrl+스크롤로 확대
            </text>
          </g>
        )}
      </svg>

      {/* Reset zoom button */}
      {isZoomed && (
        <button
          onClick={resetZoom}
          style={{
            position: 'absolute', bottom: 64, right: 12,
            width: 32, height: 32,
            background: 'rgba(255,252,245,0.93)',
            border: '1px solid #DDD0B8',
            borderRadius: 8,
            fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(30,20,10,0.15)',
          }}
          title="전체 보기"
        >⊕</button>
      )}
    </div>
  )
}
