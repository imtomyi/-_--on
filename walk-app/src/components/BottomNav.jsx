import styles from './BottomNav.module.css'

const tabs = [
  {
    id: 'home',
    label: '홈',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    id: 'map',
    label: '지도',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    id: 'course',
    label: '코스',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18.334C6.38071 18.334 7.5 17.2147 7.5 15.834C7.5 14.4533 6.38071 13.334 5 13.334C3.61929 13.334 2.5 14.4533 2.5 15.834C2.5 17.2147 3.61929 18.334 5 18.334Z"/>
        <path d="M7.5 15.8327H14.5833C15.3569 15.8327 16.0987 15.5254 16.6457 14.9784C17.1927 14.4314 17.5 13.6896 17.5 12.916C17.5 12.1425 17.1927 11.4006 16.6457 10.8536C16.0987 10.3066 15.3569 9.99935 14.5833 9.99935H5.41667C4.64312 9.99935 3.90125 9.69206 3.35427 9.14508C2.80729 8.5981 2.5 7.85623 2.5 7.08268C2.5 6.30913 2.80729 5.56727 3.35427 5.02029C3.90125 4.47331 4.64312 4.16602 5.41667 4.16602H12.5"/>
        <path d="M15 6.66602C16.3807 6.66602 17.5 5.54673 17.5 4.16602C17.5 2.7853 16.3807 1.66602 15 1.66602C13.6193 1.66602 12.5 2.7853 12.5 4.16602C12.5 5.54673 13.6193 6.66602 15 6.66602Z"/>
      </svg>
    ),
  },
  {
    id: 'me',
    label: '내 기록',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.8337 17.5V15.8333C15.8337 14.9493 15.4825 14.1014 14.8573 13.4763C14.2322 12.8512 13.3844 12.5 12.5003 12.5H7.50033C6.61627 12.5 5.76842 12.8512 5.1433 13.4763C4.51818 14.1014 4.16699 14.9493 4.16699 15.8333V17.5"/>
        <path d="M10.0003 9.16667C11.8413 9.16667 13.3337 7.67428 13.3337 5.83333C13.3337 3.99238 11.8413 2.5 10.0003 2.5C8.15938 2.5 6.66699 3.99238 6.66699 5.83333C6.66699 7.67428 8.15938 9.16667 10.0003 9.16667Z"/>
      </svg>
    ),
  },
]

export default function BottomNav({ active, onTab }) {
  return (
    <nav className={styles.nav}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.tabActive : ''}`}
          onClick={() => onTab(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
