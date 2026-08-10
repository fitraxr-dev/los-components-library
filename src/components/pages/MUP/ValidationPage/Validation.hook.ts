import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPAccess } from '../hooks/useMUPAccess';


const useValidation = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { baseMUPAccess } = useMUPAccess();
  const canView = baseMUPAccess.canView;

  useEffect(() => {
    if (!canView) {
      return;
    }

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'view Validation page',
    });
  }, [canView, processId, recordActivity]);

  return {
    canView,
  };
};

export default useValidation;
