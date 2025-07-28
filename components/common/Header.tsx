
import React from 'react';
import { UserRole } from '../../types';
import { Icon } from './Icon';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const isSeller = currentRole === UserRole.Seller;

  return (
    <header className="bg-brand-dark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Icon name="scan" className="h-8 w-8 text-brand-primary" />
            <h1 className="text-2xl font-bold text-white">
              Biashara<span className="text-brand-primary">Scan</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium hidden sm:block">I am a:</span>
            <div className="relative inline-flex items-center bg-gray-700 rounded-full p-1 cursor-pointer">
              <button
                onClick={() => onRoleChange(UserRole.Seller)}
                className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ease-in-out ${
                  isSeller ? 'text-brand-dark' : 'text-white'
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => onRoleChange(UserRole.Buyer)}
                className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ease-in-out ${
                  !isSeller ? 'text-brand-dark' : 'text-white'
                }`}
              >
                Buyer
              </button>
              <span
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-primary rounded-full transition-transform duration-300 ease-in-out ${
                  isSeller ? 'translate-x-[4px]' : 'translate-x-[calc(100%+4px)]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
