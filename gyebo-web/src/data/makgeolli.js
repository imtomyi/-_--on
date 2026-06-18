// 입문 / 중급 / 심화 레벨로 구분
// 취향 테스트 연동: tags 필드로 매칭
// 재료 일러스트(image) — 카탈로그 카드 썸네일
// 맛 지표(metrics): sweetness 단맛 / acidity 산미 / body 바디 / abv 도수(미상=null)
import apple from '../assets/ingredients/apple.png'
import blackbean from '../assets/ingredients/blackbean.png'
import chestnut from '../assets/ingredients/chestnut_2.png'
import yuzu from '../assets/ingredients/yuzu_2.png'
import omija from '../assets/ingredients/omija_2.png'
import wheat from '../assets/ingredients/wheat.png'
import rice from '../assets/ingredients/rice.png'
import riceGlutinous from '../assets/ingredients/rice.png'
import bowlFlower from '../assets/ingredients/bowl-flower.png'

import chestnut_2 from '../assets/ingredients/chestnut_2.png'
import yuzu_2 from '../assets/ingredients/yuzu_2.png'
import omija_2 from '../assets/ingredients/omija_2.png'
import cloud from '../assets/ingredients/cloud.png'

import appleReal from '../assets/apple_real.png'
import chestnutReal from '../assets/chestnut_real.png'

