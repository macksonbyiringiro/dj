import React from 'react';
import Card from './common/Card';
import { Icon } from './common/Icon';

interface LoginViewProps {
  onSuccess: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  return (
    <div className="max-w-md mx-auto pt-10">
      <Card className="p-8">
        <div className="text-center mb-6">
          <Icon name="user" className="h-12 w-12 mx-auto text-brand-primary" />
          <h2 className="mt-4 text-3xl font-bold text-brand-dark">Seller Login</h2>
          <p className="mt-2 text-gray-600">Please log in to manage your products.</p>
        </div>
        {/* In a real app, you'd have input fields and authentication logic */}
        <button
          onClick={onSuccess}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
        >
          Log In
        </button>
      </Card>
    </div>
  );
};

export default LoginView;
