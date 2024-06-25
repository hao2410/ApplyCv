import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import VancanciesDetails from '@/components/client/detail/detail-vancancies';
import { Box } from '@mui/material';

export const metadata = { title: `Detail | client | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Box>
      <VancanciesDetails />
    </Box>
  );
}
