import { useState } from 'react';
import { useAppSelector } from './app/hooks';
import { selectCartTotalCount } from './features/cart/cartSlice';
import { ProductList } from './features/products/ProductList';
import { Cart } from './features/cart/Cart';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');
  const totalCartCount = useAppSelector(selectCartTotalCount);

  return (
    <div className="app-layout">
      {/* Header Bar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => setActiveTab('products')}>
            <span className="brand-logo">⚡</span>
            <div>
              <h1 className="brand-title">TechStore</h1>
              <span className="brand-subtitle">Redux Toolkit Cart Module</span>
            </div>
          </div>

          <nav className="nav-actions">
            <button
              className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Sản phẩm
            </button>

            <button
              className={`nav-btn cart-nav-btn ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => setActiveTab('cart')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Giỏ hàng
              {totalCartCount > 0 && (
                <span className="badge-count animate-pop">
                  {totalCartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {activeTab === 'products' ? (
            <ProductList />
          ) : (
            <Cart onContinueShopping={() => setActiveTab('products')} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>
            <strong>LTWNC - Bài tập tuần 3: Redux Toolkit</strong> • Feature-based Architecture
          </p>
          <p className="footer-subtext">
            Xây dựng với React 19, TypeScript, Redux Toolkit (Slices, createAsyncThunk, Typed Hooks, RTK Query)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
