import type { Metadata } from 'next';

import { config } from '@/config'; // đảm bảo bạn import config nếu cần

export const metadata = { title: `Home | ${config.site.name}` } satisfies Metadata;
