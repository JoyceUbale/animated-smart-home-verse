
import React, { createContext, useContext, ReactNode } from 'react';

interface CatalystContextType {
  version: string;
  // Additional Catalyst-specific context properties would go here
}

const defaultContext: CatalystContextType = {
  version: '1.0.0',
};

const CatalystContext = createContext<CatalystContextType>(defaultContext);

export const useCatalyst = () => useContext(CatalystContext);

interface CatalystProviderProps {
  children: ReactNode;
  initialValues?: Partial<CatalystContextType>;
}

export const CatalystProvider = ({ 
  children, 
  initialValues = {} 
}: CatalystProviderProps) => {
  const value = { ...defaultContext, ...initialValues };
  
  return (
    <CatalystContext.Provider value={value}>
      {children}
    </CatalystContext.Provider>
  );
};
