'use client';

import React, { useEffect } from 'react';
import SaveIcon from '@mui/icons-material/Save';
// import { FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';

export default function Page(): React.JSX.Element {
  const { user, checkSession } = useUser();
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    recruitmentCode: '',
    status: '1',
    title: '',
    description: '',
    quantity: 0,
    department: 0,
    recruitmentClosingDate: '',
    staffID: '',
  });
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkSession?.();
        if (typeof user === 'object' && user !== null && 'id' in user) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            staffID: user.id,
          }));
        } else {
          logger.error('User data is not available or does not contain id property');
        }
      } catch (error) {
        logger.error('Error checking session:', error);
      }
    };

    fetchData();
  }, [checkSession, user]);

  const statusOptions = [
    { value: 1, label: 'Đang hoạt động' },
    { value: 2, label: 'Bị đình chỉ' },
    { value: 3, label: 'Bị cấm' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAutocompleteChange = (value: any) => {
    if (value && typeof value === 'object' && 'st' in value) {
      setFormData({
        ...formData,
        status: String(value.st),
      });
    } else {
      setFormData({
        ...formData,
        status: '1',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsPending(true);
      // console.log('dataSubmit:', formData);
      // debugger;
      const response = await axios.post('https://localhost:7098/api/Vancancies/Createaa', formData);
      console.log('API thành công:', response.data);
      router.push('/dashboard/vancancies');
      setIsPending(false);
    } catch (error) {
      logger.error('Error submitting form:', error);
      setIsPending(false);
    }
  };

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: '15px' }}>
        Add Vacancies
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="recruitmentCode"
              value={formData.recruitmentCode}
              onChange={handleChange}
              size="small"
              fullWidth
              label="Recruitment Code"
              variant="outlined"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            {/* {errors.recruitmentCode && <FormHelperText>{errors.recruitmentCode.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              value={statusOptions.find((option) => option.value === parseInt(formData.status)) || null}
              onChange={(_, value) => {
                handleAutocompleteChange(value);
              }}
              size="small"
              disablePortal
              options={statusOptions}
              fullWidth
              renderInput={(params) => <TextField {...params} variant="outlined" label="Status *" />}
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            {/* {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              value={formData.title}
              onChange={handleChange}
              size="small"
              fullWidth
              label="Title"
              variant="outlined"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            {/* {errors.title && <FormHelperText>{errors.title.message}</FormHelperText>} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              label="Description"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            {/* {errors.description && <FormHelperText>{errors.description.message}</FormHelperText>} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              // type="number"
              size="small"
              fullWidth
              label="Quantity"
              variant="outlined"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            {/* {errors.quantity && <FormHelperText>{errors.quantity.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="department"
              value={formData.department}
              onChange={handleChange}
              size="small"
              // type="number"
              fullWidth
              label="Department"
              variant="outlined"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            {/* {errors.department && <FormHelperText>{errors.department.message}</FormHelperText>} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              name="recruitmentClosingDate"
              value={formData.recruitmentClosingDate}
              onChange={handleChange}
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Recruitment Closing Date"
              variant="outlined"
              sx={{ marginBottom: 2, marginTop: 1 }}
            />
            {/* {errors.recruitmentClosingDate && <FormHelperText>{errors.recruitmentClosingDate.message}</FormHelperText>} */}
          </Grid>
        </Grid>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" startIcon={<SaveIcon />} disabled={isPending} type="submit">
            Save
          </Button>
        </Box>
      </form>
    </>
  );
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { zodResolver } from '@hookform/resolvers/zod';
// import SaveIcon from '@mui/icons-material/Save';
// import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import axios, { AxiosResponse } from 'axios';
// import { Controller, useForm } from 'react-hook-form';
// import { z as zod } from 'zod';

// import { logger } from '@/lib/default-logger';
// import { useUser } from '@/hooks/use-user';

// const schema = zod.object({
//   email: zod.string().min(1, { message: 'Email is required' }).email(),
//   title: zod.string().min(1, { message: 'title is required' }),
//   recruitmentCode: zod.string().min(1, { message: 'recruitmentCode is required' }),
//   name: zod.string().min(1, { message: 'Name is required' }),
//   department: zod.string().min(1, { message: 'department is required' }),
//   description: zod.string().min(1, { message: 'description is required' }),
//   quantity: zod.number().optional(),
//   staffID: zod.number().optional(),
// });

// export interface CreateVancanciesResponse {
//   error?: string;
// }

// type Values = zod.infer<typeof schema>;

// export default function Page(): React.JSX.Element {
//   const { user, checkSession } = useUser();
//   const router = useRouter();
//   const [isPending, setIsPending] = React.useState<boolean>(false);
//   const [staffID, setStaffID] = useState<number | null>(null);

//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm<Values>({ resolver: zodResolver(schema) });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await checkSession?.();
//         if (user && 'id' in user) {
//           setStaffID(user.id as number);
//         } else {
//           logger.error('User data is not available or does not contain id property');
//         }
//       } catch (error) {
//         logger.error('Error checking session:', error);
//       }
//     };

//     fetchData();
//   }, [checkSession, user]);

//   const onSubmitHandle = async (values: Values): Promise<void> => {
//     setIsPending(true);
//     // console.log('Đã vào submit');
//     try {
//       const data = {
//         ...values,
//         status: 1,
//         staffID: staffID ?? undefined,
//         email: values.email,
//         title: values.title,
//         name: values.name,
//         recruitmentCode: values.recruitmentCode,
//         department: values.department,
//         description: values.description,
//         quantity: values.quantity,
//       };
//       debugger
//       const response: AxiosResponse<CreateVancanciesResponse> = await axios.post(
//         'https://localhost:7098/api/Vancancies/Createaa',
//         data,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       setIsPending(false);

//       if (response.data.error) {
//         setError('root', { type: 'server', message: response.data.error });
//       } else {
//         router.push('/dashboard/vancancies');
//       }
//     } catch (error) {
//       setError('root', { type: 'server', message: 'An error occurred. Please try again.' });
//       setIsPending(false);
//     } finally {
//       // Reset file input field value after submission
//       const inputElement = document.getElementById('upload-cv') as HTMLInputElement;
//       if (inputElement) {
//         inputElement.value = '';
//       }
//     }
//   };

//   return (
//     <>
//       <Typography variant="h5" sx={{ marginBottom: '15px' }}>
//         Add Vacancies
//       </Typography>
//       <form onSubmit={handleSubmit(onSubmitHandle)}>
//         <Grid container spacing={2} sx={{marginBottom:"20px"}}>
//           <Grid item xs={6}>
//             <Controller
//               control={control}
//               name="recruitmentCode"
//               render={({ field }) => (
//                 <FormControl fullWidth error={Boolean(errors.recruitmentCode)}>
//                   <InputLabel>recruitmentCode</InputLabel>
//                   <OutlinedInput {...field} label="recruitmentCode" />
//                   {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
//                 </FormControl>
//               )}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Controller
//               control={control}
//               name="email"
//               render={({ field }) => (
//                 <FormControl fullWidth error={Boolean(errors.email)}>
//                   <InputLabel>Email</InputLabel>
//                   <OutlinedInput {...field} label="Email" type="email" />
//                   {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
//                 </FormControl>
//               )}
//             />
//           </Grid>
//         </Grid>
//         <Grid container spacing={2} sx={{marginBottom:"20px"}}>
//           <Grid item xs={6}>
//             <Controller
//               control={control}
//               name="title"
//               render={({ field }) => (
//                 <FormControl fullWidth error={Boolean(errors.title)}>
//                   <InputLabel>title</InputLabel>
//                   <OutlinedInput {...field} label="title" />
//                   {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
//                 </FormControl>
//               )}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <Controller
//               control={control}
//               name="description"
//               render={({ field }) => (
//                 <FormControl fullWidth error={Boolean(errors.description)}>
//                   <InputLabel>description</InputLabel>
//                   <OutlinedInput {...field} label="description" />
//                   {errors.description ? <FormHelperText>{errors.description.message}</FormHelperText> : null}
//                 </FormControl>
//               )}
//             />
//             {/* {errors.description && <FormHelperText>{errors.description.message}</FormHelperText>} */}
//           </Grid>
//         </Grid>

//         <Grid container spacing={2} >
//           <Grid item xs={6}>
//             <Controller
//               control={control}
//               name="quantity"
//               render={({ field }) => (
//                 <FormControl fullWidth error={Boolean(errors.quantity)}>
//                   <InputLabel>quantity</InputLabel>
//                   <OutlinedInput {...field} label="quantity" />
//                   {errors.quantity ? <FormHelperText>{errors.quantity.message}</FormHelperText> : null}
//                 </FormControl>
//               )}
//             />
//             {/* {errors.quantity && <FormHelperText>{errors.quantity.message}</FormHelperText>} */}
//           </Grid>
//           <Grid item xs={6}>
//             <Controller
//               control={control}
//               name="department"
//               render={({ field }) => (
//                 <FormControl fullWidth error={Boolean(errors.department)}>
//                   <InputLabel>Department</InputLabel>
//                   <OutlinedInput {...field} label="department" />
//                   {errors.department ? <FormHelperText>{errors.department.message}</FormHelperText> : null}
//                 </FormControl>
//               )}
//             />
//           </Grid>
//         </Grid>
//         {/* <Grid container spacing={2}>
//           <Grid item xs={6}>
//             <TextField
//               name="recruitmentClosingDate"
//               value={formData.recruitmentClosingDate}
//               onChange={handleChange}
//               type="date"
//               size="small"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               label="Recruitment Closing Date"
//               variant="outlined"
//               sx={{ marginBottom: 2, marginTop: 1 }}
//             />
//           </Grid>
//         </Grid> */}

//         <Box mt={2} display="flex" justifyContent="flex-end">
//           <Button variant="contained" startIcon={<SaveIcon />} disabled={isPending} type="submit">
//             Save
//           </Button>
//         </Box>
//       </form>
//     </>
//   );
// }
