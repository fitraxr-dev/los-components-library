'use client';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';


const TableGroupInformation = ({ dataGroup }) => {
  const theme = useTheme();
  return (
    <>
      <BaseContainer
        sx={{
          boxShadow: 2,
          maxWidth: '100%',
          mt: theme.spacing(3),
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1),
            maxWidth: '50%',
          }}
        >
          <Cell title="ID Group" value={dataGroup?.id ?? '-'} />
          <Cell title="Nama Group" value={dataGroup?.name ?? '-'} />
          <Cell title="Jenis Group" value={dataGroup?.groupType ?? '-'} />
          <Cell title="Sektor Industri" value={dataGroup?.sectorLabel ?? '-'} />
          <Cell title="Modified Date" value={dataGroup?.modifiedDate ?? '-'} />
          <Cell title="Modified By" value={dataGroup?.modifiedBy ?? '-'} />
        </Box>
      </BaseContainer>
    </>
  );
};

export default TableGroupInformation;
