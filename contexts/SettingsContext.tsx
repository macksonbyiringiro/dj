import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language, Currency } from '../types';

interface Settings {
  language: Language;
  currency: Currency;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const defaultSettings: Settings = {
  language: 'en',
  currency: 'USD',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
