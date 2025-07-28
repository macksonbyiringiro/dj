import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../types';
import { generateProductDescription } from '../services/geminiService';
import Card from './common/Card';
import { Icon } from './common/Icon';

interface AddProductFormProps {
  addProduct: (product: Product) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ addProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const description = await generateProductDescription(name);
      const newProduct: Product = {
        id: uuidv4(),
        name,
        priceUSD: parseFloat(price),
        description,
      };
      addProduct(newProduct);
      setName('');
      setPrice('');
    } catch (err) {
      setError('Failed to create product. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
       <div className="flex items-center mb-6">
        <Icon name="plus-circle" className="h-8 w-8 text-brand-primary" />
        <h3 className="ml-3 text-2xl font-bold text-brand-dark">Add New Product</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            placeholder="e.g., Hand-woven Basket"
          />
        </div>
        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Price (USD)</label>
          <input
            type="number"
            id="productPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            placeholder="e.g., 25.50"
            step="0.01"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Icon name="loader" className="h-5 w-5" /> : 'Add Product & Generate QR'}
        </button>
      </form>
    </Card>
  );
};

export default AddProductForm;