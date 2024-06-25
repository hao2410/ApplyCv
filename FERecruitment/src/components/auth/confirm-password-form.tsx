'use client';

import * as React from 'react';
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
import { useRouter } from 'next/navigation';
import {Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, FormHelperText } from '@mui/material';
import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: zod.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
});

type Values = zod.infer<typeof schema>;

export function ConfirmPasswordForm(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const { 
    control,
    handleSubmit,
    setError,
    formState: { errors } 
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      if (values.password !== values.confirmPassword) {
        setError('confirmPassword', { type: 'server', message: 'Passwords do not match' });
        setIsPending(false);
        return;
      }
      try {
        const response =  await authClient.updatePassword(values);
        setIsPending(false);
        if (response.error) {
          setError('root', { type: 'server', message: response.error });
        } else {
          router.push('/auth/sign-in');
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
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
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
              name="password"
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} label="Password" type="password" />
                  {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.confirmPassword)}>
                  <InputLabel>Confirm Password</InputLabel>
                  <OutlinedInput {...field} label="Confirm Password" type="password" />
                  {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
                </FormControl>
              )}
            />
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
