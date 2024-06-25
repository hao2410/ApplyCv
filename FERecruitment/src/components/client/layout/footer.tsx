'use client';

import * as React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';

export default function ResponsiveFooter(): React.JSX.Element {
  return (
    <Box sx={{ backgroundColor: '#222222', color: '#ffffff', padding: '30px 60px' }}>
      <Typography variant="h3" sx={{ mb: '30px' }}>
        VSMART
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h5" sx={{ mb: '30px', alignItems: 'flex-start' }}>
              Công ty cổ phần VSMART
            </Typography>
            <Stack spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
              <Typography variant="body1">Điện thoại: 024.73095555</Typography>
              <Typography variant="body1">Điện thoại: 024 3974 3413</Typography>
              <Typography variant="body1">Email: bantuyendung@abc.vn</Typography>
              <Typography variant="body1">Website: job.abc.vn</Typography>
              <Typography variant="body1">
                Địa chỉ:Số 1 Nguyễn Huy Tưởng,
                Thanh Xuân, Hà Nội
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h5" sx={{ mb: '30px', alignItems: 'flex-start' }}>
              Việc theo ngành nghề
            </Typography>
            <Stack spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
              <Typography variant="body1">Công nghệ thông tin</Typography>
              <Typography variant="body1">Truyền thông quảng cáo</Typography>
              <Typography variant="body1">Báo chí nội dung </Typography>
              <Typography variant="body1">Các ngành nghề khác</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h5" sx={{ mb: '30px', alignItems: 'flex-start' }}>
              Về chúng tôi
            </Typography>
            <Stack spacing={1} sx={{ width: '100%', alignItems: 'flex-start' }}>
              <Typography variant="body1">Giới thiệu</Typography>
              <Typography variant="body1">Chính sách đãi ngộ</Typography>
              <Typography variant="body1">Điều khoản sử dụng</Typography>
              <Typography variant="body1">Chính sách bảo mật</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h5" sx={{ mb: '30px', alignItems: 'flex-start' }}>
              Kết nối với chúng tôi
            </Typography>
            <Stack spacing={1} sx={{ alignItems: 'flex-start', width: '100%' }}>
              <Typography variant="body1">Fanpage</Typography>
              <Typography variant="body1">LinkedIn</Typography>
              <Typography variant="body1">TikTok</Typography>
              <Typography variant="body1">YouTube</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
