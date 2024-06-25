import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
// import { AuthGuard } from '@/components/auth/auth-guard';
import ResponsiveHeader from '@/components/client/layout/header';
import ResponsiveFooter from '@/components/client/layout/footer';
import { GuestGuard } from '@/components/auth/guest-guard';

interface LayoutProps {
  children: React.ReactNode;
  metadata: { title: string; description?: string };
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  // React.useEffect(() => {
  //   document.title = metadata.title;
  //   if (metadata.description) {
  //     const metaDescription = document.querySelector('meta[name="description"]');
  //     if (metaDescription) {
  //       metaDescription.setAttribute('content', metadata.description);
  //     } else {
  //       const description = document.createElement('meta');
  //       description.name = 'description';
  //       description.content = metadata.description;
  //       document.head.appendChild(description);
  //     }
  //   }
  // }, [metadata]);
  return (
    <GuestGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <ResponsiveHeader />
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
          <main>
            <Container maxWidth="xl" sx={{ py: '64px' }}>
              {children}
            </Container>
          </main>
        </Box>
        <ResponsiveFooter />
      </Box>
    </GuestGuard>
  );
}
