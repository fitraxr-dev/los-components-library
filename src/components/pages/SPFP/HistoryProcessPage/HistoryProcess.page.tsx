'use client';

import React from 'react';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import DetailHistory from './components/DetailHistory';
import useHistoryProcess from './HistoryProcess.hook';


const HistoryProcess = () => {
  const { history } = useHistoryProcess();
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
      remarks: `view history process page for bucket: ${bucket?.bucketProcessId}`,
    });
  }, [recordActivity, bucket?.bucketProcessId, bucket?.module, bucket?.process]);

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="History Proses" />
      {
        history.map((item, index) => (
          <DetailHistory data={item} key={`history-${index + 1}`} />
        ))
      }
    </ColumnWrapper>
  );
};

export default HistoryProcess;
