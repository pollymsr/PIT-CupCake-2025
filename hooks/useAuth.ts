// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulação - substitua pela sua lógica real
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ id: '1', name: 'Usuário', email: 'usuario@email.com' });
    }
  }, []);

  return { user };
}