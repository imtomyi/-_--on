import { courses } from '../data/courses'
import styles from './CourseSelect.module.css'

const characterAccent = {
  'nuruk-green': 'var(--jade)',
  'nuruk-gold':  'var(--gold)',
  'nuruk-plum':  'var(--plum)',
}

const courseEmoji = {
  'nuruk-green': '🎨',
  'nuruk-gold':  '🏯',
  'nuruk-plum':  '🍜',
}

export default function CourseSelect({ onSelect }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>행궁동 막걸리 산책</p>
        <h1 className={styles.title}>어떤 코스로<br />걸을까요?</h1>
        <p className={styles.sub}>모든 코스는 막걸리 계보에서 시작하거나 끝납니다</p>
      </header>

      <ul className={styles.list}>
        {courses.map((course) => {
          const accent = characterAccent[course.character] ?? 'var(--jade)'
          const emoji  = courseEmoji[course.character] ?? '🗺️'
          return (
            <li key={course.id}>
              <button
                className={styles.card}
                style={{ '--accent': accent }}
                onClick={() => onSelect(course)}
              >
                <div className={styles.accentBar} />
                <div className={styles.iconWrap} aria-hidden="true">
                  {emoji}
                </div>
                <div className={styles.info}>
                  <div className={styles.meta}>
                    <span className={styles.badge}>{course.duration}</span>
                    <span className={styles.badge}>{course.distance}</span>
                  </div>
                  <h2 className={styles.name}>{course.title}</h2>
                  <p className={styles.subtitle}>{course.subtitle}</p>
                  <p className={styles.desc}>{course.description}</p>
                </div>
                <span className={styles.chevron} aria-hidden="true">›</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
