'use client';
import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
        remarks: 'View Validation Page LPS Core',
      });
    }

  }, [processId]);

  return (
    <TableValidation
      module={TypeModule.LPS}
      process={TypeProcess.LPS_CORE}
    />
  );
};

export default ValidationPage;
