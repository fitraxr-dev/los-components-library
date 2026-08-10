'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidasiPage = () => {
  const params = useParams();
  const { push, reset } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-lov', label: 'Parameter LOV' });
    const currentPath = window.location.pathname;
    push({ href: currentPath, label: 'Validasi' });
  }, [push, reset]);

  // Record activity for initial page load
  React.useEffect(() => {
    const description = decodeURIComponent(params.description as string);
    const processId = params.processId as string;
    const moduleName = params.module as string;

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      menuCode: 'parameter-lov',
      module: moduleName,
      process: 'parameter-lov',
      remarks: `view validasi step in parameter lov: ${description}`,
    });
  }, [params, recordActivity]);

  // Get bucketProcessId from params
  const bucketProcessId = (params as any)?.processId;

  return (
    <TableValidation
      id={bucketProcessId}
      module={TypeModule.PARAMETER_LOV}
      process={TypeProcess.PARAMETER_LOV}
    />
  );
};

export default ValidasiPage;
