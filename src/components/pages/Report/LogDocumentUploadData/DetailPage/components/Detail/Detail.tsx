'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';

import type { DetailProps } from './Detail.types';


const Detail = ({ data, isLoading }: DetailProps) => {
  const detailCellData = [
    { title: 'CustomerId', value: data?.customerId },
    { title: 'User Division', value: data?.userDivision },
    { title: 'CIF', value: data?.cif },
    { title: 'Menu', value: data?.menu },
    { title: 'Customer Name', value: data?.customerName },
    { title: 'Activity', value: data?.activity },
    { title: 'Division Name', value: data?.divisionName },
    { title: 'Date', value: data?.date },
    { title: 'User ID', value: data?.userId },
    { title: 'Perubahan (Before)', value: data?.before },
    { title: 'Username', value: data?.userName },
    { title: 'Perubahan (After)', value: data?.after },
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
