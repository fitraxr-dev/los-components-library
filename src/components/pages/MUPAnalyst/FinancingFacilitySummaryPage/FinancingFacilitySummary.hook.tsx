import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPAnalystAccess } from '../hooks/useMUPAnalystAccess';


const useFinancingFacilitySummaryMUPAnalyst = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { baseMUPAnalystAccess } = useMUPAnalystAccess();
  const canView = baseMUPAnalystAccess.canView;

  useEffect(() => {
    if (canView) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({ processId }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: 'view MUP Analyst financing facility summary page',
      });
    }
  }, [recordActivity, processId, canView]);

  return {
    canView,
    recordActivity,
  };
};

export default useFinancingFacilitySummaryMUPAnalyst;
