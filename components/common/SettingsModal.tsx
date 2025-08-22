import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Language, Currency } from '../../types';
import { Icon } from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSellerAuthenticated: boolean;
  currentPassword: string;
  onPasswordChange: (newPassword: string) => void;
  onGenerateBackground: (prompt: string) => Promise<boolean>;
  isGeneratingBackground: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  isSellerAuthenticated,
  currentPassword,
  onPasswordChange,
  onGenerateBackground,
  isGeneratingBackground
}) => {
  const { settings, setSettings } = useSettings();
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [backgroundPrompt, setBackgroundPrompt] = useState('');
  const [backgroundSuccess, setBackgroundSuccess] = useState('');
  const [backgroundError, setBackgroundError] = useState('');

  useEffect(() => {
    if (!isOpen) {
        // Reset form when modal closes
        setCurrentPasswordInput('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setPasswordSuccess('');
        setBackgroundPrompt('');
        setBackgroundSuccess('');
        setBackgroundError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleLanguageChange = (lang: Language) => {
    setSettings(s => ({ ...s, language: lang }));
  };

  const handleCurrencyChange = (curr: Currency) => {
    setSettings(s => ({ ...s, currency: curr }));
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (currentPasswordInput !== currentPassword) {
      setPasswordError('Current password does not match.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    onPasswordChange(newPassword);
    setPasswordSuccess('Password updated successfully!');
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const handleBackgroundGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backgroundPrompt.trim()) {
      setBackgroundError('Please enter a description for the background.');
      return;
    }
    setBackgroundError('');
    setBackgroundSuccess('');
    
    const success = await onGenerateBackground(backgroundPrompt);
    if (success) {
      setBackgroundSuccess('Background updated successfully!');
      setBackgroundPrompt('');
      setTimeout(() => setBackgroundSuccess(''), 3000);
    } else {
      setBackgroundError('Failed to generate background. Please try again.');
      setTimeout(() => setBackgroundError(''), 5000);
    }
  };


  const ToggleButton = ({ value, selectedValue, onChange, children }) => {
      const isSelected = value === selectedValue;
      return (
          <button
            onClick={() => onChange(value)}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                isSelected ? 'bg-brand-primary text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {children}
          </button>
      )
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-6 relative transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close settings"
        >
            <Icon name="close" className="h-6 w-6" />
        </button>

        <div className="flex items-center mb-6">
            <Icon name="settings" className="h-8 w-8 text-brand-primary" />
            <h2 className="ml-3 text-2xl font-bold text-brand-dark">Settings</h2>
        </div>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Language</label>
                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                    <ToggleButton value="en" selectedValue={settings.language} onChange={handleLanguageChange}>English</ToggleButton>
                    <ToggleButton value="rw" selectedValue={settings.language} onChange={handleLanguageChange}>Kinyarwanda</ToggleButton>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Currency</label>
                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                    <ToggleButton value="USD" selectedValue={settings.currency} onChange={handleCurrencyChange}>USD ($)</ToggleButton>
                    <ToggleButton value="RWF" selectedValue={settings.currency} onChange={handleCurrencyChange}>RWF (Fr)</ToggleButton>
                </div>
            </div>

            {isSellerAuthenticated && (
                <>
                    <hr className="border-gray-200" />
                    <div>
                        <div className="flex items-center mb-4">
                            <Icon name="key" className="h-6 w-6 text-brand-dark" />
                            <h3 className="ml-2 text-lg font-medium text-gray-800">Change Password</h3>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" value={currentPasswordInput} onChange={e => setCurrentPasswordInput(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" required />
                            </div>
                            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                            {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
                                Update Password
                            </button>
                        </form>
                    </div>
                    <hr className="border-gray-200" />
                    <div>
                        <div className="flex items-center mb-4">
                            <Icon name="image" className="h-6 w-6 text-brand-dark" />
                            <h3 className="ml-2 text-lg font-medium text-gray-800">Customize Background</h3>
                        </div>
                        <form onSubmit={handleBackgroundGeneration} className="space-y-4">
                            <div>
                                <label htmlFor="bg-prompt" className="block text-sm font-medium text-gray-700">Background Description</label>
                                <textarea
                                  id="bg-prompt"
                                  value={backgroundPrompt}
                                  onChange={e => setBackgroundPrompt(e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                                  rows={3}
                                  placeholder="e.g., A vibrant African market with colorful fabrics and spices."
                                  required
                                />
                            </div>
                            {backgroundError && <p className="text-sm text-red-600">{backgroundError}</p>}
                            {backgroundSuccess && <p className="text-sm text-green-600">{backgroundSuccess}</p>}
                            <button
                              type="submit"
                              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                              disabled={isGeneratingBackground}
                            >
                              {isGeneratingBackground ? (
                                <>
                                  <Icon name="loader" className="h-5 w-5 mr-2" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Icon name="generate" className="h-5 w-5 mr-2" />
                                  Generate New Background
                                </>
                              )}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
        
         <div className="mt-8 text-center">
            <button
                onClick={onClose}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
