import type { Product } from '../../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB',
    price: 1199,
    description: 'Khung viền titan, chip Apple A17 Pro mạnh mẽ vượt trội, camera tele 5x siêu sắc nét.',
    category: 'Điện thoại',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60',
    rating: { rate: 4.8, count: 240 }
  },
  {
    id: 2,
    title: 'MacBook Pro 14" M3 Pro',
    price: 1999,
    description: 'Màn hình Liquid Retina XDR 120Hz, chip Apple M3 Pro 18GB RAM, pin lên đến 18 giờ liên tục.',
    category: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    rating: { rate: 4.9, count: 180 }
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5',
    price: 399,
    description: 'Tai nghe chụp tai chống ồn chủ động đỉnh cao, âm thanh Hi-Res chất lượng phòng thu.',
    category: 'Âm thanh',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    rating: { rate: 4.7, count: 310 }
  },
  {
    id: 4,
    title: 'Bàn phím cơ Keychron Q1 Pro',
    price: 199,
    description: 'Bàn phím cơ custom vỏ nhôm CNC nguyên khối, kết nối Bluetooth/Type-C, hotswap linh hoạt.',
    category: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    rating: { rate: 4.6, count: 95 }
  },
  {
    id: 5,
    title: 'Apple Watch Ultra 2',
    price: 799,
    description: 'Đồng hồ thể thao chuyên nghiệp với vỏ titan 49mm, định vị GPS tần số kép, pin cực trâu.',
    category: 'Đồng hồ thông minh',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    rating: { rate: 4.9, count: 150 }
  },
  {
    id: 6,
    title: 'Chuột Logitech MX Master 3S',
    price: 99,
    description: 'Cảm biến 8K DPI trên mọi bề mặt, nút cuộn siêu tốc MagSpeed, nhấp chuột êm ái Quiet Clicks.',
    category: 'Phụ kiện',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60',
    rating: { rate: 4.8, count: 420 }
  }
];

export const fetchProductsApi = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 700);
  });
};
