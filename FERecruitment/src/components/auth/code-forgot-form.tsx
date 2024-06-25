'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  code: zod.string().min(1, { message: 'Code is required' }),
});
type Values = zod.infer<typeof schema>;

export function CodeForgotForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  const router = useRouter();

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
      try {
        const response = await authClient.confirmCode(values);
        setIsPending(false);
        if (response.error) {
          setError('root', { type: 'server', message: response.error });
        } else {
          router.push('/auth/confirm-password');
        }
      } catch (error) {
        setError('root', { type: 'server', message: 'An error occurred. Please try again.' });
        setIsPending(false);
      }
    },
    [setError]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Code forgot password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...field} label="Email" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Code</InputLabel>
                <OutlinedInput {...field} label="Code" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Check code
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
