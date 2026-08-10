import { useQuery } from '@tanstack/react-query';

import { MaintenanceInternalAssessmentControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoListMInternalAssessmentRequestDto,
  GenericBucketWithAdditionalDataResponseDtoMInternalAssessmentListResponseDtoGeneralAdditionalDataLastUpdated,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceInternalAssessmentControllerApi();
// GenericBucketWithAdditionalDataResponseDtoMInternalAssessmentListResponseDtoGeneralAdditionalDataLastUpdated

const useGetInternalAssessment = (
  payload: GenericBucketRequestDtoListMInternalAssessmentRequestDto, // eslint-disable-next-line max-len
  config?: Partial<UseQueryOptions<GenericBucketWithAdditionalDataResponseDtoMInternalAssessmentListResponseDtoGeneralAdditionalDataLastUpdated>>, componentIdentifier?: string) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListMaintenanceInternalAssessment(payload);
      return res?.data?.data;
    },
    ...config,
    queryKey: ['shareholder-internal-assessment', payload],
  });

  return query;
};

export default useGetInternalAssessment;
