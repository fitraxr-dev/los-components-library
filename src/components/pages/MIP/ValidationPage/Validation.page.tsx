'use client';
import React, { useContext } from 'react';

import useApp from '@/hooks/useApp';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  const [state, _] = useApp();

  return (
    <TableValidation
      module={state.pages.mipModule}
      process={state.pages.mipProcess}
    />
  );
};

export default ValidationPage;
