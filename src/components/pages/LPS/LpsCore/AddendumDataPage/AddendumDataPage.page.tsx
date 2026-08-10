'use client';
import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import PkProcessingType from '@/components/shared/SmiSection/PK/components/PkProcessingType';

import useAddendumData from './AddendumData.hook';


const AddendumDataPage = () => {
  const { handleNextStep } = useAddendumData();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.LPS,
      process: TypeProcess.LPS_CORE,
      remarks: 'view addendum data page',
    });
  }, [processId, recordActivity]);
  return (
    <PkProcessingType
      module={TypeModule.LPS}
      process={TypeProcess.LPS_CORE}
      handleNextTab={handleNextStep}
      isAskForInfo={false}
    />
  );
};

export default AddendumDataPage;
