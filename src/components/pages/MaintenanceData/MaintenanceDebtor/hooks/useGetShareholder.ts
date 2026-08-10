import { useQuery } from '@tanstack/react-query';

import { ShareholderControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-service';


const api = new ShareholderControllerApi();

const useGetShareholder = ({ id }: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: id !== null,
    queryFn: async () => {
      const res = await api.getShareholderById({ id });

      return res.data;
    },
    queryKey: ['shareholder-detail', { id }],
    select: (data) => data.data.content,
  });

  return query;
};

export default useGetShareholder;
