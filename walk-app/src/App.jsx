import { useState, useCallback, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Home from './components/Home'
import CourseDetail from './components/CourseDetail'
import { courses } from './data/courses'

// pathname → screen 이름
function pathToScreen(path) {
  if (path === '/home')   return 'home'
  if (path === '/detail') return 'detail'
  return 'onboarding'
}

// screen 이름 → pathname
function screenToPath(screen) {
  if (screen === 'home')   return '/home'
  if (screen === 'detail') return '/detail'
  return '/onboarding'
}

function getInitialScreen() {
  return pathToScreen(window.location.pathname)
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

  const navigate = useCallback((to, course = null, back = false, skipPush = false) => {
    if (transitioning) return
    setPrevScreen(screen)
    setTransitioning(true)
    setIsBack(back)
    if (course) setSelectedCourse(course)
    setScreen(to)

    // URL 동기화
    if (!skipPush) {
      const path = screenToPath(to)
      const url = course ? `${path}?course=${course.id}` : path
      if (back) {
        window.history.replaceState({ screen: to }, '', url)
      } else {
        window.history.pushState({ screen: to }, '', url)
      }
    }

    setTimeout(() => {
      setPrevScreen(null)
      setTransitioning(false)
    }, 320)
  }, [screen, transitioning])

  // 브라우저 뒤로가기/앞으로가기 대응
  useEffect(() => {
    const handlePop = () => {
      const to = pathToScreen(window.location.pathname)
      navigate(to, null, true, true /* skipPush */)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [navigate])

  // 초기 진입 시 URL을 명시적 경로로 교체 (/ → /onboarding)
  useEffect(() => {
    const current = window.location.pathname
    if (current === '/' || current === '') {
      window.history.replaceState({ screen: 'onboarding' }, '', '/onboarding')
    }
  }, [])

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
