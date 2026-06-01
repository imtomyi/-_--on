import { useState } from 'react'
import GyeboLanding from './components/GyeboLanding'
import MakgeolliPage from './components/MakgeolliPage'

export default function App() {
  const [screen, setScreen] = useState('landing') // 'landing' | 'catalog'
  if (screen === 'catalog') return <MakgeolliPage onBack={() => setScreen('landing')} />
  return <GyeboLanding onCatalog={() => setScreen('catalog')} />
}
