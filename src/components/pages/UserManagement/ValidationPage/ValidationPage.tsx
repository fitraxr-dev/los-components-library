import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {

  return (
    <TableValidation
      module={TypeModule.USER_MANAGEMENT}
      process={TypeProcess.USER_MANAGEMENT}
    />
  );
};

export default ValidationPage;
