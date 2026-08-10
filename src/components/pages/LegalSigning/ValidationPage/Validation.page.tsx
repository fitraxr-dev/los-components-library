import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  return (
    <TableValidation
      module={TypeModule.ENGAGEMENT_AGREEMENT}
      process={TypeProcess.LEGAL_SIGNING}
    />
  );
};

export default ValidationPage;
