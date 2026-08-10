import { useQuery } from '@tanstack/react-query';

import { CreditorControllerApi } from '@/services/openapi/mip-service';

import type { CreditorRequestDto, CreditorResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CreditorControllerApi();

const useGetCreditor = (
  payload: CreditorRequestDto,
  config?: Partial<UseQueryOptions<CreditorResponseDto>>,

) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailCreditor(payload);
      return res.data.data?.content;
    },
    queryKey: ['creditor-data', payload],
    ...config,
  },
  );
  return query;
};

export default useGetCreditor;
