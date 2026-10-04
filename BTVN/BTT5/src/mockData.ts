import type { Product, InventoryStats } from './types';

export const CATEGORIES = [
  'Tất cả danh mục',
  'Điện thoại & Tablet',
  'Laptop & Máy tính',
  'Tai nghe & Âm thanh',
  'Đồng hồ thông minh',
  'Phụ kiện công nghệ',
  'Màn hình hiển thị',
  'Bàn phím cơ & Chuột',
  'Thiết bị Smarthome',
] as const;

export const BRANDS = [
  'Tất cả thương hiệu',
  'Apple',
  'Samsung',
  'Sony',
  'Asus',
  'Logitech',
  'Xiaomi',
  'Dell',
  'Keychron',
  'Anker',
  'LG',
  'Garmin',
  'Razer',
];

const PRODUCT_PREFIXES: Record<string, string[]> = {
  'Điện thoại & Tablet': [
    'iPhone 16 Pro Max',
    'Samsung Galaxy S24 Ultra',
    'iPad Pro M4',
    'Xiaomi 14 Ultra',
    'Google Pixel 9 Pro',
    'iPad Air M2',
    'Galaxy Z Fold 6',
    'Oppo Find X7',
  ],
  'Laptop & Máy tính': [
    'MacBook Pro 14 M3',
    'Dell XPS 15 OLED',
    'Asus ROG Zephyrus G16',
    'ThinkPad X1 Carbon Gen 12',
    'MacBook Air 15 M3',
    'HP Spectre x360',
    'Acer Predator Helios',
    'Lenovo Legion Pro 7',
  ],
  'Tai nghe & Âm thanh': [
    'Sony WH-1000XM5',
    'AirPods Pro 2 MagSafe',
    'Bose QuietComfort Ultra',
    'Sennheiser Momentum 4',
    'JBL Charge 5 Wi-Fi',
    'Marshall Stanmore III',
    'Bang & Olufsen Beosound',
    'Sony WF-1000XM5',
  ],
  'Đồng hồ thông minh': [
    'Apple Watch Ultra 2',
    'Samsung Galaxy Watch 7',
    'Garmin Fenix 8 Solar',
    'Garmin Forerunner 965',
    'Apple Watch Series 10',
    'Huawei Watch Ultimate',
    'Amazfit T-Rex 3',
  ],
  'Phụ kiện công nghệ': [
    'Củ sạc nhanh GaN 65W 3 cổng',
    'Cáp Type-C Thunderbolt 4 240W',
    'Pin sạc dự phòng 25.000mAh 100W',
    'Hub Chuyển Đổi Type-C 9 in 1 4K',
    'Giá đỡ laptop nhôm tản nhiệt 360',
    'Đế sạc không dây 3 in 1 MagSafe',
  ],
  'Màn hình hiển thị': [
    'Màn hình Dell UltraSharp 27 4K IPS',
    'Màn hình Asus ROG Swift OLED 32',
    'Màn hình LG UltraFine 32 4K Nano IPS',
    'Màn hình Samsung Odyssey Neo G9 49',
    'Màn hình Gigabyte M28U 4K 144Hz',
  ],
  'Bàn phím cơ & Chuột': [
    'Bàn phím cơ không dây Keychron Q1 Pro',
    'Chuột không dây Logitech MX Master 3S',
    'Bàn phím cơ Razer BlackWidow V4 Pro',
    'Chuột gaming Logitech G Pro X Superlight 2',
    'Bàn phím custom Akko MOD007B HE',
    'Chuột Razer Viper V3 Pro 8K',
  ],
  'Thiết bị Smarthome': [
    'Camera an ninh thông minh 2K xoay 360',
    'Robot hút bụi lau nhà Roborock S8 Pro',
    'Khóa cửa thông minh vân tay Aqara A100',
    'Đèn thông minh Philips Hue Gradient Lightstrip',
    'Cảm biến nhiệt độ độ ẩm Matter Zigbee',
  ],
};

