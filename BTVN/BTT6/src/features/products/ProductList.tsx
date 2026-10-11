import React from "react";
import { useGetProductsQuery } from "./productsApiSlice";
import { ProductItem } from "./ProductItem";

export const ProductList: React.FC = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductsQuery();

  return (
    <section className="product-list-container">
      <div className="section-header">
        <div>
          <h2>Danh Sách Sản Phẩm Công Nghệ</h2>
          <p className="section-subtitle">
            Khám phá các thiết bị công nghệ chính hãng mới nhất
          </p>
        </div>
        {!isLoading && !isError && (
          <span className="product-count-badge">
            {products.length} sản phẩm
          </span>
        )}
      </div>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải danh sách sản phẩm từ mock API...</p>
        </div>
      )}

      {isError && (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p className="error-text">
            {typeof error === "object" && error !== null && "status" in error
              ? `Lỗi tải dữ liệu: ${String((error as { status?: unknown }).status)}`
              : "Không thể tải danh sách sản phẩm"}
          </p>
          <button onClick={() => refetch()} className="btn btn-secondary">
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
