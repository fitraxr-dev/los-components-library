'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import useValidation from './Validation.hook';


const ValidationPage = () => {
  const { bucketProcessId, handleCancel } = useValidation();
  return (
    <>
      <TableValidation
        id={bucketProcessId}
        module={TypeModule.VA_CREATION}
        process={TypeProcess.VA_CREATION}
      />
      <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 2 }}>
        <Button variant="outlined" onClick={handleCancel}>
          Close
        </Button>
      </RowWrapper>
    </>
  );
};

export default ValidationPage;
