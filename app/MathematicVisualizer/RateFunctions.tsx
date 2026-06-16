// app/MathematicVisualizer/RateFunctions.ts

/**
 * Overshoot easing function that goes beyond the target and settles back
 * @param t - Progress from 0 to 1
 * @param magnitude - How much to overshoot (default: 0.1)
 * @returns Value between 0 and 1+ with overshoot
 */
export function overshoot(t: number, magnitude: number = 0.1): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  
  // Overshoot formula - goes beyond 1 then returns
  const overshootAmount = magnitude;
  const eased = 1 - Math.pow(1 - t, 2); // Quadratic ease out
  
  if (eased < 1) {
    return eased * (1 + overshootAmount);
  } else {
    // Settle back to 1
    const settle = (eased - 1) / overshootAmount;
    return 1 + overshootAmount * (1 - settle);
  }
}

/**
 * Spring-like easing function
 */
export function spring(t: number, tension: number = 170, friction: number = 26): number {
  // Simplified spring simulation
  const damping = friction / 10;
  const angularFrequency = Math.sqrt(tension);
  const omegaZeta = angularFrequency * damping;
  
  // Critical damping or overdamped
  if (omegaZeta >= 1) {
    const n1 = -angularFrequency * damping;
    const n2 = angularFrequency * Math.sqrt(damping * damping - 1);
    return 1 - Math.exp(n1 * t) * Math.cosh(n2 * t);
  }
  
  // Underdamped
  const n1 = -angularFrequency * damping;
  const n2 = angularFrequency * Math.sqrt(1 - damping * damping);
  return 1 - Math.exp(n1 * t) * (Math.cos(n2 * t) + (n1 / n2) * Math.sin(n2 * t));
}

/**
 * Elastic easing function
 */
export function elastic(t: number, amplitude: number = 1, period: number = 0.3): number {
  if (t === 0 || t === 1) return t;
  const s = period / (2 * Math.PI) * Math.asin(1 / amplitude);
  return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / period) + 1;
}