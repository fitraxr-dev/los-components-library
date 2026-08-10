import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { ONE_MINUTE } from '@/configs/constants';
import { InquiryControllerApi } from '@/services/openapi/dashboard-service';

import type {
  BaseResponseGenericBucketResponseDtoInquiryResponseDto,
  GenericBucketRequestDtoMapStringObject,
  GenericBucketResponseDtoInquiryResponseDto,
} from '@/services/openapi/dashboard-service';
import type { UseQueryOptions } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';


const api = new InquiryControllerApi();

const useGetInquiryDataList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<
  UseQueryOptions<
  BaseResponseGenericBucketResponseDtoInquiryResponseDto,
  unknown,
  GenericBucketResponseDtoInquiryResponseDto,
  [string, GenericBucketRequestDtoMapStringObject]
  >
  >
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res: AxiosResponse<BaseResponseGenericBucketResponseDtoInquiryResponseDto, any> =
        await api.getBucketInquiry(payload);

      return res.data;
    },

    queryKey: ['inquiryData', payload],
    select: (data: BaseResponseGenericBucketResponseDtoInquiryResponseDto) => data?.data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetInquiryDataList;
