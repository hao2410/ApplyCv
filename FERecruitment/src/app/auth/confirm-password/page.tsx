import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { ConfirmPasswordForm } from '@/components/auth/confirm-password-form';

export const metadata = { title: `Confirm password | Auth | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <ConfirmPasswordForm />
      </GuestGuard>
    </Layout>
  );
}
