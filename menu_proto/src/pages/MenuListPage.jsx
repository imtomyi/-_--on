import { useState, useEffect, useRef } from 'react';
import { makgeolliList } from '../data/makgeolli';
import styles from './MenuListPage.module.css';

export default function MenuListPage({ onNext }) {
  const [isReady, setIsReady] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    // 진입 시 리스트 올라오는 애니메이션을 위한 타이머
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleItemClick = (id, index) => {
    if (selectedId === id) {
      // 이미 선택된 항목을 다시 클릭하면 해제
      setSelectedId(null);
    } else {
      setSelectedId(id);
      
      // 스크롤 포커스 애니메이션 (화면 1/3 위치로)
      setTimeout(() => {
        if (listRef.current && itemRefs.current[index]) {
          const container = listRef.current;
          const item = itemRefs.current[index];
          const containerHeight = container.clientHeight;
          // 아이템이 화면의 약 1/3 지점(위쪽)에 오도록 스크롤 계산
          const targetScrollTop = item.offsetTop - (containerHeight / 3);
          
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  };

  return (
    <div className={`${styles.container} ${isReady ? styles.ready : ''}`}>
      <div className={styles.scrollContainer} ref={listRef}>
        <div className={styles.paddingTop} />
        
        {makgeolliList.map((item, index) => {
          const isSelected = selectedId === item.id;
          const isOtherSelected = selectedId !== null && selectedId !== item.id;
          
          return (
            <div 
              key={item.id}
              ref={el => itemRefs.current[index] = el}
              className={`${styles.itemWrapper} ${isSelected ? styles.selected : ''} ${isOtherSelected ? styles.dimmed : ''}`}
            >
              {/* 기본 메뉴 바 */}
              <div 
                className={styles.menuBar}
                onClick={() => handleItemClick(item.id, index)}
              >
                <div className={styles.menuNum}>
                  {item.id < 10 ? `0${item.id}` : item.id}
                </div>
                <div className={styles.menuInfo}>
                  <div className={styles.menuHeader}>
                    <h2 className={styles.menuName}>{item.name}</h2>
                    <span className={styles.menuDifficulty}>{item.difficulty}</span>
                  </div>
                  <div className={styles.menuSub}>{item.region} · {item.ingredient}</div>
                </div>
                <div className={styles.arrowIcon}>&gt;</div>
              </div>
              
              {/* 세부 내용 카드 (두루마리 효과) */}
              <div className={`${styles.detailCard} ${isSelected ? styles.open : ''}`}>
                <div className={styles.detailContent}>
                  <div className={styles.detailLeft}>
                    {/* 다음 페이지로 넘어가는 파동 버튼 (첫 페이지와 유사) */}
                    <button className={styles.rippleButton} onClick={(e) => {
                      e.stopPropagation();
                      onNext(e);
                    }}>
                      <div className={styles.pulseLayer}></div>
                      <span className={styles.btnText}>버튼</span>
                    </button>
                  </div>
                  <div className={styles.detailText}>
                    설명<br/>
                    (선택한 막걸리에 대한 상세한 이야기가 여기에 펼쳐집니다.)
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className={styles.paddingBottom} />
      </div>
    </div>
  );
}
