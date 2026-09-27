# BTT4 - Danh sách sản phẩm yêu thích

Ứng dụng được xây dựng bằng React, TypeScript và Zustand.
Store `favoritesStore.ts` quản lý danh sách `favoriteIds` cùng các action thêm, bỏ và xóa yêu thích.
Zustand có ưu điểm là API ngắn gọn, không cần tạo Provider và phù hợp với state nhỏ như bài tập này.
So với Redux Toolkit, Zustand ít boilerplate hơn và dễ bắt đầu hơn cho một feature độc lập.
Redux Toolkit lại mạnh hơn khi ứng dụng lớn, nhiều slice, middleware, DevTools và quy ước xử lý state phức tạp.
Vì vậy, Zustand phù hợp với bài toán yêu thích hiện tại, còn Redux Toolkit phù hợp hơn cho state dùng chung ở quy mô lớn.

## Chạy project

```bash
npm install
npm run dev
```

## Kiểm tra

```bash
npm run build
npm run lint
```
