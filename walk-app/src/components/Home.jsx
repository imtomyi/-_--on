import { courses } from '../data/courses'
import BottomNav from './BottomNav'
import styles from './Home.module.css'
import logoImg from '../assets/logo.png'

const placeTypeLabel = { start: '출발', end: '도착', craft: '공방', landmark: '명소', food: '맛집' }

export default function Home({ onSelect, onTab }) {
  const [first, ...rest] = courses

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        {/* ── 히어로 헤더 ─────────────────────── */}
        <div className={styles.heroArea}>
          {/* 막걸리계보 로고 */}
          <img src={logoImg} alt="막걸리계보" className={styles.charImg} />
          <p className={styles.caption}>막걸리 한 잔 들고,</p>
          <h1 className={styles.heroTitle}>
            공방거리를<br/>
            <span className={styles.heroRed}>걷다</span>
          </h1>
        </div>

        {/* ── 액션 버튼 영역 ──────────────────── */}
        <div className={styles.actionArea}>
          {/* 이어서 걷기 (resume card) */}
          <div className={styles.resumeCard} onClick={() => onSelect(first)}>
            <div className={styles.resumeTop}>
              <span className={styles.resumeTag}>이어서 걷기</span>
              <p className={styles.resumeName}>{first.ko.title}</p>
            </div>
            <div className={styles.resumeBottom}>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '50%' }} />
              </div>
              <span className={styles.progressText}>2 / {first.places.length} 거점</span>
            </div>
          </div>

          {/* 산책 시작하기 */}
          <button className={styles.startBtn} onClick={() => onSelect(first)}>
            산책 시작하기
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M4 10h12M12 6l4 4-4 4"/>
            </svg>
          </button>
        </div>

        {/* ── 추천 코스 ───────────────────────── */}
        <div className={styles.courseSection}>
          <p className={styles.sectionLabel}>추천 코스</p>
          <div className={styles.courseList}>
            {courses.map(course => (
              <button key={course.id} className={styles.courseCard} onClick={() => onSelect(course)}>
                <div className={styles.courseInfo}>
                  <p className={styles.courseEyebrow}>{course.ko.subtitle}</p>
                  <p className={styles.courseName}>{course.ko.title}</p>
                  <p className={styles.courseDesc} style={{ WebkitLineClamp: 2 }}>{course.ko.description}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.metaPill}>{course.ko.duration}</span>
                    <span className={styles.metaPill}>{course.distance}</span>
                    <span className={styles.metaPill}>거점 {course.places.length}</span>
                  </div>
                </div>
                <div className={styles.courseImg}>
                  <span className={styles.courseImgLabel}>이미지</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.navSpacer} />
      </div>

      <BottomNav active="home" onTab={onTab} />
    </div>
  )
}
