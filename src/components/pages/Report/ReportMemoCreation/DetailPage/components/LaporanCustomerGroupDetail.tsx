'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';


interface DetailData {
  groupName: string;
  cif: string;
  groupId: string;
  customerName: string;
  jenisGroup: string;
  gam: string;
  sektorIndustriGroup: string;
  melampaui: string;
  customerId: string;
  dataMelampaui: string;
  additionalInfo?: {
    address: string;
    phone: string;
    email: string;
    website: string;
    establishedDate: string;
    businessType: string;
    employeeCount: string;
    annualRevenue: string;
    creditRating: string;
    relationshipManager: string;
    lastReviewDate: string;
  };
}

interface LaporanCustomerGroupDetailProps {
  data: DetailData | null;
  isLoading: boolean;
}

const LaporanCustomerGroupDetail = ({ data, isLoading }: LaporanCustomerGroupDetailProps) => {
  const detailCellData = [
    { title: 'Group Name', value: data?.groupName },
    { title: 'CIF', value: data?.cif },
    { title: 'Group ID', value: data?.groupId },
    { title: 'Customer Name', value: data?.customerName },
    { title: 'Jenis Group', value: data?.jenisGroup },
    { title: 'GAM', value: data?.gam },
    { title: 'Sektor Industri Group', value: data?.sektorIndustriGroup },
    { title: 'Melampaui BMPK/BMPD/BMPP group', value: data?.melampaui },
    { title: 'Customer ID', value: data?.customerId },
    { title: 'Data Melampaui BMPK/BMPD/BMPP as of', value: data?.dataMelampaui },
    { title: 'Address', value: data?.additionalInfo?.address },
    { title: 'Phone', value: data?.additionalInfo?.phone },
    { title: 'Email', value: data?.additionalInfo?.email },
    { title: 'Website', value: data?.additionalInfo?.website },
    { title: 'Established Date', value: data?.additionalInfo?.establishedDate },
    { title: 'Business Type', value: data?.additionalInfo?.businessType },
    { title: 'Employee Count', value: data?.additionalInfo?.employeeCount },
    { title: 'Annual Revenue', value: data?.additionalInfo?.annualRevenue },
    { title: 'Credit Rating', value: data?.additionalInfo?.creditRating },
    { title: 'Relationship Manager', value: data?.additionalInfo?.relationshipManager },
    { title: 'Last Review Date', value: data?.additionalInfo?.lastReviewDate },
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
        <TextStyle variant="body1">No data found</TextStyle>
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

export default LaporanCustomerGroupDetail;
