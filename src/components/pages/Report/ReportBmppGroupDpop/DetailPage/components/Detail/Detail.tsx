'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';

import type { DetailProps } from './Detail.types';


const Detail = ({ data, isLoading }: DetailProps) => {
  const detailCellData = [
    { title: 'Group ID', value: data?.groupId },
    { title: 'Group Name', value: data?.groupName },
    { title: 'Group Type', value: data?.groupType },
    { title: 'Group Relation', value: data?.groupRelation },
    { title: 'Division', value: data?.division },
    { title: 'Modal', value: data?.modal },
    { title: 'Total Fasilitas Existing Group', value: data?.totalFasilitasExistingGroup },
    { title: 'Kelonggaran BMPP terhadap Group', value: data?.kelonggaranBmppGroup },
    { title: 'Persyaratan BMPP Group', value: data?.persyaratanBmppGroup },
    { title: 'Presentase Realisasi BMPP Group', value: data?.presentaseRealisasiBmppGroup },
    { title: 'Kesimpulan', value: data?.kesimpulan },
    { title: 'Informasi Penarikan Data Modal per', value: data?.informasiPenarikanDataModalPer },
    { title: 'Informasi Penarikan Data Tanggal Input Data Modal', value: data?.informasiTanggalInputDataModal },
    { title: 'Informasi Penarikan Data Fasilitas Existing', value: data?.informasiFasilitasExisting },
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
