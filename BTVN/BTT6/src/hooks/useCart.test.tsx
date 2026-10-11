import type { PropsWithChildren } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useCart } from './useCart';
import { setupTestStore } from '../test/test-utils';
import { mockProduct1, mockProduct2 } from '../test/mockData';

describe('useCart - Custom Hook Unit Tests', () => {
  const createWrapper = () => {
    const store = setupTestStore();
    const Wrapper = ({ children }: PropsWithChildren) => (
      <Provider store={store}>{children}</Provider>
    );
    return { store, Wrapper };
  };

  it('khởi tạo giá trị mặc định khi giỏ hàng trống', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.isCartEmpty).toBe(true);
  });

  it('thêm sản phẩm vào giỏ và cập nhật đầy đủ trạng thái', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper });

    act(() => {
      result.current.addToCart(mockProduct1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.totalPrice).toBe(mockProduct1.price);
    expect(result.current.isCartEmpty).toBe(false);
  });

  it('cập nhật số lượng của sản phẩm', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper });

    act(() => {
      result.current.addToCart(mockProduct1);
    });

    act(() => {
      result.current.updateQuantity(mockProduct1.id, 4);
    });

    expect(result.current.totalCount).toBe(4);
    expect(result.current.totalPrice).toBe(mockProduct1.price * 4);
  });

  it('xoá sản phẩm khỏi giỏ hàng', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper });

    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct2);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeFromCart(mockProduct1.id);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(mockProduct2.id);
  });

  it('xoá sạch giỏ hàng với clearCart', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(), { wrapper: Wrapper });

    act(() => {
      result.current.addToCart(mockProduct1);
      result.current.addToCart(mockProduct2);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.isCartEmpty).toBe(true);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });
});