const SUFFIXES = [
  'Phiên bản Quốc Tế',
  'Chính hãng VN/A',
  'Bản Giới Hạn Titanium',
  'Bản Doanh Nghiệp',
  'New 100% Fullbox',
  'Bảo hành 24 tháng',
  'Màu Đen Nhám',
  'Màu Trắng Bạc',
  'Màu Xanh Titan',
  'Màu Xám Không Gian',
];

const TAG_POOL = [
  'Flash Sale',
  'Bán chạy nhất',
  'Hàng mới về',
  'Giảm giá sốc',
  'Giao nhanh 2h',
  'Chính hãng 100%',
  'Độc quyền',
  'Free ship',
  'Trả góp 0%',
];

export function generateProducts(total = 10000): Product[] {
  const products: Product[] = [];
  products.length = total;
  const categoriesList = CATEGORIES.slice(1);
  const brandsList = BRANDS.slice(1);

  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < total; i++) {
    const id = i + 1;
    const catIndex = Math.floor(pseudoRandom() * categoriesList.length);
    const category = categoriesList[catIndex];
    const brand = brandsList[Math.floor(pseudoRandom() * brandsList.length)];

    const prefixPool = PRODUCT_PREFIXES[category] || ['Sản phẩm công nghệ cao'];
    const prefix = prefixPool[Math.floor(pseudoRandom() * prefixPool.length)];
    const suffix = SUFFIXES[Math.floor(pseudoRandom() * SUFFIXES.length)];

    const name = `${prefix} #${id.toString().padStart(5, '0')} - ${suffix}`;

    const basePrice = Math.floor(150000 + pseudoRandom() * 44850000);
    const roundedPrice = Math.round(basePrice / 10000) * 10000;
    const discountMultiplier = 1 + Math.floor(pseudoRandom() * 30) / 100;
    const originalPrice = Math.round((roundedPrice * discountMultiplier) / 10000) * 10000;

    const rating = Math.round((3.2 + pseudoRandom() * 1.8) * 10) / 10;
    const reviewsCount = Math.floor(pseudoRandom() * 1200);

    const stock = Math.floor(pseudoRandom() * 250);

    const tagCount = 1 + Math.floor(pseudoRandom() * 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = TAG_POOL[Math.floor(pseudoRandom() * TAG_POOL.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    const sku = `SKU-${category.slice(0, 2).toUpperCase()}-${id.toString().padStart(6, '0')}`;

    products[i] = {
      id,
      sku,
      name,
      category,
      brand,
      price: roundedPrice,
      originalPrice,
      rating,
      reviewsCount,
      stock,
      tags,
      description: `Sản phẩm ${name} mang đến hiệu suất vượt trội, thiết kế sang trọng hiện đại. Được phân phối chính hãng bởi ${brand} với chế độ hậu mãi chu đáo.`,
      updatedAt: '2026-10-01',
    };
  }

  return products;
}

export const initialProductsDataset = generateProducts(10000);

export function calculateInventoryStats(products: Product[], simulateHeavyWork = false): InventoryStats {
  if (simulateHeavyWork) {
    let dummySum = 0;
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < 30; j++) {
        dummySum += Math.sqrt((products[i].price * (j + 1)) % 1000000);
      }
    }
    if (dummySum === -1) console.log(dummySum);
  }

  let totalStockUnits = 0;
  let totalValueVND = 0;
  let totalRating = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  const categoryCounts: Record<string, number> = {};

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    totalStockUnits += p.stock;
    totalValueVND += p.price * p.stock;
    totalRating += p.rating;

    if (p.stock === 0) {
      outOfStockCount++;
    } else if (p.stock < 15) {
      lowStockCount++;
    }

    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }

  const totalCount = products.length;
  const avgPriceVND = totalCount > 0 ? Math.round(totalValueVND / (totalStockUnits || 1)) : 0;
  const avgRating = totalCount > 0 ? Math.round((totalRating / totalCount) * 10) / 10 : 0;

  return {
    totalCount,
    totalStockUnits,
    totalValueVND,
    avgPriceVND,
    avgRating,
    lowStockCount,
    outOfStockCount,
    categoryCounts,
  };
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
