import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoMaintenanceConclusionFilterRequest } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useGetHighriskData = (
  payload: GenericBucketRequestDtoMaintenanceConclusionFilterRequest,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.findInternalAssesmentHighRiskByDebtor(payload);
        return res?.data;
      },
      queryKey: [
        'maintenance-highrisk-data',
        payload
      ],
    }
  );

  return query;

};

export default useGetHighriskData;
