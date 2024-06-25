  'use client';

  import * as React from 'react';
  import { useRouter } from 'next/navigation';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { Alert, FormHelperText } from '@mui/material';
  import Button from '@mui/material/Button';
  import Card from '@mui/material/Card';
  import CardActions from '@mui/material/CardActions';
  import CardContent from '@mui/material/CardContent';
  import CardHeader from '@mui/material/CardHeader';
  import Divider from '@mui/material/Divider';
  import FormControl from '@mui/material/FormControl';
  import InputLabel from '@mui/material/InputLabel';
  import OutlinedInput from '@mui/material/OutlinedInput';
  import Stack from '@mui/material/Stack';
  import { Controller, useForm } from 'react-hook-form';
  import { z as zod } from 'zod';

  import { authClient } from '@/lib/auth/client';

  const schema = zod.object({
    email: zod.string().min(1, { message: 'Yêu cầu email' }).email(),
    OldPassword: zod.string().min(6, { message: 'Mật khẩu cũ không khớp' }),
    NewPassword: zod.string().min(6, { message: 'Mật khẩu mới nhiều hơn 6 kí tự' }),
    // confirmPassword: zod.string().min(6, { message: 'Mật khẩu mới không khớp' }),
  });

  type Values = zod.infer<typeof schema>;

  export function ChangePasswordForm(): React.JSX.Element {
    const router = useRouter();
    const [isPending, setIsPending] = React.useState<boolean>(false);

    const {
      control,
      handleSubmit,
      setError,
      formState: { errors },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
      async (values: Values): Promise<void> => {
        // debugger
        setIsPending(true);
        try {
          const response = await authClient.changePassword(values);
          setIsPending(false);
          if (response.error) {
            setError('root', { type: 'server', message: response.error });
          } else {
            router.push('/dashboard');
          }
        } catch (error) {
          setError('root', { type: 'server', message: 'An error occurred. Please try again.' });
          setIsPending(false);
        }
      },
      [setError]
    );
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Update password" title="Password" />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 'md' }}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.email)}>
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput {...field} label="Email" type="email" />
                    {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="OldPassword"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.OldPassword)}>
                    <InputLabel>Password old</InputLabel>
                    <OutlinedInput {...field} label="Password Old" type="password" />
                    {errors.OldPassword && <FormHelperText>{errors.OldPassword.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="NewPassword"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.NewPassword)}>
                    <InputLabel>New Password</InputLabel>
                    <OutlinedInput {...field} label="New Password" type="password" />
                    {errors.NewPassword && <FormHelperText>{errors.NewPassword.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              {/* <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.confirmPassword)}>
                    <InputLabel>Confirm Password</InputLabel>
                    <OutlinedInput {...field} label="Confirm Password" type="password" />
                    {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
                  </FormControl>
                )}
              /> */}
              {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button disabled={isPending} type="submit" variant="contained">
              Update
            </Button>
          </CardActions>
        </Card>
      </form>
    );
  }
