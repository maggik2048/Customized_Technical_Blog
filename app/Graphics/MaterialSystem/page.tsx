'use client';

import { useState } from 'react';

import HdriOrbitingRenderer
from './HdriOrbitingRenderer';

import AssetBrowserInterface
from './assetbrowserinterface';

export default function Page() {

  const [
    shouldDoMapping,
    setShouldDoMapping,
  ] = useState(false);

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
      />

      <HdriOrbitingRenderer
        shouldDoMapping={shouldDoMapping}
      />

    </main>
  );
}