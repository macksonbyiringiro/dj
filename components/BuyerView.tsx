import React, { useState } from 'react';
import { Product } from '../types';
import Scanner from './Scanner';
import ProductDetails from './ProductDetails';
import { Icon } from './common/Icon';

interface BuyerViewProps {
  findProductById: (id: string) => Product | undefined;
}

const BuyerView: React.FC<BuyerViewProps> = ({ findProductById }) => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  let product: Product | undefined;
  let verificationStatus: 'verified' | 'unverified' = 'unverified';

  if (scannedData) {
    try {
      const parsed = JSON.parse(scannedData);
      if (parsed.id) {
        product = findProductById(parsed.id);
        if (product) {
          verificationStatus = 'verified';
        } else {
          setError("Product not found in our system. This might be a counterfeit item.");
        }
      } else {
        setError("Invalid QR code format. Please scan a valid product QR code.");
      }
    } catch (e) {
      setError("This does not appear to be a valid BiasharaScan code.");
    }
  }

  const handleReset = () => {
    setScannedData(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-dark">Commodity Stock Check</h2>
        <p className="mt-2 text-lg text-gray-600">Scan a product's QR code to view its availability and details.</p>
      </div>
      
      {!scannedData ? (
        <Scanner
          onScan={(data) => { setScannedData(data); setError(null); }}
          onError={(err) => setError(err.message)}
        />
      ) : (
        <ProductDetails 
          product={product} 
          error={error} 
          status={verificationStatus}
          onReset={handleReset} 
        />
      )}
    </div>
  );
};

export default BuyerView;
