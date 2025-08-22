
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product } from '../types';
import Card from './common/Card';
import { Icon } from './common/Icon';
import { RWF_EXCHANGE_RATE } from '../constants';
import { useSettings } from '../contexts/SettingsContext';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { settings } = useSettings();

  const primaryLang = settings.language === 'en' ? 'english' : 'kinyarwanda';
  const secondaryLang = settings.language === 'en' ? 'kinyarwanda' : 'english';
  const primaryLangLabel = settings.language === 'en' ? 'EN' : 'RW';
  const secondaryLangLabel = settings.language === 'en' ? 'RW' : 'EN';
  
  return (
    <Card className="p-6">
       <div className="flex items-center mb-6">
        <Icon name="store" className="h-8 w-8 text-brand-primary" />
        <h3 className="ml-3 text-2xl font-bold text-brand-dark">My Products</h3>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't added any products yet.</p>
          <p className="text-gray-500">Use the form to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => {
             const priceRWF = product.priceUSD * RWF_EXCHANGE_RATE;
             const primaryPrice = settings.currency === 'USD' ? `$${product.priceUSD.toFixed(2)}` : `${priceRWF.toLocaleString()} RWF`;
             const secondaryPrice = settings.currency === 'USD' ? `${priceRWF.toLocaleString()} RWF` : `$${product.priceUSD.toFixed(2)}`;

            return (
              <Card key={product.id} className="p-4 border border-gray-200 !shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div className="sm:col-span-1 flex justify-center items-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg shadow-sm" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon name="image" className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <h4 className="text-lg font-bold text-brand-dark">{product.name}</h4>
                    <p className="text-sm text-gray-800 mt-1">
                      <span className="font-semibold">{primaryLangLabel}:</span> {product.description[primaryLang]}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold">{secondaryLangLabel}:</span> {product.description[secondaryLang]}
                    </p>
                    <div className="mt-2">
                      <span className="text-lg font-semibold text-brand-primary">{primaryPrice}</span>
                      <span className="text-sm text-gray-500 ml-2">({secondaryPrice})</span>
                    </div>
                  </div>
                  <div className="sm:col-span-1 flex justify-center items-center">
                    <div className="p-2 bg-white border-2 border-brand-primary rounded-lg">
                      <QRCodeSVG
                        value={JSON.stringify({ id: product.id })}
                        size={100}
                        level="H"
                        imageSettings={{
                          src: "https://i.imgur.com/SAX2Fp8.png",
                          height: 20,
                          width: 20,
                          excavate: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Card>
  );
};

export default ProductList;