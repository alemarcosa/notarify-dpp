"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProductsResponse, Product, CreateProductPayload, UpdateProductPayload } from '@/types/product';

export const useProducts = (params: any) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: Boolean(id && id !== 'new'),
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const { data } = await api.post('/products', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProductPayload) => {
      const { data } = await api.patch(`/products/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['products', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const usePublishProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/products/${id}/publish`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
