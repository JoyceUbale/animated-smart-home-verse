
import React from 'react';

/**
 * Base Component class to standardize component architecture
 * following Catalyst-inspired structure
 */
export interface BaseComponentProps {
  className?: string;
  testId?: string;
}

export const BaseComponent = ({ 
  children, 
  testId,
  className 
}: BaseComponentProps & { children: React.ReactNode }) => {
  return (
    <div className={className} data-testid={testId}>
      {children}
    </div>
  );
};
