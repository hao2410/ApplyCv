
## Pages 
- [Dashboard](https://material-kit-react.devias.io)
- [Customers](https://material-kit-react.devias.io/dashboard/customers)
- [Integrations](https://material-kit-react.devias.io/dashboard/integrations)
- [Settings](https://material-kit-react.devias.io/dashboard/settings)
- [Account](https://material-kit-react.devias.io/dashboard/account)
- [Sign In](https://material-kit-react.devias.io/auth/sign-in)
- [Sign Up](https://material-kit-react.devias.io/auth/sign-up)
- [Reset Password](https://material-kit-react.devias.io/auth/reset-password)

## Quick start
- Make sure your Node.js and npm versions are up to date
- Install dependencies: `npm install` or `yarn`
- Start the server: `npm run dev` or `yarn dev`
- Open browser: `http://localhost:3000`

## File Structure

Within the download you'll find the following directories and files:

```
┌── .editorconfig (thiết lập các cấu hình đồng nhất cho biên tập mã nguồn trong các trình soạn thảo mã khác nhau.)
├── .eslintrc.js (Tệp cấu hình cho ESLint, một công cụ kiểm tra mã nguồn JavaScript để phát hiện và tránh các lỗi cú pháp và phong cách.)
├── .gitignore (Tệp xác định các tệp và thư mục không nên được theo dõi bởi Git.)
├── CHANGELOG.md (Tệp ghi lại các thay đổi trong phiên bản và lịch sử phiên bản của dự án.)
├── LICENSE.md (Tệp chứa thông tin về giấy phép sử dụng của dự án.)
├── next-env.d.ts (Tệp định nghĩa kiểu TypeScript cho các môi trường trong Next.js.)
├── next.config.js (Tệp cấu hình cho Next.js, một khung làm việc React.)
├── package.json (Tệp mô tả các phụ thuộc của dự án và các tác vụ npm.)
├── README.md (Tệp mô tả dự án và cách cài đặt, sử dụng)
├── tsconfig.json (Tệp cấu hình cho TypeScript, một ngôn ngữ lập trình phổ biến cho các dự án React.)
├── public (Thư mục chứa các tệp tĩnh như hình ảnh, biểu tượng, v.v.)
└── src
	├── config (Chứa các tệp định nghĩa cấu hình cho ứng dụng React, giúp quản lý các thiết lập và biến toàn cục)
	├── paths (Chứa các tệp định tuyến, điều hướng cả mẫu cho cả trang admin và client)
	├── components ( Thư mục chứa các thành phần React của ứng dụng, bao gồm buttons, forms, cards, và các thành phần khác.)
	├── contexts (Chứa các thành phần liên quan đến context API, cho phép truy cập thông tin người dùng cho các thành phần khác trong ứng dụng)
	├── hooks (Lưu trữ các hooks, các function có thể được sử dụng lại ở nhiều thành phần khác nhau trong ứng dụng, bao gồm các logic xử lý hoặc state logic)
	├── lib ( Chứa các thư viện và module hữu ích cho ứng dụng, như các tiện ích xử lý dữ liệu, xử lý mạng, hoặc các thư viện bên thứ ba)
	├── styles (Thư mục chứa các tệp CSS hoặc SCSS để tùy chỉnh giao diện của ứng dụng)
	├── types (Chứa các tệp định nghĩa các kiểu dữ liệu TypeScript cho ứng dụng)
	└── app ( Thư mục chứa mã nguồn cụ thể của ứng dụng)
		├── layout.tsx (file ghép giao diện gồm navbar,header,....)
		├── page.tsx (chuyển hướng từ trang hiện tại đến trang dashboard như trong code sử dụng redirect)
		├── auth (thư mục xác thực người dùng)
		└── dashboard (thư mục admin)
		└── client (thư mục client)
```

## Reporting Issues:

- [Github Issues Page](https://github.com/devias-io/material-kit-react/issues)



