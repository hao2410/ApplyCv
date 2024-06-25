'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { logger } from '@/lib/default-logger';

const statusOptions = [
  { value: 1, label: 'Đang hoạt động' },
  { value: 2, label: 'Bị đình chỉ' },
  { value: 3, label: 'Bị cấm' },
];

interface CandidateEditProps {
  open: boolean;
  onClose: () => void;
  CandidateData: CandidateData;
  // setCandidateData: React.Dispatch<React.SetStateAction<CandidateData>>;
}

interface CandidateData {
  status: number;
  candidateCode: string;
  name: string;
  phone: string;
  id: number;
  email: string;
}

const schema = zod.object({
  candidateCode: zod.string().min(1, { message: 'candidateCode is required' }),
  status: zod.string().min(1, { message: 'status is required' }),
  name: zod.string().min(1, { message: 'name is required' }),
  email: zod.string().min(1, { message: 'email is required' }),
  phone: zod.string().min(1, { message: 'phone is required' }),
  id: zod.number().optional(),
});

type Values = zod.infer<typeof schema>;

export default function CandidateEdit({
  open,
  onClose,
  CandidateData,
}: CandidateEditProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      candidateCode: CandidateData?.candidateCode || '',
      status: (CandidateData?.status ?? '').toString(),
      name: CandidateData?.name || '',
      phone: CandidateData?.phone || '',
      email: CandidateData?.email || '',
      id: CandidateData?.id || undefined,
    },
  });
  React.useEffect(() => {
    if (open && CandidateData) {
      reset({
        candidateCode: CandidateData.candidateCode,
        status: CandidateData.status,
        name: CandidateData.name,
        phone: CandidateData.phone,
        email: CandidateData.email,
        id: CandidateData.id,
      });
    }
  }, [open, CandidateData, reset]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        setIsPending(true);
        // debugger;
        if (!CandidateData?.id) {
          logger.error('Invalid Candidate Data');
          return;
        }
        // debugger
        const response = await axios.put(`https://localhost:7098/api/Candidate/Update?id=${CandidateData.id}`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("data UPdate thành công:" , response.data);
        // if (response.status === 200) {
        //   setCandidateData(prevCandidateData => ({
        //     ...prevCandidateData,
        //     ...values,
        //     status: typeof values.status === 'string' ? parseInt(values.status) : values.status ?? prevCandidateData.status,
        //   }));
        // } else {
        //   logger.error('Lỗi không mong muốn khi cập nhật dữ liệu ứng viên');
        // }
       
        setIsPending(false);
        onClose();
      } catch (error) {
        logger.error('Error calling API:', error);
        setIsPending(false);
      }
    },
    [CandidateData, onClose]
  );
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll={'body'}>
      {/* {CandidateData && console.log('data: ', CandidateData)} */}
      <DialogTitle sx={{ p: 3 }}>Update Candidate</DialogTitle>
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
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="name"
              defaultValue={CandidateData?.name || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="Tên"
                  variant="outlined"
                  sx={{ marginBottom: 2, marginTop: 1 }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              )}
            />
            {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={statusOptions.find((option) => option.value === CandidateData?.status) || null}
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  options={statusOptions}
                  fullWidth
                  onChange={(_, data) => {
                    field.onChange(data?.value.toString() || '');
                  }}
                  renderInput={(params) => <TextField {...params} variant="outlined" label="Trạng thái *" />}
                  sx={{ marginBottom: 2, marginTop: 1 }}
                />
              )}
            />
            {errors.status ? <FormHelperText>{errors.status.message}</FormHelperText> : null}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="candidateCode"
              defaultValue={CandidateData?.candidateCode || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  fullWidth
                  label="candidateCode"
                  variant="outlined"
                  name="advanceDeduction"
                  sx={{ marginBottom: 2, marginTop: 1 }}
                />
              )}
            />
            {errors.candidateCode ? <FormHelperText>{errors.candidateCode.message}</FormHelperText> : null}
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="phone"
              defaultValue={CandidateData?.phone || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  fullWidth
                  label="phone"
                  variant="outlined"
                  name="advanceDeduction"
                  sx={{ marginBottom: 2, marginTop: 1 }}
                />
              )}
            />
            {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="email"
              defaultValue={CandidateData?.email || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  fullWidth
                  label="email"
                  variant="outlined"
                  type="email"
                  name="advanceDeduction"
                  sx={{ marginBottom: 2, marginTop: 1 }}
                />
              )}
            />
            {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} disabled={isPending} onClick={handleSubmit(onSubmit)}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
