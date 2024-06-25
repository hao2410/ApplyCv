import type { NavItemConfig } from '@/types/nav';

export function isNavItemActive(
{
  disabled,
  external,
  href,
  matcher,
  pathname,
}: Pick<NavItemConfig, 'disabled' | 'external' | 'href' | 'matcher'> & { pathname: string }): boolean {
  // pick 1 phương thức trong typescript  cho phép lấy ra 1 tập hợp con của các thuộc tính từ 1 loại type
  // & { pathname: string } phần mở rộng của các thuộc tính đã chọn
  if (disabled || !href || external) {
    return false;
  }

  if (matcher) {
    if (matcher.type === 'startsWith') {
      return pathname.startsWith(matcher.href);
    }

    if (matcher.type === 'equals') {
      return pathname === matcher.href;
    }

    return false;
  }

  return pathname === href;
}
