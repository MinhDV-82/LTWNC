export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Tai nghe Nova Pro",
    category: "Âm thanh",
    price: 1290000,
    description:
      "Âm thanh chi tiết, chống ồn chủ động và thời lượng pin cả ngày.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 2,
    name: "Bàn phím Keychron K2",
    category: "Phụ kiện",
    price: 1890000,
    description: "Bàn phím cơ gọn gàng cho góc làm việc, kết nối đa thiết bị.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 3,
    name: "Đèn bàn Orbit",
    category: "Không gian",
    price: 790000,
    description: "Ánh sáng dịu, thân đèn xoay linh hoạt và thiết kế tối giản.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 4,
    name: "Máy ảnh Fujifilm X-T5",
    category: "Nhiếp ảnh",
    price: 35900000,
    description:
      "Thân máy nhỏ gọn, màu ảnh đặc trưng và cảm biến độ phân giải cao.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 5,
    name: "Đồng hồ Field 38",
    category: "Phong cách",
    price: 2490000,
    description: "Mặt số dễ đọc, dây vải bền và phong thái cổ điển hàng ngày.",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=85",
  },
  {
    id: 6,
    name: "Balo Metro Pack",
    category: "Di chuyển",
    price: 1590000,
    description:
      "Ngăn laptop riêng, chống nước nhẹ và vừa đủ cho một ngày bận rộn.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=85",
  },
];
