import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetCurrentModule from '../../../hooks/useGetCurrentModule';
import useGetDetailLpaInformation from '../../hooks/useGetDetailLpaInformation';


const useModalDetailInformationLpa = (id: string) => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { module, process } = useGetCurrentModule();

  const { data } = useGetDetailLpaInformation({ bucketProcessId: processId, id, module, process });

  // Record activity when detail is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: `view lpa information detail (lpaId: ${id})`,
      });
    }
  }, [data, id, processId, module, process, recordActivity]);

  return {
    data,
  };
};

export default useModalDetailInformationLpa;
