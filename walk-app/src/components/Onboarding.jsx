import styles from './Onboarding.module.css'

export default function Onboarding({ onStart }) {
  return (
    <div className={styles.wrap}>

      {/* 팔달문 상세 일러스트 */}
      <div className={styles.gate} aria-hidden="true">
        <svg viewBox="0 -24 280 278" fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* ══ 그림자 ══ */}
          <ellipse cx="140" cy="252" rx="122" ry="5" fill="#1A1008" fillOpacity="0.1"/>

          {/* ══ 석축 기단 ══ */}
          <rect x="5" y="138" width="270" height="114" fill="#C4A870"/>
          <rect x="5" y="138" width="270" height="4" fill="#D8BC88" fillOpacity="0.55"/>
          <rect x="5" y="245" width="270" height="7" fill="#9A7E52" fillOpacity="0.3"/>

          {/* 수평 줄눈 */}
          {[155,172,190,207,225,242].map(y => (
            <line key={y} x1="5" y1={y} x2="275" y2={y} stroke="#9A7E52" strokeWidth="0.9" strokeOpacity="0.42"/>
          ))}
          {/* 수직 줄눈 — 엇갈린 벽돌 패턴 */}
          {[45,95,185,235].map(x=>(
            <line key={`a${x}`} x1={x} y1={138} x2={x} y2={155} stroke="#9A7E52" strokeWidth="0.9" strokeOpacity="0.38"/>
          ))}
          {[22,68,212,258].map(x=>(
            <line key={`b${x}`} x1={x} y1={155} x2={x} y2={172} stroke="#9A7E52" strokeWidth="0.9" strokeOpacity="0.38"/>
          ))}
          {[45,95,185,235].map(x=>(
            <line key={`c${x}`} x1={x} y1={172} x2={x} y2={190} stroke="#9A7E52" strokeWidth="0.9" strokeOpacity="0.38"/>
          ))}
          {[22,68,212,258].map(x=>(
            <line key={`d${x}`} x1={x} y1={190} x2={x} y2={207} stroke="#9A7E52" strokeWidth="0.9" strokeOpacity="0.38"/>
          ))}
          {[45,95,122,158,185,235].map(x=>(
            <line key={`e${x}`} x1={x} y1={207} x2={x} y2={225} stroke="#9A7E52" strokeWidth="0.9" strokeOpacity="0.38"/>
          ))}
          {[22,68,212,258].map(x=>(
            <line key={`f${x}`} x1={x} y1={225} x2={x} y2={245} stroke="#9A7E52" strokeWidth="0.9" strokeOpacity="0.38"/>
          ))}

          {/* ══ 홍예문 (아치 게이트) ══ */}
          {/* 내부 어둠 */}
          <path d="M114 252 L114 228 Q140 202 166 228 L166 252 Z" fill="#120C06"/>
          {/* 홍예석 프레임 */}
          <path d="M110 252 L110 228 Q140 198 170 228 L170 252 L166 252 L166 229 Q140 204 114 229 L114 252 Z"
                fill="#B89A68" stroke="#8A6E48" strokeWidth="1"/>
          {/* 쐐기돌 분할선 */}
          <line x1="114" y1="229" x2="124" y2="210" stroke="#8A6E48" strokeWidth="0.9" strokeOpacity="0.7"/>
          <line x1="124" y1="210" x2="133" y2="202" stroke="#8A6E48" strokeWidth="0.9" strokeOpacity="0.7"/>
          <line x1="166" y1="229" x2="156" y2="210" stroke="#8A6E48" strokeWidth="0.9" strokeOpacity="0.7"/>
          <line x1="156" y1="210" x2="147" y2="202" stroke="#8A6E48" strokeWidth="0.9" strokeOpacity="0.7"/>
          {/* 이맛돌 (keystone) */}
          <path d="M131 200 L149 200 L151 214 L129 214 Z" fill="#C4A870" stroke="#9A7E52" strokeWidth="0.9"/>
          <path d="M134 201 L146 201 L147 208 L133 208 Z" fill="#D4B880" fillOpacity="0.45"/>

          {/* ══ 좌우 소홍예 ══ */}
          {/* 왼쪽 */}
          <path d="M31 200 L31 180 Q49 166 67 180 L67 200 Z" fill="#120C06" fillOpacity="0.55"/>
          <path d="M29 202 L29 180 Q49 163 69 180 L69 202 L67 202 L67 181 Q49 167 31 181 L31 202 Z"
                fill="#B89A68" stroke="#8A6E48" strokeWidth="0.7"/>
          {/* 오른쪽 */}
          <path d="M213 200 L213 180 Q231 166 249 180 L249 200 Z" fill="#120C06" fillOpacity="0.55"/>
          <path d="M211 202 L211 180 Q231 163 251 180 L251 202 L249 202 L249 181 Q231 167 213 181 L213 202 Z"
                fill="#B89A68" stroke="#8A6E48" strokeWidth="0.7"/>

          {/* ══ 기단부 (문루 받침) ══ */}
          <rect x="44" y="120" width="192" height="20" fill="#7A4E28"/>
          <rect x="44" y="120" width="192" height="4" fill="#9A6E48" fillOpacity="0.5"/>
          <rect x="44" y="136" width="192" height="4" fill="#5A3818" fillOpacity="0.5"/>
          <line x1="48" y1="124" x2="232" y2="124" stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.35"/>

          {/* ══ 1층 문루 벽체 ══ */}
          <rect x="58" y="86" width="164" height="34" fill="#8A5A2E"/>
          <line x1="58" y1="97" x2="222" y2="97" stroke="#6A3E1C" strokeWidth="0.8" strokeOpacity="0.38"/>
          <line x1="58" y1="108" x2="222" y2="108" stroke="#6A3E1C" strokeWidth="0.8" strokeOpacity="0.38"/>
          <line x1="58" y1="116" x2="222" y2="116" stroke="#6A3E1C" strokeWidth="0.8" strokeOpacity="0.38"/>

          {/* 창호 (격자창 3개) */}
          {[72,130,188].map(wx=>(
            <g key={wx}>
              <rect x={wx} y={89} width={20} height={20} rx="1" fill="#1A1008" fillOpacity="0.4"/>
              <line x1={wx+6}  y1={89} x2={wx+6}  y2={109} stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.5"/>
              <line x1={wx+13} y1={89} x2={wx+13} y2={109} stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.5"/>
              <line x1={wx}    y1={96} x2={wx+20}  y2={96}  stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.5"/>
              <line x1={wx}    y1={103} x2={wx+20} y2={103} stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.5"/>
            </g>
          ))}

          {/* 기둥 */}
          {[58,82,112,168,198,216].map(cx=>(
            <rect key={cx} x={cx} y={86} width={6} height={34} fill="#6A3C1C"/>
          ))}

          {/* ══ 공포 / 창방 ══ */}
          <rect x="56" y="78" width="168" height="10" fill="#8A6236"/>
          {[56,80,110,166,196,214].map(cx=>(
            <g key={cx}>
              <rect x={cx-1} y={70} width={10} height={9} fill="#9A7244"/>
              <rect x={cx-3} y={74} width={14} height={5} fill="#B08250"/>
              <rect x={cx+1} y={66} width={6} height={5} fill="#8A6236"/>
            </g>
          ))}
          <rect x="53" y="64" width="174" height="3" fill="#7A5226" fillOpacity="0.5"/>

          {/* ══ 1층 지붕 ══ */}
          {/* 지붕면 */}
          <path d="M10 64 Q26 51 65 57 L140 30 L215 57 Q254 51 270 64 L270 71 L10 71 Z" fill="#3C3C46"/>
          {/* 처마 밑면 */}
          <path d="M10 64 Q26 51 65 57 L140 30 L215 57 Q254 51 270 64" stroke="#7A5636" strokeWidth="4.5" fill="none"/>
          {/* 기와 가장자리 */}
          <path d="M10 64 Q26 51 65 57 L140 30 L215 57 Q254 51 270 64" stroke="#58585E" strokeWidth="1.5" fill="none" strokeOpacity="0.45"/>
          {/* 기와골 선 */}
          {[[140,30,105,64],[140,30,120,64],[140,30,155,64],[140,30,170,64],
            [140,30,86,64],[140,30,192,64]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2C2C34" strokeWidth="0.9" strokeOpacity="0.48"/>
          ))}
          {/* 용마루 */}
          <rect x="77" y="26" width="126" height="8" rx="4" fill="#2C2C34"/>
          <rect x="77" y="26" width="126" height="3" rx="1.5" fill="#4E4E58" fillOpacity="0.5"/>
          {/* 수막새 (원형 기와) */}
          {[92,108,124,140,156,172,188].map(x=>(
            <circle key={x} cx={x} cy={32} r="2.8" fill="#3C3C46" stroke="#5A5A64" strokeWidth="0.5"/>
          ))}
          {/* 치미 왼쪽 */}
          <path d="M75 34 Q65 30 73 21" stroke="#2C2C34" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M73 21 Q77 15 82 20" stroke="#3C3C46" strokeWidth="2.5" fill="none"/>
          <circle cx="73" cy="20" r="3.5" fill="#2C2C34"/>
          <circle cx="73" cy="20" r="1.8" fill="var(--gold)" fillOpacity="0.75"/>
          {/* 치미 오른쪽 */}
          <path d="M205 34 Q215 30 207 21" stroke="#2C2C34" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M207 21 Q203 15 198 20" stroke="#3C3C46" strokeWidth="2.5" fill="none"/>
          <circle cx="207" cy="20" r="3.5" fill="#2C2C34"/>
          <circle cx="207" cy="20" r="1.8" fill="var(--gold)" fillOpacity="0.75"/>
          {/* 처마 끝 반곡 */}
          <path d="M10 64 Q2 61 -1 53" stroke="#7A5636" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M270 64 Q278 61 281 53" stroke="#7A5636" strokeWidth="4" strokeLinecap="round" fill="none"/>

          {/* ══ 2층 문루 ══ */}
          <rect x="88" y="12" width="104" height="26" fill="#8A5A2E"/>
          <line x1="88" y1="20" x2="192" y2="20" stroke="#6A3E1C" strokeWidth="0.8" strokeOpacity="0.38"/>
          <line x1="88" y1="28" x2="192" y2="28" stroke="#6A3E1C" strokeWidth="0.8" strokeOpacity="0.38"/>
          {/* 2층 창호 */}
          {[106,154].map(wx=>(
            <g key={wx}>
              <rect x={wx} y={15} width={20} height={16} rx="1" fill="#1A1008" fillOpacity="0.4"/>
              <line x1={wx+6}  y1={15} x2={wx+6}  y2={31} stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.5"/>
              <line x1={wx+13} y1={15} x2={wx+13} y2={31} stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.5"/>
              <line x1={wx}    y1={23} x2={wx+20}  y2={23} stroke="#9A7050" strokeWidth="0.7" strokeOpacity="0.5"/>
            </g>
          ))}
          {[88,105,140,175,192].map(cx=>(
            <rect key={cx} x={cx} y={12} width={5} height={26} fill="#6A3C1C"/>
          ))}
          {/* 2층 공포 */}
          <rect x="86" y="6" width="108" height="8" fill="#8A6236"/>
          {[86,103,138,173,190].map(cx=>(
            <g key={cx}>
              <rect x={cx-1} y={1} width={9} height={6} fill="#9A7244"/>
              <rect x={cx-3} y={4} width={13} height={4} fill="#A87E4A"/>
            </g>
          ))}

          {/* ══ 2층 지붕 ══ */}
          <path d="M60 6 Q75 0 96 2 L140 -16 L184 2 Q205 0 220 6 L220 13 L60 13 Z" fill="#3C3C46"/>
          <path d="M60 6 Q75 0 96 2 L140 -16 L184 2 Q205 0 220 6" stroke="#7A5636" strokeWidth="3.5" fill="none"/>
          <path d="M60 6 Q75 0 96 2 L140 -16 L184 2 Q205 0 220 6" stroke="#58585E" strokeWidth="1.2" fill="none" strokeOpacity="0.45"/>
          {[[140,-16,120,6],[140,-16,160,6]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2C2C34" strokeWidth="0.8" strokeOpacity="0.45"/>
          ))}
          {/* 2층 용마루 */}
          <rect x="111" y="-19" width="58" height="7" rx="3.5" fill="#2C2C34"/>
          <rect x="111" y="-19" width="58" height="2.5" rx="1" fill="#4E4E58" fillOpacity="0.5"/>
          {[122,134,140,146,158].map(x=>(
            <circle key={x} cx={x} cy={-14} r="2" fill="#3C3C46" stroke="#5A5A64" strokeWidth="0.5"/>
          ))}
          {/* 2층 치미 */}
          <path d="M109 -12 Q100 -16 107 -22" stroke="#2C2C34" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <circle cx="107" cy="-23" r="3" fill="#2C2C34"/>
          <circle cx="107" cy="-23" r="1.5" fill="var(--gold)" fillOpacity="0.75"/>
          <path d="M171 -12 Q180 -16 173 -22" stroke="#2C2C34" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <circle cx="173" cy="-23" r="3" fill="#2C2C34"/>
          <circle cx="173" cy="-23" r="1.5" fill="var(--gold)" fillOpacity="0.75"/>
          {/* 2층 처마 끝 반곡 */}
          <path d="M60 6 Q52 3 49 -4" stroke="#7A5636" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M220 6 Q228 3 231 -4" stroke="#7A5636" strokeWidth="3.5" strokeLinecap="round" fill="none"/>

        </svg>
      </div>

      {/* 누룩 캐릭터 플레이스홀더 — 디자이너 납품 후 교체 */}
      <div className={styles.character} aria-label="누룩 캐릭터">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="38" fill="var(--azalea-lt)" stroke="var(--azalea)" strokeWidth="2"/>
          <circle cx="48" cy="58" r="5" fill="var(--ink)" fillOpacity="0.7"/>
          <circle cx="72" cy="58" r="5" fill="var(--ink)" fillOpacity="0.7"/>
          <path d="M48 78 Q60 88 72 78" stroke="var(--ink)" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="30" cy="45" r="4" fill="var(--azalea)" fillOpacity="0.5"/>
          <circle cx="95" cy="50" r="3" fill="var(--azalea)" fillOpacity="0.4"/>
          <circle cx="85" cy="30" r="2.5" fill="var(--azalea)" fillOpacity="0.3"/>
          <path d="M22 85 Q30 75 40 80 L38 100 Q28 98 22 85Z" fill="var(--jade)" fillOpacity="0.5"/>
          <path d="M98 85 Q90 75 80 80 L82 100 Q92 98 98 85Z" fill="var(--jade)" fillOpacity="0.5"/>
        </svg>
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>수원 행궁동</p>
        <h1 className={styles.title}>막걸리 한 잔 들고,<br />골목을 걷다</h1>
        <div className={styles.divider} />
        <p className={styles.sub}>막걸리 계보의 테이크아웃과 함께<br />공방거리를 산책하는 코스 가이드</p>
      </div>

      <button className={styles.cta} onClick={onStart}>
        산책 시작하기
        <span className={styles.arrow}>→</span>
      </button>
    </div>
  )
}
