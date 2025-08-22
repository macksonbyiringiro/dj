
import React, { useState } from 'react';
import { Product } from '../types';
import Card from './common/Card';
import { Icon } from './common/Icon';
import { RWF_EXCHANGE_RATE } from '../constants';
import { useSettings } from '../contexts/SettingsContext';
import ChatModal from './ChatModal';

interface ProductDetailsProps {
  product?: Product;
  error: string | null;
  status: 'verified' | 'unverified';
  onReset: () => void;
}

const VerificationStatus: React.FC<{ status: 'verified' | 'unverified' }> = ({ status }) => {
  const isVerified = status === 'verified';
  const bgColor = isVerified ? 'bg-green-100' : 'bg-red-100';
  const textColor = isVerified ? 'text-green-800' : 'text-red-800';
  const iconName = isVerified ? 'shield-check' : 'shield-alert';
  const text = isVerified ? 'Product Verified' : 'Verification Failed';

  return (
    <div className={`flex items-center p-4 rounded-lg ${bgColor}`}>
      <Icon name={iconName} className={`h-8 w-8 ${textColor}`} />
      <div className="ml-4">
        <h4 className={`text-lg font-bold ${textColor}`}>{text}</h4>
        <p className={`text-sm ${textColor}`}>
          {isVerified ? 'This is an authentic product.' : 'This product is not in our system.'}
        </p>
      </div>
    </div>
  );
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, error, status, onReset }) => {
  const { settings } = useSettings();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderDescription = (product: Product) => {
    if (settings.language === 'rw') {
      return (
        <>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-600 mb-2">Ibisobanuro (Kinyarwanda)</h5>
            <p className="text-gray-800">{product.description.kinyarwanda}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-600 mb-2">Description (English)</h5>
            <p className="text-gray-800">{product.description.english}</p>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-600 mb-2">Description (English)</h5>
            <p className="text-gray-800">{product.description.english}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-600 mb-2">Ibisobanuro (Kinyarwanda)</h5>
            <p className="text-gray-800">{product.description.kinyarwanda}</p>
        </div>
      </>
    );
  };
  
  const renderPrice = (product: Product) => {
      const priceRWF = product.priceUSD * RWF_EXCHANGE_RATE;
      const primaryPrice = settings.currency === 'USD' ? `$${product.priceUSD.toFixed(2)}` : `${priceRWF.toLocaleString()} RWF`;
      const secondaryPrice = settings.currency === 'USD' ? `${priceRWF.toLocaleString()} RWF` : `$${product.priceUSD.toFixed(2)}`;
      
      return (
         <div className="flex items-baseline justify-between p-4 bg-brand-secondary rounded-lg">
            <span className="text-lg font-medium text-brand-dark">Price:</span>
            <div className="text-right">
            <p className="text-3xl font-bold text-brand-primary">{primaryPrice}</p>
            <p className="text-lg text-gray-700">{secondaryPrice}</p>
            </div>
        </div>
      )
  }

  return (
    <>
      <Card className="max-w-2xl mx-auto overflow-hidden">
        {product && (
          product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
              <Icon name="image" className="h-24 w-24 text-gray-400" />
            </div>
          )
        )}
        <div className="p-6">
          <VerificationStatus status={status} />
          {error && !product && (
            <div className="mt-4 text-center text-red-600">
              <p>{error}</p>
            </div>
          )}
          {product && (
            <div className="mt-6 space-y-4">
              <h3 className="text-4xl font-extrabold text-brand-dark tracking-tight">{product.name}</h3>
              {renderDescription(product)}
              {renderPrice(product)}
            </div>
          )}
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
           {product && (
            <button
                onClick={() => setIsChatOpen(true)}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
                <Icon name="message" className="h-5 w-5 mr-2" />
                Ask a Question
            </button>
          )}
          <button
            onClick={onReset}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
          >
            <Icon name="scan-line" className="h-5 w-5 mr-2" />
            {product ? 'Scan Another Product' : 'Try Scanning Again'}
          </button>
        </div>
      </Card>
      {product && isChatOpen && (
        <ChatModal 
            product={product} 
            onClose={() => setIsChatOpen(false)} 
        />
       )}
    </>
  );
};

export default ProductDetails;
