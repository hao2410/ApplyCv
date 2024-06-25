
// day la duong dan cua giao dien

export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up',resetPassword : '/forgot-password', },
  dashboard: {
    overview: '/dashboard',
    candidate: '/dashboard/candidate',
    vancancies: '/dashboard/vancancies',
    account: '/dashboard/account',
    personnel: '/dashboard/personnel',
    settings: '/dashboard/settings',
  },
  client: {
    homepage:'/client',
    details : '/client/details',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
