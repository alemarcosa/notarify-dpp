"use client";
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardData, AnalyticsData } from '@/types/analytics';

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard');
      return data;
    },
    staleTime: 15 * 1000,
  });
};

export const useAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await api.get('/analytics');
      return data;
    },
    staleTime: 30 * 1000,
  });
};
