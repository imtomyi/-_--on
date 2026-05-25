import { courses } from '../data/courses'
import styles from './Home.module.css'

const characterAccent = {
  'nuruk-green': 'var(--jade)',
  'nuruk-gold':  'var(--gold)',
  'nuruk-plum':  'var(--azalea)',
}

export default function Home({ onSelect }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.topBarLabel}>코스 선택</span>
          <h1 className={styles.topBarTitle}>어떤 코스로 걸을까요?</h1>
        </div>
        <span className={styles.topBarCount}>{courses.length}</span>
      </header>

      <div className={styles.hairlineGold} />

      <ul className={styles.list}>
        {courses.map((course, idx) => {
          const accent = characterAccent[course.character] ?? 'var(--jade)'
          return (
            <li key={course.id}>
              <button
                className={styles.item}
                style={{ '--accent': accent }}
                onClick={() => onSelect(course)}
              >
                <span className={styles.num}>{String(idx + 1).padStart(2, '0')}</span>
                <span className={styles.itemSub}>{course.ko.subtitle}</span>
                <h2 className={styles.itemTitle}>{course.ko.title}</h2>
                <p className={styles.itemDesc}>{course.ko.description}</p>
                <div className={styles.itemMeta}>
                  <span>{course.ko.duration}</span>
                  <span className={styles.metaSep}>·</span>
                  <span>{course.distance}</span>
                  <span className={styles.metaSep}>·</span>
                  <span>정점 {course.places.length}</span>
                </div>
                <span className={styles.itemArrow} aria-hidden="true">→</span>
              </button>
            </li>
          )
        })}
      </ul>
      </div>
    </div>
  )
}
