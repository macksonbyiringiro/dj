
import React from 'react';
import { Product } from '../types';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';
import { Icon } from './common/Icon';

interface SellerViewProps {
  products: Product[];
  addProduct: (product: Product) => void;
}

const SellerView: React.FC<SellerViewProps> = ({ products, addProduct }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-dark">Seller Dashboard</h2>
        <p className="mt-2 text-lg text-gray-600">Add new products and manage your inventory.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
           <AddProductForm addProduct={addProduct} />
        </div>
        <div className="lg:col-span-2">
            <ProductList products={products} />
        </div>
      </div>
    </div>
  );
};

export default SellerView;
