import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import { productsApi } from '../features/products/productsApiSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    // Thêm reducer của RTK Query
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Infer các kiểu `RootState` và `AppDispatch` từ chính store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
