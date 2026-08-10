'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';

import useValidation from './Validation.hook';


const ValidationPage = () => {
  const { bucketProcessId, isHasProcessId } = useValidation();

  return (
    <TableValidation
      id={isHasProcessId ? null : bucketProcessId}
      module={TypeModule.ACCESS_MENU}
      process={TypeProcess.ACCESS_MENU}
    />
  );
};

export default ValidationPage;
