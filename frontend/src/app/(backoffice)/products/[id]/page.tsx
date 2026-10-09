"use client";
import ProductForm from '@/components/products/ProductForm';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams();
  return <ProductForm id={id as string} />;
}
