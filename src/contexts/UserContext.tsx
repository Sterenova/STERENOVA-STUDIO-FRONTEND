'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '@/types/api';

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un utilisateur connecté pour le développement
    // En production, cela viendrait d'une API d'authentification
    const mockUser: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'Utilisateur Demo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simuler un délai de chargement
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 1000);
  }, []);

  const value: UserContextType = {
    user,
    setUser,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 