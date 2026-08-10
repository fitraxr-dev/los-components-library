'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {

  return (
    <TableValidation
      module={TypeModule.HIGH_RISK}
      process={TypeProcess.HIGH_RISK_DK}
    />
  );
};


export default ValidationPage;
