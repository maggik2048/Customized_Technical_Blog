'use client';

import HdriOrbitingRenderer
from './HdriOrbitingRenderer';

import AssetBrowserInterface
from './assetbrowserinterface';

export default function Page() {

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

      {/* LEFT SIDEBAR */}

      <AssetBrowserInterface />

      {/* HDRI RENDERER */}

      <HdriOrbitingRenderer />

    </main>
  );
}