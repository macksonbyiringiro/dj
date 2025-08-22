import React, { useState } from 'react';
import Card from './common/Card';
import { Icon } from './common/Icon';

interface LoginViewProps {
  onSuccess: () => void;
  sellerPassword: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onSuccess, sellerPassword }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === sellerPassword) {
      setError('');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="p-8">
        <div className="text-center mb-8">
          <Icon name="store" className="h-12 w-12 mx-auto text-brand-primary" />
          <h2 className="mt-4 text-3xl font-bold text-brand-dark">Seller Login</h2>
          <p className="mt-2 text-gray-600">Enter your password to manage products.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                placeholder="Enter password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-brand-dark"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Icon name="shield-alert" className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginView;
