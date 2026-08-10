import { useQuery } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { DebtorInformationDetailDto, RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ApplicationDebtorControllerApi();

const useGetDetailBucketDebtor = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<DebtorInformationDetailDto>>
) => {
  const query = useQuery({
    enabled: !!payload.bucketProcessId && !!payload.module && !!payload.process,
    queryFn: async () => {
      const res = await api.detailBucketDebtor(payload);

      const content = res.data.data.content;

      return content;
    },
    queryKey: ['detail-bucket-debtor' + payload.process, payload],
    ...config,
  });

  return query;
};

export default useGetDetailBucketDebtor;
