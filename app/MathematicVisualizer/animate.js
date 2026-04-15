export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function animateValue(setter, from, to, duration = 200) {
  const start = performance.now();

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    setter(lerp(from, to, t));

    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}