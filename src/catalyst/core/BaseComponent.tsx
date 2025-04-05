
import React from 'react';

/**
 * Base Component class to standardize component architecture
 * following Catalyst structure by Tata 1mg
 */
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  style?: React.CSSProperties;
}

export const BaseComponent = ({ 
  children, 
  testId,
  className,
  style
}: BaseComponentProps & { children: React.ReactNode }) => {
  return (
    <div className={className} style={style} data-testid={testId}>
      {children}
    </div>
  );
};
