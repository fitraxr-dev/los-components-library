'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';

import type { DetailProps } from './Detail.types';


const Detail = ({ data, isLoading }: DetailProps) => {
  const detailCellData = [
    { title: 'Username', value: data?.username },
    { title: 'Access', value: data?.access },
    { title: 'User ID', value: data?.userId },
    { title: 'Status', value: data?.status },
    { title: 'Position', value: data?.position },
    { title: 'Periode', value: data?.periode },
    { title: 'Origin Division', value: data?.originDivision },
    { title: 'Requester Name', value: data?.requesterName },
    { title: 'Destination', value: data?.destination },
    { title: 'Change Date', value: data?.changeDate },
  ];

  if (isLoading) {
    return (
      <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
        <TextStyle variant="body1">Loading...</TextStyle>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer sx={{ boxShadow: 7 }}>
      <Box
        sx={{
          '& .MuiGrid-root': {
            paddingY: 1,
          },
          display: 'grid',
          gridGap: 1,
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {detailCellData.map((cell) => (
          <Cell key={cell.title} title={cell.title} value={cell.value || '-'} />
        ))}
      </Box>
    </BaseContainer>
  );
};

export default Detail;
