'use client';
import * as React from 'react';

import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import ValidationTable from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


const ValidationPage = () => {
  const { processId: processIdParams }: { processId: string } = useParams();
  const bucket = useSpfpBucketContext();
  const { recordActivity } = useRecordLog();

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: bucket?.bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      module: bucket?.module || '',
      process: bucket?.process || '',
      remarks: `view validation page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);

  const [state] = useApp();
  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDpop && (
        <ConfirmationLatest />
      )}
      <ValidationTable
        {...bucket}
      />
    </ColumnWrapper>
  );
};


export default ValidationPage;
