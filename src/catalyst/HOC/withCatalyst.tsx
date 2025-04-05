
import React from 'react';
import { useCatalyst } from '../providers/CatalystProvider';

/**
 * Higher-order component pattern from Catalyst framework
 * Injects Catalyst state and dispatch into wrapped components
 */
export const withCatalyst = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WithCatalyst = (props: P) => {
    const { state, dispatch } = useCatalyst();
    
    // Pass Catalyst state and dispatch as props to the wrapped component
    return (
      <Component 
        {...props} 
        catalystState={state} 
        catalystDispatch={dispatch} 
      />
    );
  };
  
  WithCatalyst.displayName = `withCatalyst(${displayName})`;
  return WithCatalyst;
};
