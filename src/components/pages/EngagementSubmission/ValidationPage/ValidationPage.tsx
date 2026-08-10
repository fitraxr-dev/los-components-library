import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ValidationTable from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  return (
    <ValidationTable
      module={TypeModule.ENGAGEMENT_AGREEMENT}
      process={TypeProcess.ENGAGEMENT_AGREEMENT}
    />
  );
};

export default ValidationPage;
