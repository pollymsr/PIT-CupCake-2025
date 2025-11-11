import { createContext, useContext, ReactNode } from 'react';

interface TestAuthContextType {
  loginAsTestUser: () => void;
}

const TestAuthContext = createContext<TestAuthContextType | undefined>(undefined);

export function TestAuthProvider({ children }: { children: ReactNode }) {
  const loginAsTestUser = () => {
    console.log('Test user login - implementar lógica real');
    localStorage.setItem('test-user', 'true');
  };

  return (
    <TestAuthContext.Provider value={{ loginAsTestUser }}>
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