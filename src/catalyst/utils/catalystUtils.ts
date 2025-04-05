
/**
 * Utility functions for Catalyst components
 * Similar to those found in the Tata 1mg Catalyst framework
 */

// Type-safe action creator helper
export function createAction<T extends string, P>(type: T, payload: P) {
  return {
    type,
    payload
  };
}

// Selector pattern for extracting specific state
export function createSelector<State, Selected>(
  selector: (state: State) => Selected
) {
  return selector;
}

// Memoization helper for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): T {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
