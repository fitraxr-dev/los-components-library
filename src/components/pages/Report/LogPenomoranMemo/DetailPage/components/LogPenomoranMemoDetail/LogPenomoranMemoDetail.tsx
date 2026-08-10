'use client';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import TextStyle from '@/components/shared/TextStyle';

import type { LogPenomoranMemoDetailProps } from './LogPenomoranMemoDetail.types';


const LogPenomoranMemoDetail = ({ data, isLoading }: LogPenomoranMemoDetailProps) => {
  const detailCellData = [
    { title: 'No Digital Document', value: data?.noDigitalDocument },
    { title: 'Division Releaser', value: data?.divisionReleaser },
    { title: 'Document Name', value: data?.documentName },
    { title: 'Target Division', value: data?.targetDivision },
    { title: 'Customer Name', value: data?.customerName },
    { title: 'Digital Document Name', value: data?.digitalDocumentName },
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

export default LogPenomoranMemoDetail;
