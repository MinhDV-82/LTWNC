/**
 * MODULE QUẢN LÝ ĐƠN HÀNG (Order Management)
 */

// ==========================================
// 1. ENUMS (Định nghĩa trạng thái & phân loại)
// ==========================================

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  COD = "COD",
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  E_WALLET = "E_WALLET",
}

// ==========================================
// 2. BASE ENTITY & GENERIC TYPES
// ==========================================

// Base interface chứa các trường metadata chung của mọi thực thể trong hệ thống
export interface BaseEntity<TId = string> {
  id: TId;
  createdAt: Date;
  updatedAt: Date;
}

// Generic dùng cho phản hồi API chuẩn hóa để bọc danh sách hoặc thực thể
export interface ApiResponse<TData> {
  success: boolean;
  message?: string;
  data: TData;
}

// Generic phân trang chuẩn cho module quản lý
export interface PaginatedResult<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
}

// ==========================================
// 3. CORE ENTITIES
// ==========================================

// Thực thể Khách hàng
export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

// Thực thể Sản phẩm
export interface Product extends BaseEntity {
  name: string;
  sku: string;
  price: number;
  stock: number;
  description?: string;
}

// Thực thể Chi tiết đơn hàng (OrderItem)
// Tách biệt giá snapshot tại thời điểm mua (priceAtPurchase) để tránh ảnh hưởng khi giá Product thay đổi
export interface OrderItem extends BaseEntity {
  productId: string;
  productSnapshot: Pick<Product, "name" | "sku">; // Giữ lại thông tin cố định của sản phẩm
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

// Thực thể Đơn hàng (Order)
// Sử dụng Generic TCustomer để linh hoạt: có thể chỉ lưu CustomerId/Customer tóm tắt hoặc toàn bộ Customer Object
export interface Order<TCustomer = Customer> extends BaseEntity {
  code: string; // Mã đơn hàng (VD: ORD-2026-001)
  customer: TCustomer;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  notes?: string;
}

// ==========================================
// 4. DTOs & UTILITY TYPES
// ==========================================

// Tạo mới Product: Bỏ các trường tự sinh của hệ thống
export type CreateProductDto = Omit<Product, "id" | "createdAt" | "updatedAt">;

// Cập nhật Product: Cho phép cập nhật từng phần thông qua Partial
export type UpdateProductDto = Partial<CreateProductDto>;

// Snapshot Customer ngắn gọn hiển thị trong danh sách Order tóm tắt
export type CustomerSummary = Pick<Customer, "id" | "name" | "phone">;

// Đơn hàng ở màn hình danh sách (Listing) chỉ cần Customer tóm tắt và không cần toàn bộ OrderItem chi tiết
export type OrderSummary = Pick<
  Order<CustomerSummary>,
  "id" | "code" | "customer" | "totalAmount" | "status" | "createdAt"
>;

// DTO khi client gửi yêu cầu tạo đơn hàng:
// Chỉ cần truyền productId và quantity, giá sẽ được tính toán ở Backend
export type CreateOrderItemDto = Pick<OrderItem, "productId" | "quantity">;

export interface CreateOrderDto {
  customerId: string;
  items: CreateOrderItemDto[];
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  notes?: string;
}

// DTO cập nhật trạng thái đơn hàng: Chỉ cho phép sửa trạng thái
export type UpdateOrderStatusDto = Pick<Order, "status">;

// Readonly Type cho lịch sử đơn hàng đã hoàn tất (bất biến, không cho phép chỉnh sửa)
export type CompletedOrderRecord = Readonly<Order>;
