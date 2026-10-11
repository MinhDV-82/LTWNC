import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
} from './cartSlice';
import type { CartState } from './cartSlice';
import { mockProduct1, mockProduct2 } from '../../test/mockData';
import type { RootState } from '../../app/store';

describe('cartSlice - Reducer & Selectors Unit Tests', () => {
  const initialState: CartState = {
    items: [],
  };

  it('khởi tạo state ban đầu là giỏ hàng trống', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  describe('addToCart', () => {
    it('thêm sản phẩm mới vào giỏ hàng với số lượng là 1', () => {
      const state = cartReducer(initialState, addToCart(mockProduct1));
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({
        product: mockProduct1,
        quantity: 1,
      });
    });

    it('tăng số lượng thêm 1 nếu sản phẩm đã tồn tại trong giỏ', () => {
      const prevState: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
      };
      const state = cartReducer(prevState, addToCart(mockProduct1));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('thêm nhiều sản phẩm khác nhau vào giỏ hàng', () => {
      let state = cartReducer(initialState, addToCart(mockProduct1));
      state = cartReducer(state, addToCart(mockProduct2));
      expect(state.items).toHaveLength(2);
      expect(state.items[0].product.id).toBe(mockProduct1.id);
      expect(state.items[1].product.id).toBe(mockProduct2.id);
    });
  });

  describe('removeFromCart', () => {
    it('xoá sản phẩm theo ID khỏi giỏ hàng', () => {
      const prevState: CartState = {
        items: [
          { product: mockProduct1, quantity: 1 },
          { product: mockProduct2, quantity: 2 },
        ],
      };
      const state = cartReducer(prevState, removeFromCart(mockProduct1.id));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product.id).toBe(mockProduct2.id);
    });

    it('không thay đổi nếu ID cần xoá không có trong giỏ hàng', () => {
      const prevState: CartState = {
        items: [{ product: mockProduct1, quantity: 1 }],
      };
      const state = cartReducer(prevState, removeFromCart(999));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('cập nhật số lượng mới cho sản phẩm có trong giỏ', () => {
      const prevState: CartState = {
        items: [{ product: mockProduct1, quantity: 1 }],
      };
      const state = cartReducer(
        prevState,
        updateQuantity({ id: mockProduct1.id, quantity: 5 })
      );
      expect(state.items[0].quantity).toBe(5);
    });

    it('xoá sản phẩm khỏi giỏ hàng nếu số lượng cập nhật <= 0', () => {
      const prevState: CartState = {
        items: [{ product: mockProduct1, quantity: 3 }],
      };
      const state = cartReducer(
        prevState,
        updateQuantity({ id: mockProduct1.id, quantity: 0 })
      );
      expect(state.items).toHaveLength(0);
    });

    it('không làm gì nếu sản phẩm không tồn tại khi updateQuantity > 0', () => {
      const prevState: CartState = {
        items: [{ product: mockProduct1, quantity: 3 }],
      };
      const state = cartReducer(
        prevState,
        updateQuantity({ id: 999, quantity: 5 })
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('xoá toàn bộ sản phẩm trong giỏ hàng về mảng rỗng', () => {
      const prevState: CartState = {
        items: [
          { product: mockProduct1, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ],
      };
      const state = cartReducer(prevState, clearCart());
      expect(state.items).toEqual([]);
    });
  });

  describe('Selectors', () => {
    const mockRootState = {
      cart: {
        items: [
          { product: mockProduct1, quantity: 2 }, // 1199 * 2 = 2398
          { product: mockProduct2, quantity: 1 }, // 1999 * 1 = 1999
        ],
      },
    } as RootState;

    it('selectCartItems trả về danh sách các mặt hàng', () => {
      expect(selectCartItems(mockRootState)).toHaveLength(2);
    });

    it('selectCartTotalCount tính tổng số lượng sản phẩm', () => {
      expect(selectCartTotalCount(mockRootState)).toBe(3);
    });

    it('selectCartTotalPrice tính tổng giá trị toàn bộ sản phẩm', () => {
      expect(selectCartTotalPrice(mockRootState)).toBe(4397);
    });
  });
});
