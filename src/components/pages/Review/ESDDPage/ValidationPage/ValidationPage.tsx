'use client';

import React, { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


import ColumnWrapper from '@/components/shared/ColumnWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';


const ValidationPage = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(processId),
        changeAfter: JSON.stringify({ processId }),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'view validation page',
      });
    }
  }, [processId, recordActivity]);


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />
      <TableValidation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />
    </ColumnWrapper>
  );
};

export default ValidationPage;
