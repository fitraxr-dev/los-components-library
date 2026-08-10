'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';

import type { DetailProps } from './Detail.types';


const Detail = ({ data, isLoading }: DetailProps) => {
  const detailCellData = [
    { title: 'Customer ID', value: data?.customerId },
    { title: 'CIF', value: data?.cif },
    { title: 'Customer Name', value: data?.customerName },
    { title: 'Customer Status', value: data?.customerStatus },
    { title: 'Customer Type', value: data?.customerType },
    { title: 'Customer Relation', value: data?.customerRelation },
    { title: 'Division Name', value: data?.divisionName },
    { title: 'Modal Ekuitas', value: data?.modalEkuitas },
    { title: 'Total Fasilitas Existing Customer', value: data?.totalFasilitasExistingDebitur },
    { title: 'Persyaratan BMPP Individual', value: data?.persyaratanBmppIndividual },
    { title: 'Presentase Realisasi BMPP Individual', value: data?.presentaseRealisasiBmppIndividual },
    { title: 'Kesimpulan', value: data?.kesimpulan },
    { title: 'Informasi Penarikan Data Modal per Existing', value: data?.informasiPenarikanDataDataModalPer },
    { title: 'Informasi Penarikan Data Tanggal Input Data Modal', value: data?.informasiPenarikanDataTanggalInputDataModal },
    { title: 'Informasi Penarikan Data Fasilitas Existing', value: data?.informasiPenarikanDataFasilitasExisting },
    { title: 'Informasi Penarikan Data Usulan Fasilitas', value: data?.informasiPenarikanDataUsulanFasilitas },
    { title: 'Data BMPP by', value: data?.dataBmppBy },
    { title: 'Created Date', value: data?.createdDate },
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
