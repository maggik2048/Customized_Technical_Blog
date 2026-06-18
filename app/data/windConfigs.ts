// app/data/windConfigs.ts
import * as THREE from 'three';

export interface WindConfig {
  id: string;
  name: string;
  description: string;
  
  // 바람 기본 파라미터
  windStrength: number;          // 기본 강도
  windDirection: THREE.Vector3;   // 기본 방향
  
  // 바람 변화 파라미터
  turbulence: number;            // 난기류 강도 (0~1)
  directionChangeSpeed: number;  // 방향 변화 속도
  strengthVariation: number;     // 강도 변화 폭 (0~1)
  
  // 종이 반응 파라미터
  paperStiffness: number;        // 종이 강성 (0~1)
  paperDamping: number;          // 종이 감쇠 (0~1)
  edgeWeight: number;           // 가장자리 가중치 (0~1)
  
  // 애니메이션 파라미터
  flipDuration: number;          // 넘김 시간 (ms)
  wobbleIntensity: number;       // 흔들림 강도 (0~1)
}

// 🔥 기본 바람 설정
export const windConfigs: Record<string, WindConfig> = {
  // 1. 부드러운 바람 (책 넘김용)
  gentleBreeze: {
    id: 'gentleBreeze',
    name: '부드러운 바람',
    description: '천천히 팔랑거리는 책 넘김 효과',
    
    windStrength: 0.8,
    windDirection: new THREE.Vector3(0.5, 0.2, 0.3),
    
    turbulence: 0.3,
    directionChangeSpeed: 0.05,
    strengthVariation: 0.2,
    
    paperStiffness: 0.7,
    paperDamping: 0.3,
    edgeWeight: 0.6,
    
    flipDuration: 1200,
    wobbleIntensity: 0.6,
  },

  // 2. 강한 바람 (격렬한 넘김)
  strongWind: {
    id: 'strongWind',
    name: '강한 바람',
    description: '거세게 흔들리는 종이 효과',
    
    windStrength: 2.5,
    windDirection: new THREE.Vector3(0.8, 0.4, 0.5),
    
    turbulence: 0.8,
    directionChangeSpeed: 0.15,
    strengthVariation: 0.6,
    
    paperStiffness: 0.3,
    paperDamping: 0.1,
    edgeWeight: 0.8,
    
    flipDuration: 800,
    wobbleIntensity: 1.0,
  },

  // 3. 돌풍 (갑작스러운 넘김)
  gust: {
    id: 'gust',
    name: '돌풍',
    description: '갑자기 확 넘어가는 종이 효과',
    
    windStrength: 4.0,
    windDirection: new THREE.Vector3(0.6, 0.1, 0.8),
    
    turbulence: 0.9,
    directionChangeSpeed: 0.3,
    strengthVariation: 0.8,
    
    paperStiffness: 0.2,
    paperDamping: 0.05,
    edgeWeight: 0.9,
    
    flipDuration: 600,
    wobbleIntensity: 1.2,
  },

  // 4. 잔잔한 바람 (느긋한 넘김)
  calmBreeze: {
    id: 'calmBreeze',
    name: '잔잔한 바람',
    description: '느긋하게 넘어가는 종이 효과',
    
    windStrength: 0.3,
    windDirection: new THREE.Vector3(0.3, 0.1, 0.2),
    
    turbulence: 0.1,
    directionChangeSpeed: 0.02,
    strengthVariation: 0.1,
    
    paperStiffness: 0.9,
    paperDamping: 0.5,
    edgeWeight: 0.4,
    
    flipDuration: 1800,
    wobbleIntensity: 0.3,
  },

  // 5. 회오리 바람 (소용돌이치는 종이)
  vortex: {
    id: 'vortex',
    name: '회오리 바람',
    description: '소용돌이치며 넘어가는 종이 효과',
    
    windStrength: 2.0,
    windDirection: new THREE.Vector3(0.2, 0.8, 0.3),
    
    turbulence: 0.7,
    directionChangeSpeed: 0.25,
    strengthVariation: 0.5,
    
    paperStiffness: 0.4,
    paperDamping: 0.15,
    edgeWeight: 0.7,
    
    flipDuration: 1000,
    wobbleIntensity: 0.9,
  },
};

// 바람 설정 가져오기 헬퍼
export const getWindConfig = (id: string): WindConfig => {
  return windConfigs[id] || windConfigs.gentleBreeze;
};

// 랜덤 바람 설정 생성 (테스트용)
export const getRandomWindConfig = (): WindConfig => {
  const keys = Object.keys(windConfigs);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return windConfigs[randomKey];
};

// 바람 설정 목록 (UI 표시용)
export const windConfigList = Object.values(windConfigs).map(config => ({
  id: config.id,
  name: config.name,
  description: config.description,
}));