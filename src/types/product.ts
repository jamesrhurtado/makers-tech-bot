export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  created_at?: string;
}