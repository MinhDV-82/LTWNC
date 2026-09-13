import { Accordion } from "./accordion";
import { ProductList } from "./product-list";
import type { Product } from "../../BTT1/order-managerment.types";

const products: Product[] = Array.from({ length: 7 }, (_, index) => ({
  id: `product-${index + 1}`,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: `Product ${index + 1}`,
  sku: `SKU-${String(index + 1).padStart(3, "0")}`,
  price: (index + 1) * 100000,
  stock: 10 + index,
}));

export function App() {
  return (
    <main>
      <h1>BTT2</h1>

      <h2>Compound Accordion</h2>
      <Accordion.Root defaultValue="panel-1">
        <Accordion.Item value="panel-1">
          <Accordion.Trigger>Panel 1</Accordion.Trigger>
          <Accordion.Panel>Nội dung panel 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="panel-2">
          <Accordion.Trigger>Panel 2</Accordion.Trigger>
          <Accordion.Panel>Nội dung panel 2</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="panel-3">
          <Accordion.Trigger>Panel 3</Accordion.Trigger>
          <Accordion.Panel>Nội dung panel 3</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <h2>Product pagination</h2>
      <ProductList products={products} itemsPerPage={3} />
    </main>
  );
}
