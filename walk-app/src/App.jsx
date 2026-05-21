import { useState } from 'react'
import Onboarding from './components/Onboarding'
import CourseSelect from './components/CourseSelect'
import CourseDetail from './components/CourseDetail'

// screen: 'onboarding' | 'select' | 'detail'
export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [selectedCourse, setSelectedCourse] = useState(null)

  if (screen === 'onboarding') {
    return <Onboarding onStart={() => setScreen('select')} />
  }

  if (screen === 'select') {
    return (
      <CourseSelect
        onSelect={(course) => {
          setSelectedCourse(course)
          setScreen('detail')
        }}
      />
    )
  }

  return (
    <CourseDetail
      course={selectedCourse}
      onBack={() => setScreen('select')}
    />
  )
}
