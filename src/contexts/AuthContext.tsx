import React, { createContext, useReducer, ReactNode, useContext, Dispatch, useEffect } from 'react';


export type SearchParamsType = {

};

export type SearchResultType = {

};

type ActionType =
  | { type: 'LOGIN'; payload?: { userName: string | null } }
  | { type: 'LOGOUT' }
  | { type: 'START_LOADING' }
  | { type: 'END_LOADING' }
  | { type: 'SET_COMPANY_INFO'; payload: { limit: string; used: string; companyLimit?: string; usedCompanyCount?: string } | null } 
  | { type: 'SET_SEARCH_PARAMS'; payload: SearchParamsType } 
  | { type: 'SET_SEARCH_RESULTS'; payload: SearchResultType[] } 
  | { type: 'SET_AUTHORIZED'; payload: boolean };

  type StateType = {
    isAuthorized: boolean;
    loading: boolean;
    companyInfo: { limit: string; used: string; companyLimit?: string; usedCompanyCount?: string } | null; 
    searchParams: SearchParamsType | null;
    searchResults: SearchResultType[] | null; 
    userName: string | null; 
  };

type AuthContextType = {
  state: StateType;
  dispatch: Dispatch<ActionType>;
  isAuthorized: boolean;
  
};


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: StateType = {
  isAuthorized: false,
  loading: false,
  companyInfo: null,
  searchParams: null, 
  searchResults: null, 
  userName: null, 
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthorized: true, userName: action.payload?.userName || null };
    case 'LOGOUT':
      return { ...state, isAuthorized: false, userName: null };
    case 'START_LOADING':
      return { ...state, loading: true };
    case 'END_LOADING':
      return { ...state, loading: false };
    case 'SET_COMPANY_INFO':
      return { ...state, companyInfo: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    const isAuthorized = localStorage.getItem('isAuthorized');
    const userName = localStorage.getItem('userName'); 
  
    if (isAuthorized === 'true') {
   
      dispatch({ type: 'LOGIN', payload: { userName } });
    }
  }, []);
  

  useEffect(() => {

    localStorage.setItem('isAuthorized', state.isAuthorized.toString());
    console.log('localStorage isAuthorized set to', state.isAuthorized);

  }, [state.isAuthorized]);

  return (
    <AuthContext.Provider value={{ state, dispatch, isAuthorized: state.isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};