export const makgeolliList = [
  {
    id: 'jipyeong',
    name: '지평생막걸리',
    region: '경기 양평',
    brewery: '지평주조',
    ingredient: '쌀',
    level: 'mid',
    levelLabel: '대중',
    story: '전국 스테디셀러. 이름을 모르면 간첩이라는 막걸리계의 기준점입니다. 100년 가까운 세월 동안 맑은 우물물과 전통 기법을 고집하며 한국 근현대사와 함께해 온 산증인 같은 술.',
    tastingNote: '달달하고 부드러운 맛, 깔끔한 목 넘김. 옛 막걸리 특유의 텁텁함 없이 누구나 편하게 즐길 수 있어 생막걸리의 기준이 됩니다.',
    metrics: { sweetness: 3, acidity: 2, body: 2, abv: null },
    tags: ['가벼움', '신선함', '입문'],
    color: '#C8D8A8',
    image: wheat,
    detailImage: wheat,
  },
  {
    id: 'cheongsong',
    name: '청송사과막걸리',
    region: '경북 청송',
    brewery: '청송양조장',
    ingredient: '사과',
    level: 'intro',
    levelLabel: '입문',
    story: '입에 머금으면 은은한 사과향이 감도는 청송사과막걸리 많이 달지 않고 숙취도 적어 술술 넘어가는 베스트셀러\n\n대대로 청송 심씨 여인들이 고운 데는 비밀이 있다. 막걸리계보 안주인께 비결을 여쭤보니 "글쎄요, 피부과는 한 번도 간 적이 없는데요."',
    tastingNote: '',
    metrics: { sweetness: 4, acidity: 1, body: 2, abv: null },
    tags: ['달콤함', '과일향', '입문'],
    color: '#F2C084',
    image: apple,
    detailImage: apple,
    realImage: appleReal,
    favorite: true,
  },
  {
    id: 'gongju',
    name: '공주알밤왕밤주',
    region: '충남 공주',
    brewery: '사곡양조원',
    ingredient: '알밤',
    level: 'intro',
    levelLabel: '입문',
    story: '밤막걸리는 이걸로 종결. 충남 공주, 밤의 고장에서 온 막걸리입니다. 공주 특산물 알밤으로 빚어 가을 공주 밤 한 조각을 한 모금에 담았습니다.',
    tastingNote: '밤 특유의 구수하고 은은한 단맛이 혀를 감쌉니다. 알코올의 쓴맛이 거의 없어 막걸리 입문자도 거부감 없이 즐길 수 있습니다.',
    metrics: { sweetness: 4, acidity: 1, body: 3, abv: null },
    tags: ['달콤함', '고소함', '입문'],
    color: '#C4A05A',
    image: chestnut_2,
    detailImage: chestnut_2,
  },
  {
    id: 'goheung',
    name: '고흥풍양유자막걸리',
    region: '전남 고흥',
    brewery: '풍양양조장',
    ingredient: '유자',
    level: 'intro',
    levelLabel: '입문',
    story: '유자막걸리를 전부 다 마셔본 사장님의 원픽. 고흥 간척지에서 자란 쌀과 전남 고흥 유자로 빚어, 한 병에 유자가 무려 2개나 들어갑니다.',
    tastingNote: '첫향은 유자의 싱그러움, 뒷맛은 깔끔함. 기름진 안주 뒤에 마시면 개운하게 입을 정리해줍니다. 당도 3·산도 3의 균형 잡힌 맛.',
    metrics: { sweetness: 3, acidity: 3, body: 2, abv: null },
    tags: ['청량함', '향긋함', '중급'],
    color: '#E8D06A',
    image: yuzu_2,
    detailImage: yuzu_2,
  },
  {
    id: 'mungyeong',
    name: '문경오미자막걸리',
    region: '경북 문경',
    brewery: '문경주조',
    ingredient: '오미자',
    level: 'intro',
    levelLabel: '입문',
    story: '국내 최초 과일 생막걸리. 아름다운 오미자 빛깔에 빠져드는 묘한 매력의 막걸리입니다. 계절 한정 라인업이라 있을 때 마셔야 합니다.',
    tastingNote: '막걸리 특유의 텁텁함이 없이 산뜻하여 기름진 음식의 느끼함을 잘 잡아줍니다. 단맛 3·산미 3·바디 1·탄산 3의 가벼운 청량감.',
    metrics: { sweetness: 3, acidity: 3, body: 1, abv: null },
    tags: ['복잡한맛', '깊이', '중급'],
    color: '#C4607A',
    image: omija_2,
    detailImage: omija_2,
  },
  {
    id: 'sobaek',
    name: '소백산검은콩막걸리',
    region: '충북 단양',
    brewery: '대강양조장',
    ingredient: '검은콩',
    level: 'mid',
    levelLabel: '대중',
    story: '100년 넘은 대강양조장이 빚는 소백산검은콩막걸리 검은콩 두유 맛에 달달하고 산미가 적어 매니아층이 확실\n\n먼 과거, 소백산 산기슭에 머리털이 풍성한 노인이 있었는데, 비결을 묻자 그저 웃으며 검은콩 막걸리 한 사발을 들어 보였다고 한다.',
    tastingNote: '',
    metrics: { sweetness: 2, acidity: 3, body: 4, abv: null },
    tags: ['고소함', '묵직함', '대중'],
    color: '#4A3560',
    image: blackbean,
    detailImage: blackbean,
    realImage: chestnutReal,
  },
  {
    id: 'cloud',
    name: '구름을벗삼아',
    region: '경북 문경',
    brewery: '문경주조',
    ingredient: '쌀',
    level: 'mid',
    levelLabel: '대중',
    story: '기본 막걸리의 정수를 느껴보고 싶다면 바로 이 술. 화려한 재료 없이 햇쌀 본연의 맛에 집중한 쌀막걸리로, 막걸리 입문자에게 가장 먼저 권하는 한 잔입니다.',
    tastingNote: '가볍고 청량하며 쌀의 은은한 단맛이 뒷받침됩니다. 어떤 안주와도 무난히 어울려 여러 잔 마시기에도 부담이 없습니다.',
    metrics: { sweetness: 2, acidity: 3, body: 3, abv: null },
    tags: ['감성', '시적', '중급'],
    color: '#8AAEC4',
    image: cloud,
    detailImage: cloud,
  },
  {
    id: 'anjeun',
    name: '앉은뱅이술',
    region: '충남 서천',
    brewery: '한산소곡주',
    ingredient: '쌀',
    level: 'deep',
    levelLabel: '전통',
    story: "며느리가 몰래 마시다 그대로 앉은뱅이가 되었다는 술 — 한산소곡주의 별명입니다. 막걸리를 빚을 때 위에 맑게 뜬 것만 떠낸 약주로, 탁한 막걸리와는 전혀 다른 결을 가집니다.",
    tastingNote: '투명하고 맑으며 깊은 단맛이 서서히 올라옵니다. 탁주와 달리 곱고 부드러운 질감이라 처음 마시는 사람도 쉽게 빠져들 수 있어 더 위험합니다.',
    metrics: { sweetness: 1, acidity: 4, body: 4, abv: 8 },
    tags: ['희귀', '역사', '심화'],
    color: '#8C7A52',
    image: bowlFlower,
    detailImage: bowlFlower,
  },
  {
    id: 'haenam-chap',
    name: '해남찹쌀막걸리 9도',
    region: '전남 해남',
    brewery: '삼산주조장',
    ingredient: '찹쌀',
    level: 'deep',
    levelLabel: '전통',
    story: '해창막걸리와는 또 다른 매력을 느끼고 싶다면 이 막걸리. 전남 해남 찹쌀로 빚어 도수가 9도임에도 목 넘김이 꿀떡꿀떡, 엄청나게 부드럽습니다.',
    tastingNote: '찹쌀 특유의 걸쭉하고 달콤한 질감이 일품입니다. 높은 도수가 무색할 만큼 술술 넘어가 자신도 모르게 한 병을 비우게 됩니다.',
    metrics: { sweetness: 3, acidity: 3, body: 5, abv: 9 },
    tags: ['고도수', '묵직함', '심화'],
    color: '#C47840',
    image: riceGlutinous,
    detailImage: riceGlutinous,
  },
  {
    id: 'haechang',
    name: '해창막걸리 9도',
    region: '전남 해남',
    brewery: '해창주조장',
    ingredient: '쌀',
    level: 'deep',
    levelLabel: '전통',
    story: '대한민국 프리미엄 막걸리의 정수. 해창막걸리를 모르면 간첩. 마니아층이 확실한 술로, 한 번 맛보면 다른 막걸리가 심심하게 느껴질 수 있습니다.',
    tastingNote: '압도적인 바디감과 긴 여운. 술의 입자가 고와 입 전체를 부드럽게 감싸며, 시원한 단맛과 새콤한 산미의 균형이 탁월합니다.',
    metrics: { sweetness: 2, acidity: 4, body: 5, abv: 9 },
    tags: ['고도수', '정통', '심화'],
    color: '#3A5C40',
    image: rice,
    detailImage: rice,
  },
]

