'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';


const CreateValidasiPage = () => {
  const params = useParams();
  const { push, reset } = useBreadcrumbs();

  const bucketProcessId = (params as any)?.processId;

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-va', label: 'Parameter VA' });
    push({ href: null, label: 'Create Validasi' });
  }, [push, reset]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <TableValidation
        id={bucketProcessId}
        module={TypeModule.PARAMETER_VA}
        process={TypeProcess.PARAMETER_VA}
      />
    </ColumnWrapper>
  );
};

export default CreateValidasiPage;
