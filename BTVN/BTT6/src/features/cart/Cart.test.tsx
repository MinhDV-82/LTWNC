import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cart } from './Cart';
import { mockCartItem1, mockCartItem2 } from '../../test/mockData';
import { renderWithProviders } from '../../test/test-utils';

describe('Cart - Integration Component Tests (RTL)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('hiển thị giao diện giỏ hàng trống khi không có sản phẩm', () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText('Giỏ hàng của bạn đang trống')).toBeInTheDocument();
    expect(
      screen.getByText('Hãy thêm các sản phẩm công nghệ yêu thích vào giỏ hàng ngay nhé!')
    ).toBeInTheDocument();
  });

  it('nhấn nút "Khám phá sản phẩm" kích hoạt callback onContinueShopping khi giỏ hàng trống', async () => {
    const handleContinueShopping = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<Cart onContinueShopping={handleContinueShopping} />);

    const continueBtn = screen.getByRole('button', { name: /Khám phá sản phẩm/i });
    await user.click(continueBtn);

    expect(handleContinueShopping).toHaveBeenCalledTimes(1);
  });

  it('hiển thị danh sách sản phẩm và tóm tắt thanh toán khi giỏ có hàng', () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: [mockCartItem1, mockCartItem2] },
      },
    });

    expect(screen.getByText('Giỏ Hàng Của Bạn')).toBeInTheDocument();
    // 2 mặt hàng, tổng số lượng: 2 + 1 = 3
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(mockCartItem1.product.title)).toBeInTheDocument();
    expect(screen.getByText(mockCartItem2.product.title)).toBeInTheDocument();
    expect(screen.getByText('Tóm Tắt Đơn Hàng')).toBeInTheDocument();
    expect(screen.getByText('Miễn phí')).toBeInTheDocument();
  });

  it('nhấn nút "Xoá tất cả" yêu cầu xác nhận và xoá sạch giỏ hàng khi người dùng đồng ý', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { store } = renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const clearBtn = screen.getByRole('button', { name: /Xoá tất cả/i });
    await user.click(clearBtn);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('nhấn nút "Xoá tất cả" nhưng huỷ xác nhận thì không xoá giỏ hàng', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    const { store } = renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const clearBtn = screen.getByRole('button', { name: /Xoá tất cả/i });
    await user.click(clearBtn);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().cart.items).toHaveLength(1);
  });

  it('nhấn "Tiến hành thanh toán" hiển thị thông báo alert và reset giỏ hàng', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { store } = renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const checkoutBtn = screen.getByRole('button', { name: /Tiến hành thanh toán/i });
    await user.click(checkoutBtn);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining('Đặt hàng thành công')
    );
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it('nhấn "← Tiếp tục mua sắm" khi giỏ hàng có sản phẩm', async () => {
    const handleContinueShopping = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<Cart onContinueShopping={handleContinueShopping} />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const continueBtn = screen.getByRole('button', { name: /← Tiếp tục mua sắm/i });
    await user.click(continueBtn);

    expect(handleContinueShopping).toHaveBeenCalledTimes(1);
  });
});

