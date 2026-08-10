import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { GenericBucketResponseDtoInquiryResponseDto } from './useGetAllProces.type';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetAllProcess = (
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoInquiryResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('dashboard.inquiry.filterProcess');

      return res.data.data;
    },

    queryKey: ['process'],
    select: (data: GenericBucketResponseDtoInquiryResponseDto) => data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetAllProcess;
