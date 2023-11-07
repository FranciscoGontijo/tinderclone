import React, { createContext, useContext, ReactNode } from 'react';
import { View, Text } from 'react-native';

interface AuthContextType {
    user: string;
  }
  
  const initialContextValue: AuthContextType = {
    user: '',
  };
  
  const AuthContext = createContext<AuthContextType>(initialContextValue);
  
  type AuthProviderProps = {
    children: ReactNode;
  };
  
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    return (
      <AuthContext.Provider value={{
        user: "Francisco",
      }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }