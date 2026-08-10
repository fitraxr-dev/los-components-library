'use client';
import React from 'react';


import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {

  return (
    <TableValidation
      module={TypeModule.MAINTENANCE_DATA}
      process={TypeProcess.MAINTENANCE_CUSTOMER}
    />
  );
};

export default ValidationPage;
