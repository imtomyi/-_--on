import { useState, useCallback } from 'react'
import Onboarding from './components/Onboarding'
import Home from './components/Home'
import CourseDetail from './components/CourseDetail'
import { courses } from './data/courses'

// URL 쿼리 파라미터로 화면 직접 접근 지원 (?screen=home, ?screen=detail&course=loop1)
function getInitialScreen() {
  const params = new URLSearchParams(window.location.search)
  const s = params.get('screen')
  if (s === 'home' || s === 'detail' || s === 'onboarding') return s
  return 'onboarding'
}

function getInitialCourse() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('course')
  if (id) return courses.find(c => c.id === id) ?? courses[0]
  return courses[0]
}

// screen: 'onboarding' | 'home' | 'detail'
export default function App() {
  const [screen, setScreen] = useState(getInitialScreen)
  const [prevScreen, setPrevScreen] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(getInitialCourse)
  const [transitioning, setTransitioning] = useState(false)
  const [isBack, setIsBack] = useState(false)

  const navigate = useCallback((to, course = null, back = false) => {
    if (transitioning) return
    setPrevScreen(screen)
    setTransitioning(true)
    setIsBack(back)
    if (course) setSelectedCourse(course)
    setScreen(to)
    setTimeout(() => {
      setPrevScreen(null)
      setTransitioning(false)
    }, 320)
  }, [screen, transitioning])

  function renderScreen(s) {
    if (s === 'onboarding') return <Onboarding onStart={() => navigate('home')} />
    if (s === 'home')       return <Home onSelect={(c) => navigate('detail', c)} />
    return                         <CourseDetail course={selectedCourse} onBack={() => navigate('home', null, true)} />
  }

  const enterClass = isBack ? 'enterBack' : 'enter'
  const exitClass  = isBack ? 'exitBack'  : 'exit'

  return (
    <>
      {transitioning && prevScreen && (
        <div className={`screenWrapper ${exitClass}`}>
          {renderScreen(prevScreen)}
        </div>
      )}
      <div key={screen} className={`screenWrapper${transitioning ? ` ${enterClass}` : ''}`}>
        {renderScreen(screen)}
      </div>
    </>
  )
}
