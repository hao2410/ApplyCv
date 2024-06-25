'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

interface ApplyCvProps {
  open: boolean;
  onClose: () => void;
  objectDetailVancan: {
    id: number;
    title: string;
    salary: string;
    address: string;
    time: Date;
    description: string;
    quantity: number;
    recruitmentClosingDate: string;
    startedDate: string;
  };
}

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  phone: zod.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  name: zod.string().min(1, { message: 'Name is required' }),
  cv: zod.instanceof(File, { message: 'CV is required and must be a file' }) || null,
});

type Values = zod.infer<typeof schema>;

export interface UploadImageResponse {
  imageUrl: string;
  error?: string;
}

export interface CreateCandidateResponse {
  id: number;
  error?: string;
}

export interface CreateRecruitmentApplicantResponse {
  error?: string;
}

export default function ApplyCv({ open, onClose, objectDetailVancan }: ApplyCvProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmitHandle = async (values: Values): Promise<void> => {
    // console.log("Đã vào submit");
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

      formData.append('cv', cvUrl);

      const data = {
        email: values.email,
        phone: values.phone,
        name: values.name,
        cv: uploadResponse.data.imageUrl,
      };

      const response: AxiosResponse<CreateCandidateResponse> = await axios.post(
        'https://localhost:7098/api/Candidate/Createaaa',
        data
      );

      if (response.data.error) {
        setError('root', { type: 'server', message: response.data.error });
        setIsPending(false);
        return;
      }

      const dataRecruitmentApplicant = {
        candidateId: response.data.id,
        recruitmentID: objectDetailVancan.id,
        DateStart: null,
        EndDate: null,
        Status: 1, // đang xử lí
      };

      const responseRA: AxiosResponse<CreateRecruitmentApplicantResponse> = await axios.post(
        'https://localhost:7098/api/RecruitmentApplicant/assignApplicant',
        dataRecruitmentApplicant
      );

      setIsPending(false);
      onClose();
      console.log('api thành công apply:', responseRA.data);
      if (responseRA.data.error) {
        // debugger;
        setError('root', { type: 'server', message: responseRA.data.error });
      } else {
        router.push('/client');
      }
    } catch (error) {
      // debugger;
      setError('root', { type: 'server', message: 'An error occurred. Please try again.' });
      setIsPending(false);
    } finally {
      const inputElement = document.getElementById('upload-cv') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll={'body'}>
      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <DialogTitle>
          Nộp CV
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
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
              name="phone"
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.phone)}>
                  <InputLabel>Số điện thoại</InputLabel>
                  <OutlinedInput {...field} label="Số điện thoại" type="tel" />
                  {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
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
            {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
            <Button variant="contained" type="submit" disabled={isPending}>
              Nộp
            </Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
}
