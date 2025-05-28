'use client';
import { createContext, useContext } from 'react';

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  exp: number;
} | null;

export const UserContext = createContext<User>(null);

export function useUser() {
  return useContext(UserContext);
}
