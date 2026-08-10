'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';


interface LaporanDetailCustomerPipelineDetailProps {
  readonly data?: any;
  readonly isLoading?: boolean;
}

const LaporanDetailCustomerPipelineDetail = ({ data, isLoading }: LaporanDetailCustomerPipelineDetailProps) => {
  const detailCellData = [
    { title: 'Customer ID', value: data?.customerId },
    { title: 'GAM', value: data?.gam },
    { title: 'ID Process', value: data?.processId },
    { title: 'Existing Plafond', value: data?.existingPlafond },
    { title: 'Data ID', value: data?.dataId },
    { title: 'Ada Penambahan Plafond/Pengajuan Baru', value: data?.addNewPlafond },
    { title: 'CIF', value: data?.cif },
    { title: 'Plafond Usulan (+)', value: data?.proposalPlafondPlus },
    { title: 'Customer Name', value: data?.customerName },
    { title: 'Plafond Usulan (−)', value: data?.proposalPlafondMinus },
    { title: 'Customer Status', value: data?.customerStatus },
    { title: 'Status', value: data?.status },
    { title: 'Process Type', value: data?.processType },
    { title: 'Pipeline Creation Date', value: data?.pipelineCreationDate },
    { title: 'Officer Name', value: data?.officerName },
    { title: 'Pipeline Approved Date', value: data?.pipelineApprovedDate },
    { title: 'Division Name', value: data?.divisionName },
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
        <TextStyle variant="body1">No data available</TextStyle>
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

export default LaporanDetailCustomerPipelineDetail;
