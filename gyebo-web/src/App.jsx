import { useState } from 'react'
import GyeboLanding from './components/GyeboLanding'
import MakgeolliPage from './components/MakgeolliPage'
import ViewSelect from './components/ViewSelect'
import LangToggle from './components/LangToggle'
import { useLang } from './i18n/LanguageContext'

export default function App() {
  const [screen, setScreen] = useState('landing') // 'landing' | 'select' | 'catalog'
  const [catalogInitView, setCatalogInitView] = useState('list') // 'list' | 'map'
  const { fading, fadeMs } = useLang()

  function goList() { setCatalogInitView('list'); setScreen('catalog') }
  function goMap()  { setCatalogInitView('map');  setScreen('catalog') }

  return (
    <>
      {/* 언어 토글 — 페이드 대상 밖(항상 활성) */}
      <LangToggle />

      {/* 콘텐츠 크로스페이드 (언어 변경 시) — 합성 레이어 고정으로 글래스 blur 재계산/끊김 방지 */}
      <div style={{
        opacity: fading ? 0 : 1,
        transition: `opacity ${fadeMs}ms ease`,
        willChange: 'opacity',
      }}>
        {screen === 'catalog'
          ? <MakgeolliPage
              onBack={() => setScreen('select')}
              onHome={() => setScreen('landing')}
              initialView={catalogInitView}
            />
          : screen === 'select'
          ? <ViewSelect
              onList={goList}
              onMap={goMap}
              onBack={() => setScreen('landing')}
            />
          : <GyeboLanding onCatalog={() => setScreen('select')} />
        }
      </div>
    </>
  )
}
