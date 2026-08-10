import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-service';


const openapi = new BucketControllerApi();

type Payload = Partial<RequestByIdDtoLong> & {
  facilityId?: string;
  bucketProcessId?: string;
};

const useGetDetailFinancingFacility = (payload: Payload) => {
  const enabledByCombo = payload?.facilityId && payload?.bucketProcessId;
  const enabledById = payload?.id !== null && payload?.id !== undefined;

  const query = useQuery({
    enabled: Boolean(enabledByCombo || enabledById),
    queryFn: async () => {
      if (enabledByCombo) {
        const res = await API('bucket.financialFacility.detail', {
          data: {
            bucketProcessId: payload.bucketProcessId,
            facilityId: payload.facilityId,
          },
        });
        return res.data?.data?.content ?? [];
      }

      const res = await openapi.getDetailFinancingFacility({ id: payload.id });
      return res.data.data.content;
    },
    queryKey: ['financing-facility-detail', payload?.facilityId, payload?.bucketProcessId, payload?.id],
  });

  return query;
};

export default useGetDetailFinancingFacility;
