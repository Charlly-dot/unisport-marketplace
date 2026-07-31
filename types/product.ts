export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  sport: string;
  price: number;
  condition: "New" | "Gently Used";
  rating: number;
  reviewCount: number;
  description: string;
  sizes: string[];
  featured: boolean;
  trending: boolean;
  campusPickup: boolean;
  seller: string;
  stock: number;
  image: string;
  images?: string[];
  features?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string | null;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  pickup: number;
  tax: number;
  discount: number;
  grandTotal: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  averageRating: number;
  itemsSold: number;
  memberSince: string;
  campus: string;
  responseTime: string;
}

export interface Review {
  id: string;
  productId: string;
  studentName: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
  helpful: number;
  verified: boolean;
}
