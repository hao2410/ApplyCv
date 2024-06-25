import * as React from 'react';
import { useState } from 'react';
// import EventIcon from '@mui/icons-material/Event';
import { Box, Icon, Stack, Typography } from '@mui/material';
import VancanciesDetails from '../detail/detail-vancancies';
// import Link from 'next/link';


interface ItemObject {
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
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function BoxItem({ itemObject }: { itemObject: ItemObject }): React.JSX.Element {
  const [selectedItem] = useState(itemObject);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const handleOpenDetail = () => {
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };
  const [hovered, setHovered] = useState(false);

  return (
    // <Link href="/detail/${selectedItem.id">
    <Box>
      <Box
        sx={{
          width: '450px',
          height: '270px',
          boxShadow: '3px 3px 22px 1px rgb(0 0 0 / 20%)',
          background: '#ffffff',
          padding: '30px',
          borderRadius: '5px',
          textDecoration: 'none',
        }}
        onClick={handleOpenDetail}
      >
        <Stack direction="column" gap={3}>
          <Typography sx={{ fontWeight: 'bold', color: 'black' }}>{selectedItem.title}</Typography>
          {/* <Stack direction="column"> */}
          <Typography sx={{ color: 'red' }}>Số lượng cần tuyển:{selectedItem.quantity}</Typography>
          {/* </Stack> */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">{selectedItem.address}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <Icon>
                  <EventIcon />
                </Icon> */}
                <Typography variant="body2">
                  Ngày đóng nhận hồ sơ: {formatDate(selectedItem.recruitmentClosingDate)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
      <VancanciesDetails
        open={isDetailOpen}
        onClose={handleCloseDetail}
        objectDetail={selectedItem}
        key={selectedItem.id}
      />
    </Box>
  );
}
