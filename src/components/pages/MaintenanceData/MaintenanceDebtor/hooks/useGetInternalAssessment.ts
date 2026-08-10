import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceInternalAssessmentControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoListMInternalAssessmentRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceInternalAssessmentControllerApi();

const useGetInternalAssessment = (payload: GenericBucketRequestDtoListMInternalAssessmentRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListMaintenanceInternalAssessment(payload);

      return res.data.data;
    },
    queryKey: ['get-internal-assessment-list', payload],
    select: (data) => data,
  });

  return query;
};

export default useGetInternalAssessment;
