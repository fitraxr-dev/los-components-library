'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';


interface DetailData {
  id: string;
  idProcess: string;
  customerStatus: string;
  vaRequestDate: string;
  vaReviewDate: string;
  vaApprovedDate: string;
  vaActivationDate: string;
  vaNumber: string;
  statusVa: string;
  typeOfVa: string;
  facilityData: string;
  officerName: string;
  customerName: string;
  gam: string;
}

interface LaporanCustomerVirtualAccountDetailProps {
  data: DetailData | null;
  isLoading: boolean;
}

const LaporanCustomerVirtualAccountDetail = ({ data, isLoading }: LaporanCustomerVirtualAccountDetailProps) => {
  const detailCellData = [
    { title: 'ID Process', value: data?.idProcess },
    { title: 'Customer Status', value: data?.customerStatus },
    { title: 'VA Request Date', value: data?.vaRequestDate },
    { title: 'VA Review Date', value: data?.vaReviewDate },
    { title: 'VA Approved Date', value: data?.vaApprovedDate },
    { title: 'VA Activation Date', value: data?.vaActivationDate },
    { title: 'VA Number', value: data?.vaNumber },
    { title: 'Status VA', value: data?.statusVa },
    { title: 'Type of VA', value: data?.typeOfVa },
    { title: 'Facility Data', value: data?.facilityData },
    { title: 'Officer Name', value: data?.officerName },
    { title: 'Division Name', value: data?.customerName },
    { title: 'GAM', value: data?.gam },
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

export default LaporanCustomerVirtualAccountDetail;
