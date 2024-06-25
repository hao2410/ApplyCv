'use client';

import * as React from 'react';
// import type { Metadata } from 'next';
import { useState } from 'react';
import NextLink from 'next/link';
// import { config } from '@/config';
import { Button } from '@mui/material';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { paths } from '@/paths';
import PersonnelAdd from '@/components/dashboard/personnel/personnel-add';
import { PersonnelFilters } from '@/components/dashboard/personnel/personnel-filters';
import { PersonnelTable } from '@/components/dashboard/personnel/personnel-table';

// export const metadata = { title: `Personnel | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // const handleClickAdd = () => {
  //   setAddDialogOpen(true);
  // };

  const handleCloseClickAdd = () => {
    setAddDialogOpen(false);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Personnel</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        {/* <Link component={NextLink} href={paths.dashboard.add}>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </Link> */}
      </Stack>
      <PersonnelFilters />
      <PersonnelTable />
      <PersonnelAdd open={addDialogOpen} onClose={handleCloseClickAdd} />
    </Stack>
  );
}
