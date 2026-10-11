import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  calculateItemSubtotal,
  validateQuantity,
  applyCouponCode,
  calculateCartTotals,
} from './cartUtils';
import { mockCartItem1, mockCartItem2 } from '../test/mockData';

describe('cartUtils - Unit Tests', () => {
  describe('formatCurrency', () => {
    it('định dạng số tiền dương chính xác sang chuẩn USD', () => {
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('trả về $0 khi số tiền là số âm hoặc NaN', () => {
      expect(formatCurrency(-50)).toBe('$0');
      expect(formatCurrency(NaN)).toBe('$0');
    });
  });

  describe('calculateItemSubtotal', () => {
    it('tính đúng tổng tiền từng sản phẩm (price * quantity)', () => {
      expect(calculateItemSubtotal(100, 3)).toBe(300);
      expect(calculateItemSubtotal(19.99, 2)).toBe(39.98);
    });

    it('trả về 0 nếu giá tiền hoặc số lượng nhỏ hơn 0', () => {
      expect(calculateItemSubtotal(-10, 2)).toBe(0);
      expect(calculateItemSubtotal(10, -2)).toBe(0);
      expect(calculateItemSubtotal(-10, -2)).toBe(0);
    });
  });

  describe('validateQuantity', () => {
    it('giữ nguyên số lượng hợp lệ trong khoảng 1 đến 99', () => {
      expect(validateQuantity(5)).toBe(5);
      expect(validateQuantity(1)).toBe(1);
      expect(validateQuantity(99)).toBe(99);
    });

    it('làm tròn xuống nếu là số thập phân', () => {
      expect(validateQuantity(4.9)).toBe(4);
    });

    it('trả về 1 nếu số lượng <= 0 hoặc không phải số hữu hạn', () => {
      expect(validateQuantity(0)).toBe(1);
      expect(validateQuantity(-10)).toBe(1);
      expect(validateQuantity(Infinity)).toBe(1);
      expect(validateQuantity(NaN)).toBe(1);
    });

    it('giới hạn tối đa 99 sản phẩm', () => {
      expect(validateQuantity(150)).toBe(99);
    });
  });

  describe('applyCouponCode', () => {
    it('báo lỗi khi mã rỗng hoặc chỉ có khoảng trắng', () => {
      const res = applyCouponCode('   ', 200);
      expect(res.isValid).toBe(false);
      expect(res.discount).toBe(0);
      expect(res.message).toBe('Vui lòng nhập mã giảm giá');
    });

    it('báo lỗi khi giỏ hàng đang trống (subtotal <= 0)', () => {
      const res = applyCouponCode('GIAM10', 0);
      expect(res.isValid).toBe(false);
      expect(res.message).toBe('Giỏ hàng đang trống');
    });

    it('áp dụng thành công mã GIAM10 (giảm 10%)', () => {
      const res = applyCouponCode('giam10', 500);
      expect(res.isValid).toBe(true);
      expect(res.discount).toBe(50);
      expect(res.message).toBe('Áp dụng mã giảm giá 10% thành công');
    });

    it('áp dụng thành công mã VIP20 (giảm 20%)', () => {
      const res = applyCouponCode('VIP20', 1000);
      expect(res.isValid).toBe(true);
      expect(res.discount).toBe(200);
      expect(res.message).toContain('giảm 20%');
    });

    it('áp dụng thành công mã FREESHIP', () => {
      const res = applyCouponCode('freeship', 300);
      expect(res.isValid).toBe(true);
      expect(res.discount).toBe(0);
      expect(res.message).toContain('miễn phí vận chuyển');
    });

    it('báo lỗi với mã không tồn tại', () => {
      const res = applyCouponCode('INVALID_CODE', 500);
      expect(res.isValid).toBe(false);
      expect(res.discount).toBe(0);
      expect(res.message).toBe('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    });
  });

  describe('calculateCartTotals', () => {
    it('tính toán chính xác giỏ hàng trống', () => {
      const totals = calculateCartTotals([]);
      expect(totals.totalCount).toBe(0);
      expect(totals.subtotal).toBe(0);
      expect(totals.shippingFee).toBe(0);
      expect(totals.finalTotal).toBe(0);
    });

    it('tính đúng tổng số lượng, tạm tính và miễn phí ship khi đơn hàng >= $500', () => {
      // mockCartItem1: price 1199, qty 2 => subtotal 2398 >= 500 => free ship
      const totals = calculateCartTotals([mockCartItem1]);
      expect(totals.totalCount).toBe(2);
      expect(totals.subtotal).toBe(2398);
      expect(totals.shippingFee).toBe(0);
      expect(totals.finalTotal).toBe(2398);
    });

    it('tính phí vận chuyển $25 khi đơn hàng < $500', () => {
      const cheapItem = {
        product: { ...mockCartItem1.product, price: 100 },
        quantity: 1,
      };
      const totals = calculateCartTotals([cheapItem]);
      expect(totals.subtotal).toBe(100);
      expect(totals.shippingFee).toBe(25);
      expect(totals.finalTotal).toBe(125);
    });

    it('tính phí vận chuyển $0 khi áp dụng mã FREESHIP cho đơn < $500', () => {
      const cheapItem = {
        product: { ...mockCartItem1.product, price: 100 },
        quantity: 1,
      };
      const totals = calculateCartTotals([cheapItem], 'FREESHIP');
      expect(totals.shippingFee).toBe(0);
      expect(totals.finalTotal).toBe(100);
    });

    it('tính đúng tổng tiền sau khi trừ giảm giá coupon', () => {
      // Subtotal: 1199*2 + 1999*1 = 2398 + 1999 = 4397
      const totals = calculateCartTotals([mockCartItem1, mockCartItem2], 'GIAM10');
      expect(totals.discount).toBe(439.7);
      expect(totals.finalTotal).toBe(4397 - 439.7);
    });
  });
});
