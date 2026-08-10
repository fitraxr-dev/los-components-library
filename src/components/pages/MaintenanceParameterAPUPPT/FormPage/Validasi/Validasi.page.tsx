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
  const { push, reset } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();

  // Get bucketProcessId from params
  const bucketProcessId = (params as any)?.processId;

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-apu_ppt', label: 'Parameter Mapping APU PPT' });
    push({ label: 'Validasi' });

    // Record activity for page access
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: '/master-parameter/parameter-mapping-apu_ppt/validasi',
      module: 'PARAMETER_APU_PPT',
      process: 'PARAMETER_APU_PPT',
      remarks: 'Accessed Parameter Mapping APU PPT Validasi page',
    });
  }, [push, reset, recordActivity, bucketProcessId]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <TableValidation
        id={bucketProcessId}
        module={TypeModule.PARAMETER_APU_PPT}
        process={TypeProcess.PARAMETER_APU_PPT}
      />
    </ColumnWrapper>
  );
};

export default ValidasiPage;
