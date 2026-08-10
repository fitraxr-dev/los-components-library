import React from 'react';

import { Box, useTheme } from '@mui/material';


import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import useMemoReference from './MemoReference.hook';

import type { MemoReferenceProps } from './MemoReference.type';


const MemoReference = (props: MemoReferenceProps) => {
  const theme = useTheme();
  const { documentData } = useMemoReference(props);

  return (
    <SectionTitle title="Referensi Memo" isOpen sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Input
          label="Nomor Dokumen"
          placeholder="Nomor Dokumen"
          disabled
          value={documentData?.documentNumber}
        />
        <Input
          label="Nama Dokumen"
          placeholder="Nama Dokumen"
          disabled
          value={documentData?.fileName}
        />
        <Input
          label="Tanggal Dokumen"
          placeholder="Tanggal Dokumen"
          disabled
          value={documentData?.documentDate}
        />
      </Box>
    </SectionTitle>
  );
};

export default MemoReference;
