'use client';

import * as React from 'react';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';

import { logger } from '@/lib/default-logger';

import DeletePersonnel from './personnel-delete';
import SalaryUpdate from './salaryUpdate';

// import { unknown } from 'zod';

const StyledDataGrid = styled(DataGrid)(() => ({
  '.MuiDataGrid-columnHeaders': {
    backgroundColor: 'var(--icon-fontSize-md)',
  },
}));

export interface Personnel {
  id: number;
  name: string;
  email: string;
  role: number;
}

export function PersonnelTable(): React.JSX.Element {
  const [rows, setRows] = useState<Personnel[]>([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPersonnelData();
      setRows(data);
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data:', error);
    });
  }, []);

  const fetchPersonnelData = async (): Promise<Personnel[]> => {
    try {
      const response: AxiosResponse<Personnel[]> = await axios.get('https://localhost:7098/api/Staff/GetAll');
      // console.log(response.data)
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch personnel data:', error);
      return [];
    }
  };
  const roleFormatter = (params: GridValueGetterParams): string => {
    switch (params) {
      case 1:
        return 'superAdmin';
      case 2:
        return 'Admin';
      default:
        return 'User';
    }
  };
  const handleUpdateClick = () => {
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateClick = () => {
    setUpdateDialogOpen(false);
  };
  //delete
  const handleClickOpen = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await axios.delete(`https://localhost:7098/api/Staff?id=${deleteId}`);
        console.log('Đã xóa id:', deleteId);
        setOpen(false);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'STT', width: 50 },
    {
      field: 'employeeCode',
      headerName: 'Mã nhân viên',
      sortable: false,
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'staffName',
      headerName: 'Nhân viên',
      sortable: false,
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 300,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'role',
      headerName: 'Quyền',
      width: 150,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      valueGetter: roleFormatter,
    },

    // {
    //   field: 'per',
    //   headerName: 'Trạng thái',
    //   width: 150,
    //   sortable: false,
    //   headerAlign: 'center',
    //   align: 'center',
    //   renderCell: () => (
    //     <Box>
    //       {/* {params.value === 'active' ? 'Hoạt động' : 'Không hoạt động'} */}
    //       Chờ duyệt
    //     </Box>
    //   ),
    // },

    {
      field: 'actions',
      headerName: 'Thao Tác',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton color="inherit" onClick={handleUpdateClick}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              handleClickOpen(params.id as number);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
      align: 'center',
      headerAlign: 'center',
    },
  ];

  return (
    <Box sx={{ minWidth: 900 }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <SalaryUpdate open={updateDialogOpen} onClose={handleCloseUpdateClick} />
      <DeletePersonnel open={open} onClose={handleClose} onConfirm={handleDelete} />
    </Box>
  );
}
