export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  category_id: number | null;
  created_at: string;
  image_url: string;
  is_active: boolean;
  min_stock_level: number;
  stock_quantity: number;
  updated_at: string;
}
