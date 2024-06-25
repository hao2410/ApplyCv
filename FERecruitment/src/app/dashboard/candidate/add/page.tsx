'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Fab,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import axios, { AxiosResponse } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  phone: zod.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  name: zod.string().min(1, { message: 'Name is required' }),
  cv: zod.instanceof(File, { message: 'CV is required and must be a file' }) || null,
  status: zod.number().optional(),
});

type Values = zod.infer<typeof schema>;

export interface UploadImageResponse {
  imageUrl: string;
  error?: string;
}

export interface CreateCandidateResponse {
  error?: string;
}

export default function Page(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmitHandle =
    // k chạy vào đưuọc đây này
    async (values: Values): Promise<void> => {
      console.log('Đã vào submit');
      setIsPending(true);
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('name', values.name);

      try {
        const cvFormData = new FormData();
        cvFormData.append('image', values.cv);

        const uploadResponse: AxiosResponse<UploadImageResponse> = await axios.post(
          'https://localhost:7098/api/Candidate/UploadImage',
          cvFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (uploadResponse.status !== 200 || uploadResponse.data.error) {
          setError('root', { type: 'server', message: 'Failed to upload CV' });
          setIsPending(false);
          return;
        }

        const cvUrl = uploadResponse.data.imageUrl;

        // Thêm đường dẫn CV vào formData
        formData.append('cv', cvUrl);
        formData.append('status', '1');

        const data = {
          email: values.email,
          phone: values.phone,
          name: values.name,
          cv: uploadResponse.data.imageUrl,
          status: 1, 
        };
        // Gửi dữ liệu ứng viên
        const response: AxiosResponse<CreateCandidateResponse> = await axios.post(
          'https://localhost:7098/api/Candidate/Createaaa',
          data
        );

        setIsPending(false);

        if (response.data.error) {
          setError('root', { type: 'server', message: response.data.error });
        } else {
          router.push('/dashboard/candidate');
        }
      } catch (error) {
        setError('root', { type: 'server', message: 'An error occurred. Please try again.' });
        setIsPending(false);
      } finally {
        // Reset file input field value after submission
        const inputElement = document.getElementById('upload-cv') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
      }
    };

  return (
    <Box maxWidth="md" >
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        Add Candidate
      </Typography>
      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <Grid container spacing={2} sx={{marginBottom:"20px"}}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.name)}>
                  <InputLabel>Tên</InputLabel>
                  <OutlinedInput {...field} label="Tên" type="text" />
                  {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* {errors.recruitmentCode && <FormHelperText>{errors.recruitmentCode.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={6}>
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
            {/* {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.phone)}>
                  <InputLabel>Số điện thoại</InputLabel>
                  <OutlinedInput {...field} label="Số điện thoại" type="tel" />
                  {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* {errors.title && <FormHelperText>{errors.title.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="cv"
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.cv)}>
                  <InputLabel htmlFor="upload-cv" shrink>
                    Nộp CV
                  </InputLabel>
                  <label
                    htmlFor="upload-cv"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                  >
                    <input
                      style={{ display: 'none' }}
                      id="upload-cv"
                      type="file"
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                      }}
                    />
                    <Fab
                      color="inherit"
                      component="span"
                      aria-label="add"
                      variant="extended"
                      sx={{
                        textTransform: 'capitalize',
                        width: '100%',
                        borderRadius: 1,
                        background: 'none',
                        border: '1px dashed rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <CloudUploadIcon /> <span style={{ marginLeft: 7 }}>Tải CV</span>
                    </Fab>
                  </label>
                  {errors.cv ? <FormHelperText>{errors.cv.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {/* {errors.description && <FormHelperText>{errors.description.message}</FormHelperText>} */}
          </Grid>
        </Grid>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" startIcon={<SaveIcon />} disabled={isPending} type="submit">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
}
