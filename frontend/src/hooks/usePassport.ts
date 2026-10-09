"use client";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { PassportPublicData } from '@/types/passport';

export const usePassportPublic = (uuid: string) => {
  return useQuery<PassportPublicData>({
    queryKey: ['passport', uuid],
    queryFn: async () => {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const { data } = await axios.get(`${baseURL}/api/passport/${uuid}`);
      return data;
    },
    enabled: Boolean(uuid),
  });
};
