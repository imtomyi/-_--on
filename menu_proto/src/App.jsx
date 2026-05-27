import { useState } from 'react'
import CoverPage from './pages/CoverPage'
import MenuListPage from './pages/MenuListPage'
import ChartMapPage from './pages/ChartMapPage'
import RippleTransition from './components/RippleTransition'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('cover') // 'cover', 'menu', 'chart'
  const [transitioning, setTransitioning] = useState(false)
  const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 })
  const [nextPage, setNextPage] = useState(null)

  const handleNavigate = (targetPage, event) => {
    if (transitioning) return
    
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    
    if (event) {
      const root = document.getElementById('root');
      if (root) {
        const rect = root.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }
    }
    
    setRippleOrigin({ x, y })
    setNextPage(targetPage)
    setTransitioning(true)
    
    // 파동 애니메이션이 화면을 덮는 시간(약 800ms) 이후 페이지 교체
    setTimeout(() => {
      setCurrentPage(targetPage)
      // 페이지 교체 후 파동 레이어 서서히 사라짐
      setTimeout(() => {
        setTransitioning(false)
        setNextPage(null)
      }, 500)
    }, 800)
  }

  return (
    <>
      {currentPage === 'cover' && <CoverPage onNext={(e) => handleNavigate('menu', e)} />}
      {currentPage === 'menu' && <MenuListPage onNext={(e) => handleNavigate('chart', e)} />}
      {currentPage === 'chart' && <ChartMapPage onNext={(e) => handleNavigate('cover', e)} />}
      
      {transitioning && (
        <RippleTransition origin={rippleOrigin} isFadingOut={!!nextPage && currentPage === nextPage} />
      )}
    </>
  )
}

export default App
