'use client';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';


const TableGroupDetail = ({ dataGroup }) => {
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
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell title="ID Group" value={dataGroup?.groupCode ?? '-'} />
          <Cell title="Nama Group" value={dataGroup?.groupName ?? '-'} />
          <Cell title="Jenis Group" value={dataGroup?.group?.key ?? '-'} />
          <Cell title="Sektor Industri" value={dataGroup?.sector?.key ?? '-'} />
          <Cell title="Modified Date" value={dataGroup?.lastModified ?? '-'} />
          <Cell title="Modified By" value={dataGroup?.modifiedBy ?? '-'} />
        </Box>
      </BaseContainer>
    </>
  );
};

export default TableGroupDetail;
