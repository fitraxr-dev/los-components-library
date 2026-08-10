import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPAnalystAccess } from '../hooks/useMUPAnalystAccess';


const useValidation = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { baseMUPAnalystAccess } = useMUPAnalystAccess();
  const { canView } = baseMUPAnalystAccess;

  useEffect(() => {
    if (canView) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MUP,
        process: TypeProcess.MUP_ANALYST,
        remarks: 'View Validation page',
      });
    }
  }, [canView, processId, recordActivity]);

  return {
    canView,
  };
};

export default useValidation;
