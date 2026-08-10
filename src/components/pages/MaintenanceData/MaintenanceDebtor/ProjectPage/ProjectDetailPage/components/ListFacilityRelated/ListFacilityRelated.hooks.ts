import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';


import useGetListFacilityRelated from '../../hooks/useGetListFacilityRelated';


const useListFacilityRelated = () => {

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer project detail - list facility related page',
    });
  }, []);

  const { data } = useGetListFacilityRelated({
    filter: {
      id: 1,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  return {
    data,
  };


};

export default useListFacilityRelated;
