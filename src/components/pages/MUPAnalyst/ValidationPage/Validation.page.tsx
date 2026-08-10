'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';

import useValidation from './Validation.hook';


const ValidationPage = () => {
  const { canView } = useValidation();

  if (!canView) {
    return null;
  }

  return (
    <TableValidation module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />
  );
};

export default ValidationPage;
