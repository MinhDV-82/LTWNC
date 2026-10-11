import type { Product, CartItem } from '../types';

export const mockProduct1: Product = {
  id: 1,
  title: 'iPhone 15 Pro Max 256GB',
  price: 1199,
  description: 'Khung viền titan, chip Apple A17 Pro mạnh mẽ vượt trội.',
  category: 'Điện thoại',
  image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
  rating: { rate: 4.8, count: 240 },
};

export const mockProduct2: Product = {
  id: 2,
  title: 'MacBook Pro 14" M3 Pro',
  price: 1999,
  description: 'Màn hình Liquid Retina XDR 120Hz, chip Apple M3 Pro.',
  category: 'Laptop',
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  rating: { rate: 4.9, count: 180 },
};

export const mockProduct3: Product = {
  id: 3,
  title: 'Sony WH-1000XM5',
  price: 399,
  description: 'Tai nghe chụp tai chống ồn chủ động đỉnh cao.',
  category: 'Âm thanh',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  rating: { rate: 4.7, count: 310 },
};

export const mockProductsList: Product[] = [mockProduct1, mockProduct2, mockProduct3];

export const mockCartItem1: CartItem = {
  product: mockProduct1,
  quantity: 2,
};

export const mockCartItem2: CartItem = {
  product: mockProduct2,
  quantity: 1,
};

export const mockCartItems: CartItem[] = [mockCartItem1, mockCartItem2];

