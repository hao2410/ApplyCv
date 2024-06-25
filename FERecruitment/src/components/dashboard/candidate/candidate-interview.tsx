'use client';

import React, { useCallback, useState } from 'react';
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
  IconButton,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { logger } from '@/lib/default-logger';

interface CandidateScheduleProps {
  open: boolean;
  onClose: () => void;
  ScheduleData: ScheduleData;
}

export interface ScheduleData {
  candidateId: number;
  recruitmentApplicantId: number;
  recruitmentApplicantDateStart: Date | null;
  recruitmentApplicantEndDate: Date | null;
  recruitmentApplicantStatus: number;
}
const schema = zod.object({
  // recruitmentApplicantId: zod.number().optional(),
  id: zod.number().optional(),
  status: zod.string().min(1, { message: 'status is required' }),
  startDate: zod.date().nullable().optional(),
  endDate: zod.date().nullable().optional(),
});

type Values = zod.infer<typeof schema>;
const statusOptions = [
  { value: 1, label: 'Đang xử lí' },
  { value: 2, label: 'Đang diễn ra' },
  { value: 3, label: 'Đã hoàn thành' },
];

export default function InterviewScheduleForm({
  open,
  onClose,
  ScheduleData,
}: CandidateScheduleProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  React.useEffect(() => {
    if (open && ScheduleData) {
      reset({
        status: ScheduleData.recruitmentApplicantStatus.toString(),
        startDate: ScheduleData.recruitmentApplicantDateStart,
        endDate: ScheduleData.recruitmentApplicantEndDate,
      });
    }
  }, [open, ScheduleData, reset]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        // debugger;
        setIsPending(true);
        console.log('recruitmentApplicantId:', ScheduleData.recruitmentApplicantId);
        if (!ScheduleData?.recruitmentApplicantId) {
          logger.error('Invalid Candidate Data');
          return;
        }

        const response = await axios.put(
          `https://localhost:7098/api/RecruitmentApplicant/Update?id=${ScheduleData.recruitmentApplicantId}`,
          values,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          console.log('API thành công interview:', response.data);
        } else {
          logger.error('Lỗi không mong muốn khi cập nhật dữ liệu ứng viên');
        }

        onClose();
      } catch (error) {
        logger.error('Error calling API:', error);
      } finally {
        setIsPending(false);
      }
    },
    [onClose, ScheduleData]
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll={'body'}>
      {ScheduleData && console.log('ScheduleData:', ScheduleData)}
      <DialogTitle sx={{ p: 3 }}>Hẹn lịch phỏng vấn</DialogTitle>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                fullWidth
                label="StartDate"
                variant="outlined"
                sx={{ marginBottom: 2, marginTop: 1 }}
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  const dateValue = new Date(e.target.value);
                  field.onChange(dateValue);
                }}
                value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                error={Boolean(errors.startDate)}
                helperText={errors.startDate ? errors.startDate.message : ''}
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                fullWidth
                label="EndDate"
                variant="outlined"
                sx={{ marginBottom: 2, marginTop: 1 }}
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {
                  const dateValue = new Date(e.target.value);
                  field.onChange(dateValue);
                }}
                value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
                error={Boolean(errors.endDate)}
                helperText={errors.endDate ? errors.endDate.message : ''}
                inputProps={{
                  min: field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : '',
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Autocomplete
                {...field}
                value={
                  statusOptions.find((option) => option.value === ScheduleData?.recruitmentApplicantStatus) || null
                }
                size="small"
                disablePortal
                id="combo-box-demo"
                options={statusOptions}
                fullWidth
                onChange={(_, data) => {
                  field.onChange(data?.value.toString() || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Trạng thái *"
                    error={Boolean(errors.status)}
                    helperText={errors.status ? errors.status.message : ''}
                  />
                )}
                sx={{ marginBottom: 2, marginTop: 1 }}
              />
            )}
          />
          <DialogActions sx={{ p: 2 }}>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClose}>
              Hủy
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} disabled={isPending} type="submit">
              Lưu
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
