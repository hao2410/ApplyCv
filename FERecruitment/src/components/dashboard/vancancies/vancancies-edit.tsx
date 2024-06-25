"use client";
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

interface VacanciesEditProps {
  open: boolean;
  onClose: () => void;
  vacancyData: VacancyData;
  setVacancyData: React.Dispatch<React.SetStateAction<VacancyData>>;
}

interface VacancyData {
  status: number;
  title: string;
  quantity: string;
  description: string;
  id: number;
}

const schema = zod.object({
  title: zod.string().min(1, { message: 'Title is required' }),
  status: zod.number(),
  quantity: zod.string().min(1, { message: 'Quantity is required' }),
  description: zod.string().min(1, { message: 'Description is required' }),
  id: zod.number(),
});

type Values = zod.infer<typeof schema>;

export default function VacanciesEdit({ open, onClose, vacancyData, setVacancyData }: VacanciesEditProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: vacancyData?.title || '',
      status: vacancyData?.status ?? 1, 
      quantity: vacancyData?.quantity || '',
      description: vacancyData?.description || '',
      id: vacancyData?.id || undefined,
    },
  });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        setIsPending(true);
        if (!vacancyData?.id) {
          logger.error('Invalid Vacancy Data');
          return;
        }
        // debugger
        const response = await axios.put(`https://localhost:7098/api/Vancancies/Update?id=${vacancyData.id}`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("api thành công:",response.data);
  
        setIsPending(false);
        onClose();
      } catch (error) {
        // debugger
        logger.error('Error calling API:', error);
        setIsPending(false);
      }
    },
    [vacancyData, onClose]
  );
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="body">
       {/* {vacancyData && console.log('data: ', vacancyData)} */}
      <DialogTitle sx={{ p: 3 }}>Update Vacancies</DialogTitle>
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
              name="title"
              defaultValue={vacancyData?.title || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  fullWidth
                  label="Tiêu đề"
                  variant="outlined"
                  sx={{ marginBottom: 2, marginTop: 1 }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              )}
            />
            {/* {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null} */}
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={statusOptions.find((option) => option.value === vacancyData?.status) || null}
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
            {/* {errors.status ? <FormHelperText>{errors.status.message}</FormHelperText> : null} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="quantity"
              defaultValue={vacancyData?.quantity || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  fullWidth
                  label="Số Lượng"
                  variant="outlined"
                  name="advanceDeduction"
                  sx={{ marginBottom: 2, marginTop: 1 }}
                />
              )}
            />
            {/* {errors.quantity ? <FormHelperText>{errors.quantity.message}</FormHelperText> : null} */}
          </Grid>
        </Grid>
        <Controller
          control={control}
          name="description"
          defaultValue={vacancyData?.quantity || ''}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              rows={2}
              label="Mô tả"
              variant="outlined"
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              fullWidth
              id="notes"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
          )}
        />
        {/* {errors.description ? <FormHelperText>{errors.description.message}</FormHelperText> : null} */}
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
