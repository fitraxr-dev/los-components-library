'use client';
import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useLpsBastContext } from '@/components/layouts/LpsLayoutBast/LpsLayoutBast.context';

import ViewAllDocument from '../../components/ViewAllDocument';


const ViewAllDocumentPage = () => {
  const { isDivisiBisnis, isSuperAdmin } = useLpsBastContext();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const isLpsbd = processId?.toUpperCase().includes('LPSBD');
  const isBastDpop = (!isSuperAdmin && !isDivisiBisnis) || (isSuperAdmin && isLpsbd);

  const process = isBastDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST;

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.LPS,
      process,
      remarks: 'view all document page',
    });
  }, [processId, process, recordActivity]);

  return (
    <ViewAllDocument
      module={TypeModule.LPS}
      process={process}
    />
  );
};

export default ViewAllDocumentPage;
