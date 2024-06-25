import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'customer', title: 'Customer', href: paths.client.customer, icon: 'users' },
] satisfies NavItemConfig[];
