
import { useState, useEffect } from 'react';
import { useCatalyst } from '../providers/CatalystProvider';

/**
 * A custom state hook following Catalyst framework patterns
 * This combines local component state with the Catalyst global state
 */
export function useCatalystState<T>(initialState: T, stateKey?: string) {
  const [localState, setLocalState] = useState<T>(initialState);
  const { state: globalState, dispatch } = useCatalyst();
  
  // Connect to global state when a stateKey is provided
  useEffect(() => {
    if (stateKey) {
      console.log(`Catalyst state initialized for "${stateKey}" with:`, initialState);
    } else {
      console.log('Catalyst local state initialized with:', initialState);
    }
  }, []);
  
  // Method to update both local and potentially global state
  const updateState = (newState: T | ((prevState: T) => T)) => {
    setLocalState(newState);
    
    // If this state should be synchronized with global state
    if (stateKey) {
      // In a real implementation, we would dispatch to update the global state
      // This is simplified for demonstration
    }
  };
  
  return [localState, updateState] as const;
}
