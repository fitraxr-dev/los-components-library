import { useQueries } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi, BucketControllerApi } from '@/services/openapi/bucket-service';

import type {
  BucketResponseDto,
  DebtorInformationDetailDto,
  RequestByProcessIdDtoString,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();
const application = new ApplicationDebtorControllerApi();

const useGetDebtorDetail = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions>) => {
  const query = useQueries({
    combine: (results) => {
      const data = results.map((result) => result.data);
      const [bucketDetailData, debtorDetailData] = data;
      const bucketDetail: BucketResponseDto = bucketDetailData;
      const debtorDetail: DebtorInformationDetailDto = debtorDetailData;

      const formattedData = {
        bucketDetail: bucketDetail || {},
        debtorDetail: debtorDetail || {},
      };

      return {
        data: formattedData,
        isLoading: results.some((result) => result.isLoading),
      };
    },
    queries: [
      {
        queryFn: async () => {
          const res = await api.getBucketDetail(payload);

          return res.data?.data?.content;
        },
        queryKey: ['bucket-detail', payload],
        ...config,
      },
      {
        queryFn: async () => {
          const res = await application.detailBucketDebtor(payload);

          return res.data?.data?.content;
        },
        queryKey: ['debtor-detail', payload],
        ...config,
      }
    ],
  });
  return query;
};

export default useGetDebtorDetail;
