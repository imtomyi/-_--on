import { useState, useEffect } from 'react';
import { makgeolliList } from '../data/makgeolli';
import styles from './ChartMapPage.module.css';

// 임의의 좌표 설정 (x, y 퍼센티지: 0~100)
const chartData = [
  { id: 1, x: 60, y: 30, mapX: 45, mapY: 30 }, // 양평
  { id: 2, x: 85, y: 30, mapX: 70, mapY: 45 }, // 청송
  { id: 3, x: 85, y: 45, mapX: 40, mapY: 55 }, // 공주
  { id: 4, x: 45, y: 30, mapX: 35, mapY: 85 }, // 고흥
  { id: 5, x: 20, y: 20, mapX: 60, mapY: 45 }, // 문경
  { id: 6, x: 35, y: 55, mapX: 55, mapY: 35 }, // 단양
  { id: 7, x: 35, y: 45, mapX: 50, mapY: 50 }, // 미확인
  { id: 8, x: 15, y: 55, mapX: 30, mapY: 65 }, // 앉은뱅이
  { id: 9, x: 45, y: 70, mapX: 25, mapY: 85 }, // 해남
  { id: 10, x: 25, y: 70, mapX: 25, mapY: 85 } // 해남
];

export default function ChartMapPage({ onNext }) {
  const [isReady, setIsReady] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null); // id 저장
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeClick = (id) => {
    setSelectedNode(id);
    
    // 차트 페이드아웃 후 맵 등장 애니메이션 시작
    setTimeout(() => {
      setShowMap(true);
      playSound();
    }, 500);
  };

  const playSound = () => {
    // 임시 고양이 소리 (웹 오디오 API 기본 톤으로 대체하거나 더미 오디오 객체 사용)
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 고양이 톤 흉내
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio playback failed', e);
    }
  };

  const selectedData = chartData.find(d => d.id === selectedNode);

  return (
    <div className={`${styles.container} ${isReady ? styles.ready : ''}`}>
      
      {/* 배경 백색 지도 (숨겨져 있다가 나타남) */}
      <div className={`${styles.mapLayer} ${showMap ? styles.mapActive : ''}`}>
        <div className={styles.mapSvgContainer}>
          {/* 단순화된 한국 지도 모양 SVG 플레이스홀더 */}
          <svg viewBox="0 0 100 100" className={styles.koreaMap}>
            <path d="M40,10 L60,15 L70,30 L65,50 L70,70 L50,90 L30,85 L25,60 L20,40 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <path d="M10,80 L15,75 L20,85 Z" fill="rgba(255,255,255,0.1)" /> {/* 제주도 */}
          </svg>

          {/* 원산지 마커 (지도 확대 시 나타남) */}
          {showMap && selectedData && (
            <div 
              className={styles.mapMarker}
              style={{ left: `${selectedData.mapX}%`, top: `${selectedData.mapY}%` }}
            >
              <div className={styles.ping} />
              <div className={styles.markerDot} />
            </div>
          )}
        </div>
        
        {/* 설명 패널 */}
        {showMap && selectedData && (
          <div className={styles.storyPanel}>
            <h3>{makgeolliList.find(m => m.id === selectedData.id)?.name}</h3>
            <p>{makgeolliList.find(m => m.id === selectedData.id)?.region}</p>
            <button className={styles.backBtn} onClick={onNext}>처음으로</button>
          </div>
        )}
      </div>

      {/* 차트 영역 (선택 시 사라짐) */}
      <div className={`${styles.chartArea} ${selectedNode ? styles.hidden : ''}`}>
        <div className={styles.chartWrapper}>
          <div className={styles.chartBg}>
            {/* 축 및 라벨 */}
            <div className={styles.axisX} />
            <div className={styles.axisY} />
            <span className={styles.labelTop}>가볍다</span>
            <span className={styles.labelBottom}>묵직</span>
            <span className={styles.labelLeft}>달다</span>
            <span className={styles.labelRight}>드라이</span>
            
            {/* 노드들 */}
            {chartData.map(node => (
              <button
                key={node.id}
                className={styles.nodeBtn}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => handleNodeClick(node.id)}
              >
                {node.id}
              </button>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
