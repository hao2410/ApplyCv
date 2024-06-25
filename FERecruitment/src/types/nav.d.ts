export interface NavItemConfig {
  key: string;
  title?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  icon?: string;
  href?: string;
  items?: NavItemConfig[];
  matcher?: { type: 'startsWith' | 'equals'; href: string };
}

/*
key: Một chuỗi đại diện cho khóa duy nhất của mục.
title (tùy chọn): Tiêu đề của mục.
disabled (tùy chọn): Xác định xem mục có bị vô hiệu hóa hay không. Mặc định là false.
external (tùy chọn): Xác định xem mục là một liên kết ngoài hay không. Mặc định là false.
label (tùy chọn): Nhãn của mục.
icon (tùy chọn): Tên của biểu tượng của mục.
href (tùy chọn): Đường dẫn của mục, có thể là đường dẫn nội bộ hoặc bên ngoài.
items (tùy chọn): Danh sách các mục con của mục hiện tại.
matcher (tùy chọn): Xác định cách khớp địa chỉ URL của mục với đường dẫn hiện tại.
 Đối tượng này có hai thuộc tính: type (loại khớp, có thể là startsWith hoặc equals) 
 và href (địa chỉ URL để khớp với đường dẫn hiện tại).
*/
