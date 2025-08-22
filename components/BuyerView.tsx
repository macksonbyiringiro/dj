import React, { useState, useCallback } from 'react';
import { Product } from '../types';
import Scanner from './Scanner';
import ProductDetails from './ProductDetails';
import { Icon } from './common/Icon';
import Card from './common/Card';
import { useSettings } from '../contexts/SettingsContext';
import { RWF_EXCHANGE_RATE } from '../constants';
import GeneralChatModal from './GeneralChatModal';

interface BuyerViewProps {
  products: Product[];
  findProductById: (id: string) => Product | undefined;
}

interface SearchResultsProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, onProductSelect }) => {
  const { settings } = useSettings();
  if (products.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto p-8 text-center">
        <Icon name="shield-alert" className="h-12 w-12 mx-auto text-brand-accent mb-4" />
        <h3 className="text-xl font-bold">No Products Found</h3>
        <p className="mt-2 text-gray-500">
          We couldn't find any products matching your search. Try different keywords.
        </p>
      </Card>
    );
  }
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h3 className="text-xl font-bold text-brand-dark px-4 sm:px-0">Search Results</h3>
      {products.map(product => {
        const priceRWF = product.priceUSD * RWF_EXCHANGE_RATE;
        const primaryPrice = settings.currency === 'USD' ? `$${product.priceUSD.toFixed(2)}` : `${priceRWF.toLocaleString()} RWF`;
        
        return (
          <Card 
            key={product.id} 
            className="p-4 border border-gray-200 !shadow-md hover:shadow-xl hover:border-brand-primary transition-all cursor-pointer"
            onClick={() => onProductSelect(product)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onProductSelect(product)}
            aria-label={`View details for ${product.name}`}
          >
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="col-span-1 flex justify-center items-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm" />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon name="image" className="h-10 w-10 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="col-span-3">
                <h4 className="text-lg font-bold text-brand-dark">{product.name}</h4>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {settings.language === 'en' ? product.description.english : product.description.kinyarwanda}
                </p>
                <div className="mt-2">
                  <span className="text-lg font-semibold text-brand-primary">{primaryPrice}</span>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
};

const BuyerView: React.FC<BuyerViewProps> = ({ products, findProductById }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isGeneralChatOpen, setIsGeneralChatOpen] = useState(false);

  const handleScanSuccess = useCallback((data: string) => {
    setSearchTerm('');
    try {
      const parsed = JSON.parse(data);
      if (parsed.id) {
        const product = findProductById(parsed.id);
        if (product) {
          setSelectedProduct(product);
          setScanError(null);
        } else {
          setScanError("Product not found in our system. This might be a counterfeit item.");
          setSelectedProduct(undefined);
        }
      } else {
        setScanError("Invalid QR code format. Please scan a valid product QR code.");
        setSelectedProduct(undefined);
      }
    } catch (e) {
      setScanError("This does not appear to be a valid BiasharaScan code.");
      setSelectedProduct(undefined);
    }
  }, [findProductById]);

  const handleScanError = useCallback((err: Error) => {
    // Scanner component shows its own error UI, so we just log here
    console.error("Scan error:", err.message);
  }, []);
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setScanError(null);
  };

  const handleReset = () => {
    setSelectedProduct(undefined);
    setScanError(null);
    setSearchTerm('');
  };

  const filteredProducts = searchTerm
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.kinyarwanda.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (selectedProduct || scanError) {
    return (
      <ProductDetails 
        product={selectedProduct} 
        error={scanError} 
        status={selectedProduct ? 'verified' : 'unverified'}
        onReset={handleReset} 
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-dark drop-shadow-md">Commodity Stock Check</h2>
        <p className="mt-2 text-lg text-gray-600 drop-shadow-sm">Scan a product's QR code or search by name to view its availability and details.</p>
      </div>
      
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a product by name..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            aria-label="Search for products"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="search" className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
      
      {searchTerm ? (
        <SearchResults 
          products={filteredProducts} 
          onProductSelect={handleProductSelect} 
        />
      ) : (
        <Scanner
          onScan={handleScanSuccess}
          onError={handleScanError}
        />
      )}

      <button
        onClick={() => setIsGeneralChatOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-110 z-20"
        aria-label="Ask our AI assistant Mackson"
        title="Ask Mackson"
      >
        <Icon name="message" className="h-7 w-7" />
      </button>

      {isGeneralChatOpen && (
        <GeneralChatModal 
          products={products} 
          onClose={() => setIsGeneralChatOpen(false)}
        />
      )}
    </div>
  );
};

export default BuyerView;