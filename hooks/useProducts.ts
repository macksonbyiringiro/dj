
import { useState, useCallback } from 'react';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = useCallback((newProduct: Product) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  }, []);

  const findProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  return { products, addProduct, findProductById };
};
