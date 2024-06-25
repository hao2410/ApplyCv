'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import { format, isValid, parseISO } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { logger } from '@/lib/default-logger';

interface CandidateScheduleProps {
  open: boolean;
  onClose: () => void;
  MailScheduleData: MailScheduleData;
}
export interface MailScheduleData {
  candidateId: number;
  recruitmentApplicantId: number;
  recruitmentApplicantDateStart: string | null;
  recruitmentApplicantEndDate: string | null;
  recruitmentApplicantStatus: number;
  name: string;
  email: string;
}

const schema = zod.object({
  email: zod.string().min(1, { message: 'email is required' }),
  name: zod.string().min(1, { message: 'name is required' }),
  startDate: zod.string().nullable().optional(),
  endDate: zod.string().nullable().optional(),
});

type Values = zod.infer<typeof schema>;

export default function MailScheduleForm({
  open,
  onClose,
  MailScheduleData,
}: CandidateScheduleProps): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: MailScheduleData?.recruitmentApplicantDateStart || null,
      endDate: MailScheduleData?.recruitmentApplicantEndDate || null,
      name: MailScheduleData?.name.toString(),
      email: MailScheduleData?.email.toString(),
    },
  });
  React.useEffect(() => {
    setValue('startDate', MailScheduleData?.recruitmentApplicantDateStart || null);
    setValue('endDate', MailScheduleData?.recruitmentApplicantEndDate || null);
    setValue('name', MailScheduleData?.name.toString());
    setValue('email', MailScheduleData?.email.toString());
  }, [MailScheduleData, setValue]);
  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        setIsPending(true);
        debugger
        const formattedValues = {
          // ...values,
          // startDate: values.startDate ? format(parseISO(values.startDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null,
          // endDate: values.endDate ? format(parseISO(values.endDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null,

          ...values,
          startDate:
            values.startDate && isValid(parseISO(values.startDate))
              ? format(parseISO(values.startDate), "yyyy-MM-dd'T'HH:mm:ss")
              : 'null',
          endDate:
            values.endDate && isValid(parseISO(values.endDate))
              ? format(parseISO(values.endDate), "yyyy-MM-dd'T'HH:mm:ss")
              : 'null',
        };
        console.log('data:', formattedValues);
        debugger;
        const response = await axios.post(`https://localhost:7098/api/EmailJob/applyjob`, formattedValues, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        debugger;
        console.log('data api:', response.data);
        if (response.status === 200) {
          console.log('Successfully sent mail schedule data');
          onClose();
        } else {
          debugger;
          logger.error('Lỗi không mong muốn khi cập nhật dữ liệu ứng viên');
        }

        setIsPending(false);
      } catch (error) {
        debugger;
        logger.error('Error calling API:', error);
        setIsPending(false);
      }
    },
    [onClose]
  );
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll={'body'}>
      {MailScheduleData && console.log('MailScheduleData:', MailScheduleData)}
      <DialogTitle sx={{ p: 3 }}>Gửi mail</DialogTitle>
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
        <Controller
          control={control}
          name="name"
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
              error={Boolean(errors.name)}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          // defaultValue={MailScheduleData?.email || ''}
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
              // name="advanceDeduction"
              error={Boolean(errors.email)}
              sx={{ marginBottom: 2, marginTop: 1 }}
              helperText={errors.email ? errors.email.message : ''}
            />
          )}
        />

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
                field.onChange(e.target.value);
              }}
              // onChange={(e) => {
              //   const dateValue = new Date(e.target.value);
              //   field.onChange(dateValue);
              // }}
              // value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
              value={field.value || ''}
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
              // onChange={(e) => {
              //   const dateValue = new Date(e.target.value);
              //   field.onChange(dateValue);
              // }}
              // value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              value={field.value || ''}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate ? errors.endDate.message : ''}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" startIcon={<CancelIcon />} onClick={onClose}>
          Hủy
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} disabled={isPending} onClick={handleSubmit(onSubmit)}>
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
}
