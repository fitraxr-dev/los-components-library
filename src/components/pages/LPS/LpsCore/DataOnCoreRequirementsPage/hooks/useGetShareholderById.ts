import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { DetailShareholderRequestDto, DetailShareholderResponseDto } from '../DataOnCoreRequirements.type';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetShareholderById = (
  payload: DetailShareholderRequestDto,
  config?: Partial<UseQueryOptions<DetailShareholderResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.shareholder.detail', {
        data: payload,
      });

      return res?.data?.data?.content;
    },
    queryKey: ['shareholder-detail', payload],
    ...config,
  });

  return query;
};


export default useGetShareholderById;
