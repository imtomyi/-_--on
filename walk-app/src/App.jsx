import { useState, useCallback, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Home from './components/Home'
import CourseDetail from './components/CourseDetail'
import WalkScreen from './components/WalkScreen'
import CompletionScreen from './components/CompletionScreen'
import MapScreen from './components/MapScreen'
import { courses } from './data/courses'

// pathname → screen 이름
function pathToScreen(path) {
  if (path === '/home')       return 'home'
  if (path === '/map')        return 'map'
  if (path === '/detail')     return 'detail'
  if (path === '/walk')       return 'walk'
  if (path === '/complete')   return 'complete'
  return 'onboarding'
}

function screenToPath(screen) {
  if (screen === 'home')      return '/home'
  if (screen === 'map')       return '/map'
  if (screen === 'detail')    return '/detail'
  if (screen === 'walk')      return '/walk'
  if (screen === 'complete')  return '/complete'
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

// screen: 'onboarding' | 'home' | 'map' | 'detail' | 'walk' | 'complete'
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

  useEffect(() => {
    const handlePop = () => {
      const to = pathToScreen(window.location.pathname)
      navigate(to, null, true, true)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [navigate])

  useEffect(() => {
    const current = window.location.pathname
    if (current === '/' || current === '') {
      window.history.replaceState({ screen: 'onboarding' }, '', '/onboarding')
    }
  }, [])

  const handleTab = useCallback((tab) => {
    if (tab === 'home' || tab === 'course') navigate('home')
    else if (tab === 'map') navigate('map')
    else if (tab === 'me') {}  // 프로필 미구현
  }, [navigate])

  function renderScreen(s) {
    if (s === 'onboarding') return (
      <Onboarding onStart={() => navigate('home')} />
    )
    if (s === 'home') return (
      <Home
        onSelect={(c) => navigate('detail', c)}
        onTab={handleTab}
      />
    )
    if (s === 'map') return (
      <MapScreen
        onSelectCourse={(c) => navigate('detail', c)}
        onTab={handleTab}
      />
    )
    if (s === 'detail') return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => navigate('home', null, true)}
        onStartWalk={() => navigate('walk')}
        onTab={handleTab}
      />
    )
    if (s === 'walk') return (
      <WalkScreen
        course={selectedCourse}
        onComplete={() => navigate('complete')}
        onTab={handleTab}
      />
    )
    if (s === 'complete') return (
      <CompletionScreen
        course={selectedCourse}
        onOtherCourse={() => navigate('home', null, true)}
        onTab={handleTab}
      />
    )
    return null
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
