import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceInternalAssessmentControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoListMInternalAssessmentRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceInternalAssessmentControllerApi();

const useGetInternalAssessmentList = (payload: GenericBucketRequestDtoListMInternalAssessmentRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListMaintenanceInternalAssessment(payload);

      return res.data.data;
    },
    queryKey: ['internal-assessment-list'],
  });
  return query;
};

export default useGetInternalAssessmentList;
