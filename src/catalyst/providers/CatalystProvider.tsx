
import React, { createContext, useContext, ReactNode, useReducer } from 'react';

// Define the state structure as per Catalyst conventions
interface CatalystState {
  version: string;
  theme: string;
  loading: boolean;
  error: string | null;
}

// Define action types as per Catalyst conventions
type CatalystAction = 
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface CatalystContextType {
  state: CatalystState;
  dispatch: React.Dispatch<CatalystAction>;
}

const initialState: CatalystState = {
  version: '1.0.0',
  theme: 'light',
  loading: false,
  error: null
};

// Create reducer as per Catalyst Redux pattern
function catalystReducer(state: CatalystState, action: CatalystAction): CatalystState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}

const CatalystContext = createContext<CatalystContextType | undefined>(undefined);

export const useCatalyst = () => {
  const context = useContext(CatalystContext);
  if (!context) {
    throw new Error('useCatalyst must be used within a CatalystProvider');
  }
  return context;
};

interface CatalystProviderProps {
  children: ReactNode;
  initialValues?: Partial<CatalystState>;
}

export const CatalystProvider = ({ 
  children, 
  initialValues = {} 
}: CatalystProviderProps) => {
  const [state, dispatch] = useReducer(
    catalystReducer, 
    { ...initialState, ...initialValues }
  );
  
  return (
    <CatalystContext.Provider value={{ state, dispatch }}>
      {children}
    </CatalystContext.Provider>
  );
};
