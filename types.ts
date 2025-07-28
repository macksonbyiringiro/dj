
export enum UserRole {
  Seller = 'Seller',
  Buyer = 'Buyer',
}

export interface ProductDescription {
  english: string;
  kinyarwanda: string;
}

export interface Product {
  id: string;
  name: string;
  priceUSD: number;
  description: ProductDescription;
}
