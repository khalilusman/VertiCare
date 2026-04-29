import { createContext, useContext, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'); } catch { return null; }
  });

  const isAuthenticated = !!currentUser;

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'); } catch { return []; }
  };

  const saveUsers = (users) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const saveSession = (user) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    setCurrentUser(user);
  };

  const signup = useCallback(({ name, email, password }) => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      medications: [],
      triggers: [],
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { password: _pw, ...sessionUser } = newUser;
    saveSession(sessionUser);
    return { success: true };
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) return { success: false, error: 'Incorrect email or password.' };
    const { password: _pw, ...sessionUser } = user;
    saveSession(sessionUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback(({ name, medications, triggers }) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === currentUser?.id);
    if (idx === -1) return { success: false, error: 'User not found.' };
    const updated = {
      ...users[idx],
      name: name ?? users[idx].name,
      medications: medications ?? users[idx].medications,
      triggers: triggers ?? users[idx].triggers,
    };
    users[idx] = updated;
    saveUsers(users);
    const { password: _pw, ...sessionUser } = updated;
    saveSession(sessionUser);
    return { success: true };
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}