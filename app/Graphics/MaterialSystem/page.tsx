'use client';

import { useState } from 'react';

import HdriOrbitingRenderer
from './HdriOrbitingRenderer';

import AssetBrowserInterface
from './interfaceUi/assetbrowserinterface';

export default function Page() {

  const [
    shouldDoMapping,
    setShouldDoMapping,
  ] = useState(false);

  //  추가: 선택된 모델 ID를 저장할 state
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  //  추가: 모델 선택 시 처리할 핸들러
  const handleSelectModel = (modelId: string) => {
    console.log('Selected model:', modelId);
    setSelectedModelId(modelId);
    // 여기에 모델 선택 후 필요한 추가 로직 작성
  };

  return (

    <main
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'black',
      }}
    >

      <AssetBrowserInterface
        onDoMapping={() => {

          setShouldDoMapping(
            prev => !prev
          );
        }}
        onSelectModel={handleSelectModel}  //  추가: onSelectModel prop 전달
      />

      <HdriOrbitingRenderer
        shouldDoMapping={shouldDoMapping}
        selectedModelId={selectedModelId}  //  선택사항: 필요시 모델 ID 전달
      />

    </main>
  );
}