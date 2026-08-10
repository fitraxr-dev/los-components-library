'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';


type ReportAssessmentApuPptDetailProps = {
  data?: any;
  isLoading: boolean;
};

const ReportAssessmentApuPptDetail = ({ data, isLoading }: ReportAssessmentApuPptDetailProps) => {
  const actualData = data?.data || data || {};

  const finalData = actualData?.data || actualData;

  const detailCellData = [
    { title: 'Master ID', value: finalData?.masterId || finalData?.master_id || finalData?.masterId },
    { title: 'Process ID', value: finalData?.processId || finalData?.process_id || finalData?.processId },
    { title: 'Customer ID', value: finalData?.customerId || finalData?.customer_id || finalData?.customerId },
    { title: 'CIF', value: finalData?.cif },
    { title: 'Customer Name', value: finalData?.customerName || finalData?.customer_name || finalData?.customerName },
    { title: 'Customer Category', value: finalData?.customerCategory || finalData?.customer_category || finalData?.customerCategory },
    { title: 'Institution Type', value: finalData?.institutionType || finalData?.institution_type || finalData?.institutionType },
    { title: 'Terdaftar dalam Database Kepatuhan', value: finalData?.terdaftarDalamDatabaseKepatuhan || finalData?.terdaftar_dalam_database_kepatuhan || finalData?.terdaftarDalamDatabaseKepatuhan },
    { title: 'High Risk', value: finalData?.highRisk || finalData?.high_risk || finalData?.highRisk },
  ];

  if (isLoading) {
    return (
      <BaseContainer sx={{ boxShadow: 7, p: 3 }}>
        <TextStyle variant="body1">Loading...</TextStyle>
      </BaseContainer>
    );
  }

  // Check if data exists
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

export default ReportAssessmentApuPptDetail;
