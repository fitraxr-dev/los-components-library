import { useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import useRecordLog from '@/hooks/useRecordLog';

import useGetMaintenanceProyekDetail from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useGetMaintenanceProyekDetail';


const useContractor = () => {
  const { control, setValue } = useFormContext();
  const { projectId } = useParams();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer project detail - contractor page',
    });
  }, []);

  // API DETAIL
  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: projectId as string });

  useEffect(() => {
    if (detailProyek !== undefined) {
      setValue('contractor.address', detailProyek?.data?.content?.contractor?.address.value ?? '');
      setValue('contractor.classification', detailProyek?.data?.content?.contractor?.classification.value ?? '');
      setValue('contractor.contactName', detailProyek?.data?.content?.contractor?.contactName.value ?? '');
      setValue('contractor.email', detailProyek?.data?.content?.contractor?.email.value ?? '');
      setValue('contractor.modifiedBy', detailProyek?.data?.content?.contractor?.modifiedBy ?? '');
      setValue('contractor.modifiedDate', formatDateTime(detailProyek?.data?.content?.contractor?.modifiedDate) ?? '');
      setValue('contractor.name', detailProyek?.data?.content?.contractor?.name.value ?? '');
      setValue('contractor.phone.phoneCode', detailProyek?.data?.content?.contractor?.phone.value.phoneCode ?? '');
      setValue('contractor.phone.phoneNumber', detailProyek?.data?.content?.contractor?.phone.value.phoneNumber ?? '');
      setValue('contractor.phone.phoneExt', detailProyek?.data?.content?.contractor?.phone.value.phoneExt ?? '');
      setValue('contractor.website', detailProyek?.data?.content?.contractor?.website.value ?? '');
    }

    console.log('control', control);
  }, [detailProyek]);

  return {
    control,
  };
};

export default useContractor;
