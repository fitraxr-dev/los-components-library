'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';

import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


const Validation = () => {
  const theme = useTheme();
  const { process } = useApuPpt();

  return (
    <ColumnWrapper >
      <ConfirmationLatest />
      <ColumnWrapper gap={theme.spacing(3)}>
        <TableValidation
          module={TypeModule.APU_PPT}
          process={process}
        />
      </ColumnWrapper>
    </ColumnWrapper>

  );
};

export default Validation;
