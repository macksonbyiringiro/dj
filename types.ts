
export enum UserRole {
  Seller = 'Seller',
  Buyer = 'Buyer',
}

export type Language = 'en' | 'rw';
export type Currency = 'USD' | 'RWF';

export interface ProductDescription {
  english: string;
  kinyarwanda: string;
}

export interface Product {
  id: string;
  name: string;
  priceUSD: number;
  description: ProductDescription;
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
