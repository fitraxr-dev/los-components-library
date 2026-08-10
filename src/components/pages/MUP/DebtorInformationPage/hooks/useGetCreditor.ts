import { useQuery } from '@tanstack/react-query';

import { CreditorControllerApi } from '@/services/openapi/mip-service';

import type { CreditorRequestDto } from '@/services/openapi/mip-service';


const api = new CreditorControllerApi();

const useGetCreditor = (payload: CreditorRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailCreditor(payload);

      return res.data.data?.content;
    },
    queryKey: ['creditor-data', payload],
  });
  return query;
};

export default useGetCreditor;
