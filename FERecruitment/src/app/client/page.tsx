'use client';
import * as React from 'react';

import { useMemo, useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, InputAdornment, Pagination, TextField } from '@mui/material';
import axios from 'axios';

import { BoxItem } from '@/components/client/layout/box-item';
import { logger } from '@/lib/default-logger';

// Định nghĩa kiểu dữ liệu cho các mục
interface Item {
  id: number;
  logo: string;
  title: string;
  salary: string;
  address: string;
  time: Date;
  status: string;
  description: string;
  quantity: number;
  recruitmentClosingDate: string; // Thêm thuộc tính recruitmentClosingDate
  startedDate: string; // Thêm thuộc tính startedDate
}

export default function Page(): React.JSX.Element {
  const [page, setPage] = useState(0);
  const [itemList, setItemList] = useState<Item[]>([]);
  const itemsPerPage = 6;

  useEffect(() => {
    // Hàm để lấy dữ liệu từ API
    const fetchData = async () => {
      try {
        const response = await axios.get<Item[]>('https://localhost:7098/api/Vancancies/GetAll');
        setItemList(response.data);
      } catch (error) {
        logger.error('Error fetching data from API', error);
      }
    };
     fetchData();
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(itemList.length / itemsPerPage),
    [itemList.length, itemsPerPage]
  );

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageItems = useMemo(
    () => itemList.slice(startIndex, endIndex),
    [itemList, startIndex, endIndex]
  );

  return (
    <Box>
      <Box
        sx={{
          boxShadow: '3px 3px 22px 1px rgb(0 0 0 / 20%)',
          background: '#ffffff',
          padding: '30px',
          marginBottom: '50px',
        }}
      >
        <Grid container spacing={1} sx={{ paddingBottom: '10px' }}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              id="outlined-basic"
              size="small"
              placeholder="TÌm nhanh việc làm"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={4}>
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
              >
                Tìm kiếm
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={{ xs: 1, md: 2 }}>
        {currentPageItems.map((item) => (
          <Grid item xs={6} sm={4} md={4} key={item.id}>
            <BoxItem itemObject={item} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(event, value) => {
            setPage(value - 1);
          }}
          size="small"
          sx={{ pt: 2 }}
        />
      </Box>
    </Box>
  );
}
