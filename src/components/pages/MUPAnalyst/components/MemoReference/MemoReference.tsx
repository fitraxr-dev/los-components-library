import React from 'react';

import { Box, useTheme } from '@mui/material';

import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';


const MemoReference = () => {
  const theme = useTheme();

  return (
    <>
      <SectionTitle title="Referensi Memo" sx={{ mb: 3 }} isOpen>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(2),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            label="ID"
            placeholder="ID"
            disabled
          />
          <Input
            label="Nama Dokumen"
            placeholder="Nama Dokumen"
            disabled
          />
          <Input
            label="Tanggal Dokumen"
            placeholder="Tanggal Dokumen"
            disabled
          />
        </Box>
      </SectionTitle>
    </>
  );
};

export default MemoReference;
