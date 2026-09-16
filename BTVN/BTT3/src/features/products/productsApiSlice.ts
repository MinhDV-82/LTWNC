import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../types';
import { MOCK_PRODUCTS } from './productsApi';

/**
 * RTK Query Api Service (Điểm cộng)
 * Cung cấp giải pháp quản lý server state tự động với auto-caching, loading & error flags.
 */
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
        try {
          // Giả lập độ trễ mạng
          await new Promise((resolve) => setTimeout(resolve, 700));
          return { data: MOCK_PRODUCTS };
        } catch {
          return { error: { status: 500, data: 'Lỗi khi tải dữ liệu từ RTK Query' } };
        }
      },
      providesTags: ['Product'],
    }),
  }),
});

// Auto-generated hook từ endpoint getProducts
export const { useGetProductsQuery } = productsApi;
