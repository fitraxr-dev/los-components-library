import React from 'react';

import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { DATA_DUMMY, TABLE_HEADER } from './OtherAddress.constants';


const OtherAddress = () => {
  const theme = useTheme();
  return (
    <ColumnWrapper sx={{ gap: 2 }}>
      <SectionTitle title="Alamat Lainnya" isOpen>
        <BaseContainer>
          <Table tableData={DATA_DUMMY} tableHeader={TABLE_HEADER} />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default OtherAddress;
