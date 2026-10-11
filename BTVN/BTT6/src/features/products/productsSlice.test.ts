import { describe, it, expect, vi, beforeEach } from 'vitest';
import productsReducer, {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
  selectProductsError,
} from './productsSlice';
import type { ProductsState } from './productsSlice';
import * as productsApiModule from './productsApi';
import { mockProduct1, mockProductsList } from '../../test/mockData';
import { setupTestStore } from '../../test/test-utils';
import type { RootState } from '../../app/store';

// Mock module productsApi
vi.mock('./productsApi', () => ({
  fetchProductsApi: vi.fn(),
  MOCK_PRODUCTS: [],
}));

describe('productsSlice - Reducer & Async Thunk Tests with Mock API', () => {
  const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('productsReducer sync states', () => {
    it('khởi tạo state mặc định chính xác', () => {
      expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('xử lý fetchProducts.pending chuyển status thành loading', () => {
      const state = productsReducer(initialState, { type: fetchProducts.pending.type });
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('xử lý fetchProducts.fulfilled lưu danh sách sản phẩm và status succeeded', () => {
      const state = productsReducer(initialState, {
        type: fetchProducts.fulfilled.type,
        payload: mockProductsList,
      });
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(mockProductsList);
    });

    it('xử lý fetchProducts.rejected chuyển status thành failed và lưu lỗi', () => {
      const state = productsReducer(initialState, {
        type: fetchProducts.rejected.type,
        payload: 'Lỗi kết nối máy chủ',
      });
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Lỗi kết nối máy chủ');
    });

    it('xử lý fetchProducts.rejected với fallback message khi không có payload', () => {
      const state = productsReducer(initialState, {
        type: fetchProducts.rejected.type,
      });
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Không thể tải danh sách sản phẩm');
    });
  });

  describe('fetchProducts Async Thunk with Mocked API (Test bất đồng bộ)', () => {
    it('gọi API thành công và cập nhật store bất đồng bộ', async () => {
      const store = setupTestStore();
      const mockedFetch = vi.mocked(productsApiModule.fetchProductsApi);
      mockedFetch.mockResolvedValueOnce(mockProductsList);

      const actionPromise = store.dispatch(fetchProducts());
      // Trạng thái lúc đang pending
      expect(store.getState().products.status).toBe('loading');

      await actionPromise;

      // Trạng thái sau khi fulfilled
      const state = store.getState().products;
      expect(mockedFetch).toHaveBeenCalledTimes(1);
      expect(state.status).toBe('succeeded');
      expect(state.items).toHaveLength(mockProductsList.length);
      expect(state.items[0].title).toBe(mockProduct1.title);
    });

    it('gọi API thất bại và cập nhật lỗi vào store bất đồng bộ', async () => {
      const store = setupTestStore();
      const mockedFetch = vi.mocked(productsApiModule.fetchProductsApi);
      mockedFetch.mockRejectedValueOnce(new Error('Network Error 500'));

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(mockedFetch).toHaveBeenCalledTimes(1);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network Error 500');
    });

    it('bắt lỗi không phải instance Error và trả về chuỗi thông báo mặc định', async () => {
      const store = setupTestStore();
      const mockedFetch = vi.mocked(productsApiModule.fetchProductsApi);
      mockedFetch.mockRejectedValueOnce('Some string error');

      await store.dispatch(fetchProducts());

      const state = store.getState().products;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Đã có lỗi xảy ra khi tải sản phẩm');
    });
  });

  describe('Selectors', () => {
    const mockRootState = {
      products: {
        items: mockProductsList,
        status: 'succeeded',
        error: null,
      },
    } as RootState;

    it('selectAllProducts trả về danh sách sản phẩm từ RootState', () => {
      expect(selectAllProducts(mockRootState)).toEqual(mockProductsList);
    });

    it('selectProductsStatus trả về trạng thái tải', () => {
      expect(selectProductsStatus(mockRootState)).toBe('succeeded');
    });

    it('selectProductsError trả về thông báo lỗi', () => {
      expect(selectProductsError(mockRootState)).toBeNull();
    });
  });
});
