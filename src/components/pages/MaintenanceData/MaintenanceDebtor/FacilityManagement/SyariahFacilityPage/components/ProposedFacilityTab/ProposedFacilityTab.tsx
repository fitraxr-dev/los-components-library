import React from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';

import TableFinancingFacility from '../FinancingFacility';
import TableLimitIndukSyariah from '../LimitIndukSyariah';


const isComing = false;
const ProposedFacilityTab = () => {

  const theme = useTheme();
  if (isComing) {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        <EmptyPlaceholder status="coming-soon" />
      </ColumnWrapper>
    );
  }

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <TableLimitIndukSyariah />
      <TableFinancingFacility />
    </ColumnWrapper>
  );
};

export default ProposedFacilityTab;
