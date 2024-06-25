'use client';

import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import { Button, Dialog, DialogContent, Divider, Grid, Icon, IconButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Box, Stack } from '@mui/system';

import ApplyCv from './apply-cv';

export interface VancanciesDetailsProps {
  open: boolean;
  onClose: () => void;
  objectDetail: {
    id: number;
    title: string;
    salary: string;
    address: string;
    time: Date;
    // status: string;
    description: string;
    quantity: number;
    recruitmentClosingDate: string;
    startedDate: string;
  };
}

export default function VancanciesDetails({ open, onClose, objectDetail }: VancanciesDetailsProps): React.JSX.Element {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const handleApplyDialogOpen = () => {
    setApplyDialogOpen(true);
  };

  const handleApplyDialogClose = () => {
    setApplyDialogOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll={'body'}>
      <Typography variant="h4" sx={{ padding: '20px 20px 0 20px', fontWeight: 'bold' }}>
        {objectDetail?.title}
      </Typography>
      <Divider sx={{ marginTop: '2px' }} />
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
      <DialogContent
        sx={{
          minWidth: '500px',
          minHeight: '500px',
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={8} sx={{ paddingRight: '8px' }}>
            <Stack direction="column">
              <Box
                sx={{
                  // padding:'0 0px 0px 0px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                }}
              >
                Đóng bảo hiểm đầy đủ khi ký hợp đồng chính thức Địa điểm làm việc - Hà Nội: 85 Vũ Trọng Phụng, Thanh
                <Typography sx={{ marginTop: 2 }}>{objectDetail?.description}</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="column">
              <Box>
                <Box
                  sx={{
                    flexGrow: 0,
                    backgroundColor: '#EB202E',
                    borderRadius: '5px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    sx={{
                      color: 'white',
                    }}
                    onClick={handleApplyDialogOpen}
                  >
                    Ứng tuyển ngay
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2, marginBottom: 2 }}>
                  <Stack direction="column">
                    <Typography>Liên hệ HR</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src="/path/to/avatar.jpg" alt="Avatar" sx={{ marginRight: 1 }} />
                      <Stack direction="column">
                        <Typography sx={{ marginTop: 1 }}>Lê An Tú</Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" sx={{ marginTop: '10px' }}>
                      <Icon color="primary" fontSize="small" sx={{ marginRight: 1, overflow: 'inherit', padding: '0' }}>
                        <EmailIcon />
                      </Icon>
                      <Typography sx={{ marginLeft: '5px' }}>Email: </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <ApplyCv open={applyDialogOpen} onClose={handleApplyDialogClose} objectDetailVancan={objectDetail}  />
      </DialogContent>
    </Dialog>
  );
}
