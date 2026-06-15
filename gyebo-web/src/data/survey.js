// 소비자 맞춤 막걸리 추천 설문
// 5문항으로 취향을 수집해 막걸리 계보 10종 중 한 잔을 추천한다.
// 기존 취향 테스트(TasteTest)의 추천 개념을 계승·확장 — 모든 문항이 추천에 반영됨.
// kind: 'list' (둥근 사각 버튼) | 'bubble' (원형 버블)
export const surveyQuestions = [
  {
    id: 'experience',
    kind: 'list',
    status: 'ABOUT YOU',
    question: '막걸리,\n얼마나 즐기세요?',
    options: [
      { label: '이제 막 입문했어요',   value: 'intro' },
      { label: '어느 정도 마셔봤어요', value: 'mid' },
      { label: '막걸리 마니아예요',    value: 'deep' },
    ],
  },
  {
    id: 'sweetness',
    kind: 'list',
    status: 'YOUR TASTE',
    question: '어떤 맛이\n더 끌리세요?',
    options: [
      { label: '달콤하고 부드러운',   value: 'sweet' },
      { label: '드라이하고 깔끔한',   value: 'dry' },
    ],
  },
  {
    id: 'body',
    kind: 'list',
    status: 'YOUR TASTE',
    question: '어떤 무게감이\n좋으세요?',
    options: [
      { label: '가볍고 산뜻하게',     value: 'light' },
      { label: '적당히 균형 잡힌',    value: 'medium' },
      { label: '진하고 묵직하게',     value: 'heavy' },
    ],
  },
  {
    id: 'mood',
    kind: 'bubble',
    status: 'THE MOOD',
    question: '오늘은\n어떤 기분이세요?',
    options: [
      { label: '산뜻하게',   value: 'fresh' },
      { label: '향긋하게',   value: 'aroma' },
      { label: '깊고 묵직',  value: 'rich' },
      { label: '감성적으로', value: 'emotional' },
      { label: '든든하게',   value: 'hearty' },
    ],
  },
  {
    id: 'pairing',
    kind: 'bubble',
    status: 'LAST ONE',
    question: '어떤 안주와\n함께할까요?',
    options: [
      { label: '전·부침개',  value: 'jeon' },
      { label: '회·해산물',  value: 'seafood' },
      { label: '과일·치즈',  value: 'fruit' },
      { label: '혼자 음미',  value: 'alone' },
      { label: '매콤한 안주', value: 'spicy' },
    ],
  },
]

/* ── 추천 로직 ──────────────────────────────
   experience  → 레벨 필터 (입문/중급/심화)
   sweetness   → 단맛/드라이 선호 점수
   body        → 바디감 근접도 (목표값과의 거리)
   mood/pairing→ 태그 매칭 보너스
   ───────────────────────────────────────── */
const BODY_TARGET = { light: 2, medium: 3, heavy: 5 }
const MOOD_TAG = {
  fresh: '청량함', aroma: '향긋함', rich: '묵직함',
  emotional: '감성', hearty: '고소함',
}
const PAIR_TAGS = {
  jeon:    ['고소함', '묵직함'],
  seafood: ['청량함', '신선함'],
  fruit:   ['달콤함', '과일향'],
  alone:   ['감성', '시적'],
  spicy:   ['묵직함', '고도수'],
}

export function recommendMakgeolli(answers, list) {
  const level = answers.experience ?? 'intro'
  let pool = list.filter(m => m.level === level)
  if (!pool.length) pool = list

  const wantSweet  = answers.sweetness === 'sweet'
  const bodyTarget = BODY_TARGET[answers.body] ?? 3
  const moodTag    = MOOD_TAG[answers.mood]
  const pairTags   = PAIR_TAGS[answers.pairing] ?? []

  const scoreOf = m => {
    let s = (wantSweet ? m.metrics.sweetness : (5 - m.metrics.sweetness)) * 1.2
    s -= Math.abs(m.metrics.body - bodyTarget) * 0.7
    if (moodTag && m.tags.includes(moodTag)) s += 2.2
    pairTags.forEach(t => { if (m.tags.includes(t)) s += 1.3 })
    return s
  }

  return pool.reduce((best, cur) => (scoreOf(cur) > scoreOf(best) ? cur : best))
}
