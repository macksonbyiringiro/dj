
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product } from '../types';
import Card from './common/Card';
import { Icon } from './common/Icon';
import { RWF_EXCHANGE_RATE } from '../constants';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
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
          {products.map((product) => (
            <Card key={product.id} className="p-4 border border-gray-200 !shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <h4 className="text-lg font-bold text-brand-dark">{product.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">EN:</span> {product.description.english}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold">RW:</span> {product.description.kinyarwanda}
                  </p>
                  <div className="mt-2 text-lg font-semibold text-brand-primary">
                    ${product.priceUSD.toFixed(2)} / {(product.priceUSD * RWF_EXCHANGE_RATE).toLocaleString()} RWF
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="p-2 bg-white border-2 border-brand-primary rounded-lg">
                    <QRCodeSVG
                      value={JSON.stringify({ id: product.id })}
                      size={120}
                      level="H"
                      imageSettings={{
                        src: "https://i.imgur.com/SAX2Fp8.png", // A small logo in the middle
                        height: 24,
                        width: 24,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProductList;