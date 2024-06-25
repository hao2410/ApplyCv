'use client';

import { error } from 'console';

import * as React from 'react';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MailIcon from '@mui/icons-material/Mail';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';

import { logger } from '@/lib/default-logger';

import DeleteCandidate from './candidate-delete';
import CandidateEdit from './candidate-edit';
import InterviewScheduleForm from './candidate-interview';
import MailScheduleForm from './candidate-mail';

const StyledDataGrid = styled(DataGrid)(() => ({
  '.MuiDataGrid-columnHeaders': {
    backgroundColor: 'var(--icon-fontSize-md)',
  },
}));

export interface Candidate {
  // id: number;
  candidateId: number;
  candidateCode: string;
  name: string;
  email: string;
  phone: string;
  dateCreated: string;
  cv: string;
  status: number;
  recruitmentApplicantId: number;
  recruitmentApplicantDateStart: string;
  recruitmentApplicantEndDate: string;
  recruitmentApplicantStatus: number;
  vacanciesId: number;
  vacanciesRecruitmentCode: string;
  vacanciesTitle: string;
  vacanciesDescription: string;
  vacanciesQuantity: number;
  vacanciesRecruitmentClosingDate: string;
}

export interface CandidateEdittData {
  status: number;
  candidateCode: string;
  name: string;
}

export interface CandidateScheduleData {
  candidateId: number;
  recruitmentApplicantId: number;
  recruitmentApplicantDateStart: string;
  recruitmentApplicantEndDate: string;
  recruitmentApplicantStatus: number;
}

export interface CandidateMailScheduleData {
  candidateId: number;
  recruitmentApplicantId: number;
  recruitmentApplicantDateStart: string;
  recruitmentApplicantEndDate: string;
  recruitmentApplicantStatus: number;
  name: string;
  email: string;
}

export function CandidateTable(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Candidate[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // const [mailScheduleId, setMailScheduleId] = useState<number | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [mailScheduleOpen, setMailScheduleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [candidateDataId, setCandidateDataId] = useState<number | null>(null);
  const [CandidateData, setCandidateData] = useState<CandidateEdittData | null>(null);
  const [ScheduleData, setScheduleData] = useState<CandidateScheduleData | null>(null);
  const [MailScheduleData, setMailScheduleData] = useState<CandidateMailScheduleData | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCandidateData();
      setRows(data);
    };

    fetchData().catch((error: unknown) => {
      logger.error('Failed to fetch data:', error);
    });
  }, []);

  // data Candidate
  const fetchCandidateData = async (): Promise<Candidate[]> => {
    try {
      const response: AxiosResponse<Candidate[]> = await axios.get(
        'https://localhost:7098/api/Candidate/GetAllCandidates'
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch personnel data:', error);
      return [];
    }
  };

  // dialog phong van
  const handleScheduleOpen = async (id: number) => {
    // console.log('id:', id);
    setScheduleOpen(true);
    try {
      const responseRA: AxiosResponse<CandidateScheduleData> = await axios.get(
        `https://localhost:7098/api/Candidate/GetCandidateRAId/${id.toString()}`
      );
      const dataRA = responseRA.data;
      setScheduleData((prevScheduleData) => ({
        ...prevScheduleData,
        ...dataRA,
      }));
      // console.log('data:', dataRA);
    } catch (e) {
      logger.error('Error fetching vacancy data:', e);
    }
  };
  //edit
  const handleEditOpen = async (id: number) => {
    setCandidateDataId(id);
    setEditOpen(true);
    if (candidateDataId !== null) {
      try {
        const response: AxiosResponse<CandidateEdittData> = await axios.get(
          `https://localhost:7098/api/Candidate/by-id/${id.toString()}`
        );
        const data = response.data;
        setCandidateData((prevVacancyData) => ({
          ...prevVacancyData,
          ...data,
        }));
        // console.log("data:", data);
      } catch (error) {
        logger.error('Error fetching vacancy data:', error);
      }
    }
  };
  const handleDeleteOpen = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };
  const handleMailScheduleOpen = async (id: number) => {
    // setMailScheduleId(id);
    setMailScheduleOpen(true);
    try {
      const responseRA: AxiosResponse<CandidateMailScheduleData> = await axios.get(
        `https://localhost:7098/api/Candidate/GetCandidateRAId/${id.toString()}`
      );
      const dataRA = responseRA.data;
      setMailScheduleData((prevMailScheduleData) => ({
        ...prevMailScheduleData,
        ...dataRA,
      }));
      // console.log('data:', dataRA);
    } catch (err) {
      logger.error('Error fetching vacancy data:', err);
    }
  };
  //delete
  const handleClose = (): void => {
    setOpen(false);
    setEditOpen(false);
    setScheduleOpen(false);
  };
  const CloseMail = (): void => {
    setMailScheduleOpen(false);
  };
  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        const response = await axios.delete(`https://localhost:7098/api/Candidate?id=${deleteId.toString()}`);
        if (response.status === 200) {
          setRows((prevRows) => prevRows.filter((row) => row.candidateId !== deleteId));
          setOpen(false);
        } else {
          logger.error('Error deleting item: Unsuccessful response status:', response.status);
        }
      } catch (error) {
        logger.error('Error deleting item:', error);
      }
    }
  };
  const columns: GridColDef[] = [
    { field: 'candidateId', headerName: 'STT', width: 50 },
    {
      field: 'candidateCode',
      headerName: 'Mã Ứng Viên',
      sortable: false,
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Tên',
      width: 200,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'cv',
      headerName: 'CV',
      width: 250,
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
          <span style={{ backgroundColor: color, padding: '5px', borderRadius: '7px', color: 'white' }}>{status}</span>
        );
      },
    },
    {
      field: 'vacanciesTitle',
      headerName: 'Vị trí Tuyển Dụng',
      width: 300,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
    },
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
              void handleMailScheduleOpen(params.id as number).catch((error: unknown) => {
                logger.error('Error handling MailSchedule open:', error);
              });
            }}
          >
            <MailIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              void handleScheduleOpen(params.id as number).catch((error: unknown) => {
                logger.error('Error handling schedule open:', error);
              });
            }}
          >
            <ScheduleIcon />
          </IconButton>
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
              handleDeleteOpen(params.id as number);
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
        getRowId={(row) => row.candidateId}
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

      <DeleteCandidate open={open} onClose={handleClose} onConfirm={handleDelete} />
      {CandidateData && (
        <CandidateEdit
          open={editOpen}
          onClose={handleClose}
          CandidateData={CandidateData}
          setCandidateData={setCandidateData}
        />
      )}
      {ScheduleData && (
        <InterviewScheduleForm
          open={scheduleOpen}
          onClose={handleClose}
          ScheduleData={ScheduleData}
          setScheduleData={setScheduleData}
        />
      )}

      {MailScheduleData && (
        <MailScheduleForm open={mailScheduleOpen} onClose={CloseMail} MailScheduleData={MailScheduleData} />
      )}
    </Box>
  );
}
