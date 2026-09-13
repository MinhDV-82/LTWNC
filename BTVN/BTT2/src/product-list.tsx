import type { Product } from "../../BTT1/order-managerment.types";
import { usePagination } from "./usePagination";

export interface ProductListProps {
  products: Product[];
  itemsPerPage?: number;
}

export function ProductList({ products, itemsPerPage = 5 }: ProductListProps) {
  const { currentItems, currentPage, totalPages, next, prev, goToPage } =
    usePagination(products, itemsPerPage);

  return (
    <section aria-label="Product list">
      <ul>
        {currentItems.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong>
            <span>{product.sku}</span>
            <span>{product.price}</span>
          </li>
        ))}
      </ul>

      <nav aria-label="Product pagination">
        <button type="button" onClick={prev} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          type="button"
          onClick={next}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </nav>
    </section>
  );
}
