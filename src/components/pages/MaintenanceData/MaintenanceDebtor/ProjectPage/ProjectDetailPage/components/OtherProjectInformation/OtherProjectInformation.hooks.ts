import { useEffect } from 'react';

import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { multiplyNominalValues } from '@/helpers/utils';
import useRecordLog from '@/hooks/useRecordLog';

import useGetMaintenanceProyekDetail from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useGetMaintenanceProyekDetail';


const useOtherProjectInformation = () => {
  const { projectId } = useParams();
  const { control, reset, watch } = useFormContext();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer project detail - other project information page',
    });
  }, []);

  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: projectId as string });

  useEffect(() => {
    if (detailProyek !== undefined) {
      reset({
        otherInformation: detailProyek?.data?.content?.otherInformation,
      });
    }

    console.log('control', control);
  }, [detailProyek]);


  return {
    control,
    watch,
  };
};

export default useOtherProjectInformation;
