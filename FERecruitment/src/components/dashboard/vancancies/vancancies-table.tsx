'use client';

import * as React from 'react';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';

import { logger } from '@/lib/default-logger';

import DeleteVancancies from './vancancies-delete';
import VancanciesEdit from './vancancies-edit';

const StyledDataGrid = styled(DataGrid)(() => ({
  '.MuiDataGrid-columnHeaders': {
    backgroundColor: 'var(--icon-fontSize-md)',
  },
}));
export interface Vancancies {
  id: number;
  recruitmentCode: string;
  status: number;
  quantity: number;
  staffID: number;
  title: string;
  description: string;
  department: string;
  // recruitmentClosingDate: string;
}

export interface VancanciesEditData {
  status: number;
  quantity: number;
  title: string;
  description: string;
}

export function VancanciesTable(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [vacancyDataId, setVacancyDataId] = useState<number | null>(null);
  const [rows, setRows] = useState<Vancancies[]>([]);
  const [vacancyData, setVacancyData] = useState<VancanciesEditData | null>(null);

  const handleClickOpen = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleEditOpen = async (id: number) => {
    setVacancyDataId(id);
    setEditOpen(true);
    if (vacancyDataId !== null) {
      try {
        const response: AxiosResponse<VancanciesEditData> = await axios.get(
          `https://localhost:7098/api/Vancancies/by-id/${id}`
        );
        const data = response.data;
        setVacancyData((prevVacancyData) => ({
          ...prevVacancyData,
          ...data,
        }));
        // console.log("data:", data);
      } catch (error) {
        logger.error('Error fetching vacancy data:', error);
      }
    }
  };
  const handleClose = (): void => {
    setOpen(false);
    setEditOpen(false);
  };
  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await axios.delete(`https://localhost:7098/api/Vancancies?id=${deleteId.toString()}`);
        // await axios.delete(`https://localhost:7098/api/Vancancies?id=${deleteId}`);
        setRows(prevRows => prevRows.filter(row => row.id !== deleteId));
        setOpen(false);
      } catch (error) {
        logger.error('Error deleting item:', error);
      }
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPersonnelData();
      setRows(data);
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data:', error);
    });
  }, []);

  const fetchPersonnelData = async (): Promise<Vancancies[]> => {
    try {
      const response: AxiosResponse<Vancancies[]> = await axios.get('https://localhost:7098/api/Vancancies/GetAll');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch personnel data:', error);
      return [];
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'STT', width: 50 },
    {
      field: 'recruitmentCode',
      headerName: 'Mã Tuyển Dụng',
      sortable: false,
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'title',
      headerName: 'Tiêu Đề',
      width: 200,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'description',
      headerName: 'Mô Tả',
      width: 250,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'staffID',
      headerName: 'ID Nhân Viên',
      width: 150,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Trạng Thái',
      sortable: false,
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        let status = '';
        let color = '';
        switch (params.value) {
          case 1:
            status = 'Đang hoạt động';
            color = 'green';
            break;
          case 2:
            status = 'Bị đình chỉ';
            color = 'orange';
            break;
          default:
            status = 'Bị cấm';
            color = 'red';
            break;
        }
        return (
          <span style={{ backgroundColor: color, padding: '5px', borderRadius: '7px', color: 'white' }}>
            {status.split('').map((char, index) => (
              <span key={index} style={{ backgroundColor: color }}>
                {char}
              </span>
            ))}
          </span>
        );
      },
    },
    {
      field: 'quantity',
      headerName: 'Số Lượng',
      width: 100,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'department',
      headerName: 'Phòng Ban',
      width: 200,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    // {
    //   field: 'recruitmentClosingDate',
    //   headerName: 'Ngày Đóng Tuyển Dụng',
    //   width: 200,
    //   sortable: false,
    //   headerAlign: 'center',
    //   align: 'center',
    // },
    {
      field: 'actions',
      headerName: 'Thao Tác',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            color="inherit"
            onClick={() => {
              void handleEditOpen(params.id as number).catch((error: unknown) => {
                logger.error('Error handling edit open:', error);
              });
            }}
          >
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
      <DeleteVancancies open={open} onClose={handleClose} onConfirm={handleDelete} />
      {vacancyData &&<VancanciesEdit open={editOpen} onClose={handleClose} vacancyData={vacancyData} setVacancyData={setVacancyData} />}
    </Box>
  );
}
