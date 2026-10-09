"use client";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { saveToken, removeToken, getUserFromToken, logout } from '@/lib/auth';
import { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await api.post('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data: any) => {
      const token =
        data?.accessToken ||
        data?.data?.accessToken ||
        data?.token ||
        data?.data?.token;

      if (token) {
        saveToken(token);
      }
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = getUserFromToken();
      if (!user) return null;
      try {
        const res = await api.get('/auth/me');
        return res.data?.data || res.data || user;
      } catch (err) {
        return user;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    logout();
    queryClient.clear();
    router.push('/login');
  };
};

const AuthContext = createContext({});
export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
);
