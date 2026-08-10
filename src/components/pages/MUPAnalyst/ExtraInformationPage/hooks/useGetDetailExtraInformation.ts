import { useQuery } from '@tanstack/react-query';

import { ExtraInformationControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new ExtraInformationControllerApi();

const useGetDetailExtraInformation = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailExtraInformation(payload);

      return res.data?.data?.content;
    },
    queryKey: ['extra-information-detail', payload],
  });
  return query;
};

export default useGetDetailExtraInformation;
