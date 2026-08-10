import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ValidationTable from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  return (
    <ValidationTable module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />
  );
};

export default ValidationPage;
