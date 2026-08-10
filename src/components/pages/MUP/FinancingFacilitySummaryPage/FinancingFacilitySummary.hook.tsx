import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPAccess } from '../hooks/useMUPAccess';


const useFinancingFacilitySummaryMUP = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const { baseMUPAccess, analystMUPAccess } = useMUPAccess();
  const canViewMUPList = baseMUPAccess.canView || analystMUPAccess.canView;

  useEffect(() => {
    if (canViewMUPList) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({ processId }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: 'view MUP financing facility summary page',
      });
    }
  }, [recordActivity, processId, canViewMUPList]);

  return {
    canViewMUPList,
    recordActivity,
  };
};

export default useFinancingFacilitySummaryMUP;
