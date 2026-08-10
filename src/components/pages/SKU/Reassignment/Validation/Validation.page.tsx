'use client';

import React, { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import TableValidation from '@/components/shared/SmiTable/TableValidation';


const Validation = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(processId),
        changeAfter: JSON.stringify({ processId }),
        module: TypeModule.REASSIGNMENT_SKU,
        process: TypeProcess.REASSIGNMENT_SKU,
        remarks: 'view validation page',
      });
    }
  }, [processId, recordActivity]);


  return (
    <TableValidation
      module={TypeModule.REASSIGNMENT_SKU}
      process={TypeProcess.REASSIGNMENT_SKU}
    />
  );
};

export default Validation;
