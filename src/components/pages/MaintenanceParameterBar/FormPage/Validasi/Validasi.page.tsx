'use client';
import * as React from 'react';

import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidasiPage = () => {
  const params = useParams();
  const { recordActivity } = useRecordLog();
  const { push, reset } = useBreadcrumbs();
  const bucketProcessId = (params as any)?.processId;

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-bar', label: 'Mapping Business Call & Business Call Summary' });
    push({ label: 'Validasi' });
  }, [push, reset]);

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-bar',
      module: 'parameter-bar',
      process: 'validasi',
      remarks: 'View Parameter Mapping Bar Validasi',
    });
  }, [recordActivity, bucketProcessId]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <TableValidation
        id={bucketProcessId}
        module={TypeModule.PARAMETER_BUSINESS_CALL}
        process={TypeProcess.PARAMETER_BUSINESS_CALL}
      />
    </ColumnWrapper>
  );
};

export default ValidasiPage;
