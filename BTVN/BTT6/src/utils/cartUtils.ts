import type { CartItem } from '../types';

/**
 * Định dạng số tiền sang chuẩn USD ($1,234 hoặc $1,234.56)
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount < 0) {
    return '$0';
  }
  return `$${amount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Tính tổng tiền của 1 mục sản phẩm (đơn giá * số lượng)
 */
export function calculateItemSubtotal(price: number, quantity: number): number {
  if (price < 0 || quantity < 0) return 0;
  return Math.round(price * quantity * 100) / 100;
}

/**
 * Hợp lệ hóa số lượng sản phẩm nhập vào (phải là số nguyên từ 1 đến 99)
 */
export function validateQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 1;
  }
  if (quantity > 99) {
    return 99;
  }
  return Math.floor(quantity);
}

/**
 * Áp dụng mã giảm giá
 * - GIAM10: giảm 10%
 * - FREESHIP: miễn phí vận chuyển
 * - VIP20: giảm 20%
 */
export function applyCouponCode(
  code: string,
  subtotal: number
): { discount: number; isValid: boolean; message: string } {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return { discount: 0, isValid: false, message: 'Vui lòng nhập mã giảm giá' };
  }

  if (subtotal <= 0) {
    return { discount: 0, isValid: false, message: 'Giỏ hàng đang trống' };
  }

  switch (normalizedCode) {
    case 'GIAM10':
      return {
        discount: Math.round(subtotal * 0.1 * 100) / 100,
        isValid: true,
        message: 'Áp dụng mã giảm giá 10% thành công',
      };
    case 'VIP20':
      return {
        discount: Math.round(subtotal * 0.2 * 100) / 100,
        isValid: true,
        message: 'Áp dụng mã VIP giảm 20% thành công',
      };
    case 'FREESHIP':
      return {
        discount: 0,
        isValid: true,
        message: 'Áp dụng miễn phí vận chuyển thành công',
      };
    default:
      return {
        discount: 0,
        isValid: false,
        message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
      };
  }
}

/**
 * Tính toán toàn bộ thông số đơn hàng giỏ hàng
 */
export function calculateCartTotals(
  items: CartItem[],
  couponCode = ''
): {
  totalCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  finalTotal: number;
} {
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + calculateItemSubtotal(item.product.price, item.quantity),
    0
  );

  const couponResult = applyCouponCode(couponCode, subtotal);
  const discount = couponResult.isValid ? couponResult.discount : 0;

  // Free shipping nếu tổng đơn >= $500 hoặc áp mã FREESHIP, ngược lại $25
  const isFreeShip =
    subtotal === 0 ||
    subtotal >= 500 ||
    couponCode.trim().toUpperCase() === 'FREESHIP';
  const shippingFee = isFreeShip ? 0 : 25;

  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  return {
    totalCount,
    subtotal,
    discount,
    shippingFee,
    finalTotal,
  };
}

