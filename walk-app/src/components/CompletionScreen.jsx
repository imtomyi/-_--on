import BottomNav from './BottomNav'
import styles from './CompletionScreen.module.css'

const placeTypeLabel = {
  start: '출발', end: '도착', craft: '공방', landmark: '명소', food: '맛집'
}

export default function CompletionScreen({ course, onOtherCourse, onTab }) {
  const distNum  = course.distance.replace(/[^0-9.]/g, '')
  const distUnit = course.distance.replace(/[0-9.]/g, '')
  const durNum   = course.ko.duration.replace(/[^0-9]/g, '')
  const kcal     = (course.places.length * 285).toLocaleString()

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        {/* 완료 아이콘 */}
        <div className={styles.checkCircle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h1 className={styles.heading}>산책 완료!</h1>
        <p className={styles.subheading}>{course.ko.title}</p>

        {/* 방문한 거점 */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>방문한 거점</p>

          {/* 원 + 다선 행 */}
          <div className={styles.tlCircleRow}>
            {course.places.map((place, i) => (
              <div key={place.id} className={styles.tlCircle}>
                {i === 0 && <div className={styles.tlInnerDot} />}
              </div>
            ))}
          </div>

          {/* 이름 + 배지 행 */}
          <div className={styles.tlLabelRow}>
            {course.places.map((place) => (
              <div key={place.id} className={styles.tlLabelCol}>
                <span className={styles.tlName}>{place.ko.name}</span>
                <span className={`${styles.tlBadge} ${styles['badge_' + place.type]}`}>
                  {placeTypeLabel[place.type]}
                </span>
              </div>
            ))}
          </div>

          {/* 진행 바 */}
          <div className={styles.progressRow}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} />
            </div>
            <span className={styles.countText}>{course.places.length} / {course.places.length}</span>
          </div>
        </div>

        {/* 통계 그리드 */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValRow}>
              <span className={styles.statVal}>{distNum}</span>
              <span className={styles.statUnit}>{distUnit}</span>
            </div>
            <span className={styles.statLabel}>거리</span>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValRow}>
              <span className={styles.statVal}>{durNum}</span>
              <span className={styles.statUnit}>분</span>
            </div>
            <span className={styles.statLabel}>소요시간</span>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValRow}>
              <span className={styles.statVal}>{course.places.length}</span>
              <span className={styles.statUnit}>곳</span>
            </div>
            <span className={styles.statLabel}>방문 거점</span>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValRow}>
              <span className={styles.statVal}>{kcal}</span>
              <span className={styles.statUnit}>kcal</span>
            </div>
            <span className={styles.statLabel}>소모 칼로리</span>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className={styles.btnGroup}>
          <button className={styles.grayBtn} onClick={onOtherCourse}>
            다른 코스 보기
          </button>
          <button className={styles.primaryBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <g clipPath="url(#clip0_832_489)">
                <path d="M11.25 5C12.2855 5 13.125 4.16053 13.125 3.125C13.125 2.08947 12.2855 1.25 11.25 1.25C10.2145 1.25 9.375 2.08947 9.375 3.125C9.375 4.16053 10.2145 5 11.25 5Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.75 9.375C4.78553 9.375 5.625 8.53553 5.625 7.5C5.625 6.46447 4.78553 5.625 3.75 5.625C2.71447 5.625 1.875 6.46447 1.875 7.5C1.875 8.53553 2.71447 9.375 3.75 9.375Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.25 13.75C12.2855 13.75 13.125 12.9105 13.125 11.875C13.125 10.8395 12.2855 10 11.25 10C10.2145 10 9.375 10.8395 9.375 11.875C9.375 12.9105 10.2145 13.75 11.25 13.75Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.36914 8.44336L9.63789 10.9309" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.63164 4.06836L5.36914 6.55586" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_832_489">
                  <rect width="15" height="15" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            기록 공유하기
          </button>
        </div>

      </div>
      <BottomNav active="me" onTab={onTab} />
    </div>
  )
}
