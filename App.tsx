import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import SellerView from './components/SellerView';
import BuyerView from './components/BuyerView';
import Header from './components/common/Header';
import { useProducts } from './hooks/useProducts';
import LoginView from './components/LoginView';
import { SettingsProvider } from './contexts/SettingsContext';
import SettingsModal from './components/common/SettingsModal';
import { generateMarketplaceBackground } from './services/geminiService';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.Seller);
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sellerPassword, setSellerPassword] = useState('password123'); // Default password
  const { products, addProduct, findProductById } = useProducts();
  const [background, setBackground] = useState<string | null>(null);
  const [isGeneratingBackground, setIsGeneratingBackground] = useState(false);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const cachedBackground = localStorage.getItem('marketplaceBackground');
        if (cachedBackground) {
          setBackground(cachedBackground);
          return;
        }
        
        setIsGeneratingBackground(true);
        const url = await generateMarketplaceBackground();
        if (url) {
          localStorage.setItem('marketplaceBackground', url);
          setBackground(url);
        }
      } catch (error) {
        console.error("Failed to load background:", error);
      } finally {
        setIsGeneratingBackground(false);
      }
    };

    fetchBackground();
  }, []);


  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === UserRole.Buyer) {
      setIsSellerAuthenticated(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsSellerAuthenticated(true);
  };
  
  const handlePasswordChange = (newPassword: string) => {
    setSellerPassword(newPassword);
  };

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleGenerateBackground = async (prompt: string): Promise<boolean> => {
    setIsGeneratingBackground(true);
    try {
      const url = await generateMarketplaceBackground(prompt);
      if (url) {
        localStorage.setItem('marketplaceBackground', url);
        setBackground(url);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to generate background:", error);
      return false;
    } finally {
      setIsGeneratingBackground(false);
    }
  };

  const backgroundStyle: React.CSSProperties = background ? {
    backgroundImage: background.startsWith('linear-gradient') ? background : `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  } : {};

  return (
    <SettingsProvider>
      <div 
        className="min-h-screen bg-brand-light font-sans transition-all duration-1000"
        style={backgroundStyle}
      >
        <div className="min-h-screen w-full bg-brand-light/80 backdrop-blur-sm">
          <Header 
            currentRole={role} 
            onRoleChange={handleRoleChange} 
            onToggleSettings={toggleSettingsModal} 
          />
          <main className="p-4 sm:p-6 lg:p-8">
            {role === UserRole.Seller ? (
              isSellerAuthenticated ? (
                <SellerView products={products} addProduct={addProduct} />
              ) : (
                <LoginView onSuccess={handleLoginSuccess} sellerPassword={sellerPassword} />
              )
            ) : (
              <BuyerView products={products} findProductById={findProductById} />
            )}
          </main>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={toggleSettingsModal}
            isSellerAuthenticated={isSellerAuthenticated}
            currentPassword={sellerPassword}
            onPasswordChange={handlePasswordChange}
            onGenerateBackground={handleGenerateBackground}
            isGeneratingBackground={isGeneratingBackground}
          />
        </div>
      </div>
    </SettingsProvider>
  );
};

export default App;
