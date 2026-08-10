'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {

  return (
    <TableValidation
      module={TypeModule.PIPELINE}
      process={TypeProcess.PIPELINE}
    />
  );
};

export default ValidationPage;
