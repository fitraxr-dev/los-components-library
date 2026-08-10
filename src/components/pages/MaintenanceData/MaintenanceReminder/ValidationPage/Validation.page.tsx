'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const ValidationPage = () => {
  // Record Activity
  const { recordActivity } = useRecordLog();

  const params = useParams();
  const processId = params.id as string;
  const isIdBucket = processId.includes('RMD');
  const processIdToUse = (isIdBucket ? processId : null);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processIdToUse,
      module: TypeModule.MAINTENANCE_REMINDER,
      process: TypeProcess.MAINTENANCE_REMINDER,
      remarks: 'view validation data maintenance reminder',
    });
  }, []);

  return (
    <TableValidation
      module={TypeModule.MAINTENANCE_REMINDER}
      process={TypeProcess.MAINTENANCE_REMINDER}
    />
  );
};


export default ValidationPage;
