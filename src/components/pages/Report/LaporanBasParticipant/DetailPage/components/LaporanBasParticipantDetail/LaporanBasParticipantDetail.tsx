'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';


interface LaporanBasParticipantDetailProps {
  readonly data: any;
  readonly isLoading: boolean;
}

const LaporanBasParticipantDetail = ({ data, isLoading }: LaporanBasParticipantDetailProps) => {
  const detailCellData = [
    { title: 'Seq', value: data?.sequence },
    { title: 'Business Call Type', value: data?.businessCallType },
    { title: 'Participant', value: data?.participant },
    { title: 'Summary Alert', value: data?.summaryAlert },
    { title: 'Name', value: data?.name },
    { title: 'Business Courtesy Summary', value: data?.businessCourtesySummary },
    { title: 'Division', value: data?.division },
    { title: 'Maintenance Summary', value: data?.maintenanceSummary },
    { title: 'Business Call Date', value: data?.businessCallDate },
    { title: 'Monitoring Summary', value: data?.monitoringSummary },
    { title: 'Business Call Time', value: data?.businessCallTime },
    { title: 'Site Visit Remark', value: data?.siteVisitRemark },
    { title: 'Media', value: data?.media },
    { title: 'Pembahasan Dalam Business Call', value: data?.pembahasanDalamBusinessCall },
    { title: 'Perwakilan Client', value: data?.perwakilanClient },
    { title: 'Follow Up Items List', value: data?.followUpItemsList },
    { title: 'Perwakilan SMI', value: data?.perwakilanSmi },
    { title: 'Report Submission Date', value: data?.reportSubmissionDate },
    { title: 'Company Name', value: data?.companyName },
    { title: 'Approver Comments', value: data?.approverComments },
    { title: 'Group Name', value: data?.groupName },
    { title: 'Approver Status', value: data?.approverStatus },
    { title: 'New or Existing Client', value: data?.isNewClient },
    { title: 'Approver Date', value: data?.approvedDate },
    { title: 'Infrastructure Sector', value: data?.infrastructureSector },
    { title: 'Lampiran', value: data?.lampiran },
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

export default LaporanBasParticipantDetail;
