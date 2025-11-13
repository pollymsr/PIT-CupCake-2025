// context/TestAuthContext.tsx - CORRIGIDO
import React, { createContext, useContext, useState, ReactNode } from 'react'; // ← ADICIONE React e useState

interface TestAuthContextType {
  isTestUser: boolean;
  loginAsTestUser: () => void;
  logoutTestUser: () => void;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export function TestAuthProvider({ children }: { children: ReactNode }) {
  const [isTestUser, setIsTestUser] = useState(false); // ← useState precisa ser importado

  const loginAsTestUser = () => {
    setIsTestUser(true);
    console.log('✅ Logado como usuário teste');
    localStorage.setItem('test-user', 'true');
  };

  const logoutTestUser = () => {
    setIsTestUser(false);
    console.log('🚪 Logout do usuário teste');
    localStorage.removeItem('test-user');
  };

  return (
    <TestAuthContext.Provider value={{ isTestUser, loginAsTestUser, logoutTestUser }}>
      {children}
    </TestAuthContext.Provider>
  );
}

// ✅ Exportação do hook
export function useTestAuth() {
  const context = useContext(TestAuthContext);
  if (!context) {
    throw new Error('useTestAuth must be used within a TestAuthProvider');
  }
  return context;
}