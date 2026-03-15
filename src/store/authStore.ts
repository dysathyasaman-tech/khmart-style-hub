
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('khmart_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userData = { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin };
      localStorage.setItem('khmart_currentUser', JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true });
      return true;
    }
    return false;
  },

  register: async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('khmart_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      isAdmin: email === 'admin@minishop.com'
    };
    
    users.push(newUser);
    localStorage.setItem('khmart_users', JSON.stringify(users));
    
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name, isAdmin: newUser.isAdmin };
    localStorage.setItem('khmart_currentUser', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
    return true;
  },

  logout: () => {
    localStorage.removeItem('khmart_currentUser');
    set({ user: null, isAuthenticated: false });
  },

  checkAuthStatus: () => {
    const userData = localStorage.getItem('khmart_currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      set({ user, isAuthenticated: true });
    }
  },

  updateUser: (updatedUser: User) => {
    // Update in localStorage
    localStorage.setItem('khmart_currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('khmart_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], name: updatedUser.name, email: updatedUser.email };
      localStorage.setItem('khmart_users', JSON.stringify(users));
    }
    
    set({ user: updatedUser });
  }
}));
