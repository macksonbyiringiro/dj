import React, { useState } from 'react';
import { UserRole } from './types';
import SellerView from './components/SellerView';
import BuyerView from './components/BuyerView';
import Header from './components/common/Header';
import { useProducts } from './hooks/useProducts';
import LoginView from './components/LoginView';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.Seller);
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const { products, addProduct, findProductById } = useProducts();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === UserRole.Buyer) {
      setIsSellerAuthenticated(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsSellerAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <Header currentRole={role} onRoleChange={handleRoleChange} />
      <main className="p-4 sm:p-6 lg:p-8">
        {role === UserRole.Seller ? (
          isSellerAuthenticated ? (
            <SellerView products={products} addProduct={addProduct} />
          ) : (
            <LoginView onSuccess={handleLoginSuccess} />
          )
        ) : (
          <BuyerView findProductById={findProductById} />
        )}
      </main>
    </div>
  );
};

export default App;
