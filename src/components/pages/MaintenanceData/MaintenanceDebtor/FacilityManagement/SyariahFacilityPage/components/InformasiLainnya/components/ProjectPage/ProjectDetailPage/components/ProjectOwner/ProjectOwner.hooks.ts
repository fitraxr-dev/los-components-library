import { useEffect, useMemo } from 'react';

import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';

import useGetMaintenanceProyekDetail from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useGetMaintenanceProyekDetail';


const useProjectOwner = () => {
  const { control, setValue } = useFormContext();
  const { projectId } = useParams();

  // API DETAIL
  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: projectId as string });

  useEffect(() => {
    if (detailProyek) {
      setValue('owner.address', detailProyek?.data?.content?.owner?.address.value ?? '');
      setValue('owner.contactName', detailProyek?.data?.content?.owner?.contactName.value ?? '');
      setValue('owner.email', detailProyek?.data?.content?.owner?.email.value ?? '');
      setValue('owner.modifiedBy', detailProyek?.data?.content?.owner?.modifiedBy ?? '');
      setValue('owner.modifiedDate', formatDateTime(detailProyek?.data?.content?.owner?.modifiedDate) ?? '');
      setValue('owner.name', detailProyek?.data?.content?.owner?.name.value ?? '');
      setValue('owner.phone.phoneCode', detailProyek?.data?.content?.owner?.phone.value.phoneCode ?? '');
      setValue('owner.phone.phoneNumber', detailProyek?.data?.content?.owner?.phone.value.phoneNumber ?? '');
      setValue('owner.phone.phoneExt', detailProyek?.data?.content?.owner?.phone.value.phoneExt ?? '');
      setValue('owner.website', detailProyek?.data?.content?.owner?.website.value ?? '');
    }
  }, [detailProyek]);

  return {
    control,
  };
};

export default useProjectOwner;
