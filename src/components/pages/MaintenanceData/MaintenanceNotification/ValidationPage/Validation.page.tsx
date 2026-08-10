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
  const isIdBucket = processId.includes('NTF');
  const processIdToUse = (isIdBucket ? processId : null);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processIdToUse,
      module: TypeModule.MAINTENANCE_NOTIFICATION,
      process: TypeProcess.MAINTENANCE_NOTIFICATION,
      remarks: 'view validation data maintenance notification',
    });
  }, []);

  return (
    <TableValidation
      module={TypeModule.MAINTENANCE_NOTIFICATION}
      process={TypeProcess.MAINTENANCE_NOTIFICATION}
    />
  );
};


export default ValidationPage;