// 취향 테스트 질문 — 항아리에 담는 5문항
// kind: 'list' (모서리 둥근 버튼) | 'bubble' (원형 버블)
// 답변 키(sweetness/body/mood/pairing/experience)는 추천 로직(recommendMakgeolli)과 연동
export const tasteQuestions = [
  {
    id: 'sweetness',
    kind: 'list',
    status: "LET'S START",
    question: '어떤 맛을 더 좋아해요?',
    options: [
      { label: '달고 부드럽게', value: 'sweet' },
      { label: '드라이하고 깔끔하게', value: 'dry' },
    ],
  },
  {
    id: 'body',
    kind: 'list',
    status: 'YOUR TASTE',
    question: '어떤 무게감이 좋아요?',
    options: [
      { label: '가볍고 산뜻하게', value: 'light' },
      { label: '적당히 균형 잡힌', value: 'medium' },
      { label: '진하고 묵직하게', value: 'heavy' },
    ],
  },
  {
    id: 'mood',
    kind: 'bubble',
    status: 'THE MOOD',
    question: '오늘은 어떤 한 잔?',
    options: [
      { label: '산뜻하게', value: 'fresh' },
      { label: '향긋하게', value: 'aroma' },
      { label: '깊고 묵직하게', value: 'rich' },
      { label: '감성적으로', value: 'emotional' },
      { label: '든든하게', value: 'hearty' },
    ],
  },
  {
    id: 'pairing',
    kind: 'bubble',
    status: 'PAIRING',
    question: '어떤 안주와 함께?',
    options: [
      { label: '전·부침개',  value: 'jeon' },
      { label: '회·해산물',  value: 'seafood' },
      { label: '과일·치즈',  value: 'fruit' },
      { label: '혼자 음미',  value: 'alone' },
      { label: '매콤한 안주', value: 'spicy' },
    ],
  },
  {
    id: 'experience',
    kind: 'list',
    status: 'LAST ONE',
    question: '막걸리, 얼마나 즐겨요?',
    options: [
      { label: '처음이거나 익숙하지 않아요', value: 'intro' },
      { label: '어느 정도 마셔봤어요', value: 'mid' },
      { label: '마니아예요', value: 'deep' },
    ],
  },
]
