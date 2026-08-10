import { useEffect } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import useGetChildLimitProject from '../../../../hooks/useGetChildLimitProject';


const useProjectTab = () => {
  const { recordActivity } = useRecordLog();
  const params = useParams();
  const theme = useTheme();
  const { id } = params;

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view detail project',
    });
  }, []);

  const { data } = useGetChildLimitProject({
    facilityId: id as string,
  });

  return {
    data,
    theme,
  };
};
export default useProjectTab;
