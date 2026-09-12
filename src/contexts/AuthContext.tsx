import React, { createContext, useContext, useEffect, useState } from 'react';
import { TutorSession } from '@models/Auth';
import { authService, RegisterPayload } from '@services/authService';
import { authEvents } from '@services/authEvents';
interface AuthContextType {
  session: TutorSession | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [session, setSession] = useState<TutorSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    authService.getSession().then((s) => {
      setSession(s);
      setIsLoading(false);
    });
  }, []);
  useEffect(() => {
    return authEvents.onUnauthorized(() => setSession(null));
  }, []);
  const login = async (email: string, senha: string) => {
    const s = await authService.login(email, senha);
    setSession(s);
  };
  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);
  };
  const logout = async () => {
    await authService.logout();
    setSession(null);
  };
  return (
    <AuthContext.Provider value={{ session, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
