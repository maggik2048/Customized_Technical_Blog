// assetbrowserinterfaceStyle.ts

export const styles = {
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 360,
    height: '100vh',

    overflowY: 'auto',
    overflowX: 'visible',

    background: 'rgba(15,15,15,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',

    borderRight: '1px solid rgba(255,255,255,0.08)',
    zIndex: 1000,

    padding: 20,
    boxSizing: 'border-box',

    isolation: 'isolate',
    transform: 'translateZ(0)',

    pointerEvents: 'auto',
  } as const,

  headerTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 700,
    margin: 0,
  } as const,

  headerSubtitle: {
    color: 'rgba(255,255,255,0.45)',
    marginTop: 8,
    fontSize: 13,
  } as const,

  searchInput: {
    width: '100%',
    height: 42,

    border: 'none',
    outline: 'none',

    borderRadius: 12,
    paddingLeft: 14,

    marginBottom: 16,

    color: 'white',
    background: 'rgba(255,255,255,0.08)',

    fontSize: 14,
  } as const,

  button: {
    width: '100%',
    height: 44,

    marginBottom: 16,

    borderRadius: 12,
    cursor: 'pointer',

    color: 'white',
    fontWeight: 700,

    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
  } as const,

  registerButton: {
    width: '100%',
    height: 48,

    borderRadius: 14,
    marginBottom: 24,

    color: 'white',
    fontWeight: 700,

    background: 'rgba(255,255,255,0.08)',
  } as const,

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,

    overflow: 'visible',
    position: 'relative',
  } as const,

  headerWrapper: {
    marginBottom: 24,
  } as const,
};