import { useState } from "react";
import { products, type Product } from "./data";
import { useFavoritesStore } from "./favoritesStore";
import "./App.css";

type View = "all" | "favorites";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

function ProductCard({ product }: { product: Product }) {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = favoriteIds.includes(product.id);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <button
          type="button"
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => toggleFavorite(product.id)}
          aria-label={
            isFavorite
              ? `Bỏ ${product.name} khỏi yêu thích`
              : `Thêm ${product.name} vào yêu thích`
          }
          aria-pressed={isFavorite}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      <div className="product-content">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <strong className="product-price">{formatPrice(product.price)}</strong>
      </div>
    </article>
  );
}

function App() {
  const [view, setView] = useState<View>("all");
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );
  const visibleProducts = view === "favorites" ? favoriteProducts : products;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-mark" aria-label="Mộc Store">
            <span className="brand-symbol">M</span>
            <div>
              <p className="eyebrow">BTT4 / ZUSTAND</p>
              <h1>Mộc Store</h1>
            </div>
          </div>
          <div className="header-note">Những món đồ đáng giữ lại</div>
        </div>
      </header>

      <main className="main-content">
        <section className="intro">
          <div>
            <p className="eyebrow">Bộ sưu tập chọn lọc</p>
            <h2>Danh sách sản phẩm yêu thích</h2>
            <p className="intro-copy">
              Lưu lại những món đồ bạn muốn quay lại xem sau.
            </p>
          </div>
          <div className="stats" aria-label="Thống kê sản phẩm">
            <span className="stats-number">{favoriteIds.length}</span>
            <span>đã lưu</span>
          </div>
        </section>

        <div className="toolbar">
          <div className="tabs" role="tablist" aria-label="Bộ lọc sản phẩm">
            <button
              type="button"
              role="tab"
              aria-selected={view === "all"}
              className={view === "all" ? "active" : ""}
              onClick={() => setView("all")}
            >
              Tất cả <span>{products.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "favorites"}
              className={view === "favorites" ? "active" : ""}
              onClick={() => setView("favorites")}
            >
              Yêu thích <span>{favoriteIds.length}</span>
            </button>
          </div>
          {favoriteIds.length > 0 && (
            <button
              type="button"
              className="clear-button"
              onClick={clearFavorites}
            >
              Xóa tất cả yêu thích
            </button>
          )}
        </div>

        {visibleProducts.length > 0 ? (
          <section className="product-grid" aria-label="Danh sách sản phẩm">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <span className="empty-star">☆</span>
            <h3>Chưa có sản phẩm yêu thích</h3>
            <p>
              Nhấn vào biểu tượng ngôi sao trên sản phẩm để lưu lại lựa chọn của
              bạn.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setView("all")}
            >
              Xem sản phẩm
            </button>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p>
          <strong>LTWNC - Bài tập tuần 4: Zustand</strong>
        </p>
        <p>
          State cục bộ được quản lý bằng một store riêng, không cần Provider.
        </p>
      </footer>
    </div>
  );
}

export default App;
