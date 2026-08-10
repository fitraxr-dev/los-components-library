'use client';
import React, { useEffect } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';

import useValidation from './Validation.hook';


const ValidationPage = () => {
  const { bucketProcessId, isHasProcessId } = useValidation();

  return (
    <TableValidation
      id={isHasProcessId ? null : bucketProcessId}
      module={TypeModule.USER_MANAGEMENT}
      process={TypeProcess.USER_MANAGEMENT}
    />
  );
};

export default ValidationPage;
