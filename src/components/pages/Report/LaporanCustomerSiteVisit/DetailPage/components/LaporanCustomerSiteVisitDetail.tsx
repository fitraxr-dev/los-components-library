'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';


interface LaporanCustomerSiteVisitDetailProps {
  readonly data: any;
  readonly isLoading: boolean;
}

const LaporanCustomerSiteVisitDetail = ({ data, isLoading }: LaporanCustomerSiteVisitDetailProps) => {
  const detailCellData = [
    { title: 'ID', value: data?.id },
    { title: 'Actual End Date', value: data?.actualEndDate },
    { title: 'Customer ID', value: data?.customerId },
    { title: 'No Document', value: data?.noDoc },
    { title: 'CIF', value: data?.cif },
    { title: 'Tanggal Document', value: data?.tanggalDoc },
    { title: 'Customer Name', value: data?.customerName },
    { title: 'Creator', value: data?.creator },
    { title: 'Proyek', value: data?.proyek },
    { title: 'Divisi Creator', value: data?.divisiCreator },
    { title: 'Actual Start Date', value: data?.actualStartDate },
    { title: 'Lokasi Site Visit', value: data?.lokasiSiteVisit },
  ];

  if (isLoading) {
    return (
      <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
        <TextStyle variant="body1">Loading...</TextStyle>
      </BaseContainer>
    );
  }

  if (!data) {
    return (
      <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
        <TextStyle variant="body1" color="text.secondary">
          No data found
        </TextStyle>
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

export default LaporanCustomerSiteVisitDetail;
