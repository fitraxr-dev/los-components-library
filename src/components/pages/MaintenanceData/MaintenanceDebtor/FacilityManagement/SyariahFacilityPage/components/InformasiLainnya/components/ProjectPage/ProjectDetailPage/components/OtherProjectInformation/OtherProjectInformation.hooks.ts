import { useEffect } from 'react';

import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';

import useGetMaintenanceProyekDetail from '@/components/pages/MaintenanceData/MaintenanceProyek/hooks/useGetMaintenanceProyekDetail';


const useOtherProjectInformation = () => {
  const { projectId } = useParams();
  const { control, reset, watch, setValue } = useFormContext();

  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: projectId as string });

  useEffect(() => {
    if (detailProyek !== undefined) {
      reset({
        otherInformation: detailProyek?.data?.content?.otherInformation,
      });
    }
  }, [detailProyek]);

  useEffect(() => {
    if (detailProyek) {
      setValue('otherInformation',
        {
          ...detailProyek?.data?.content?.otherInformation,
          modifiedDate: formatDateTime(detailProyek?.data?.content?.otherInformation?.modifiedDate) ?? '',
        },
      );

    }
  }, [detailProyek]);


  return {
    control,
    watch,
  };
};

export default useOtherProjectInformation;
