import { useQuery } from '@tanstack/react-query';

import { BeneficialOwnerControllerApi, type RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new BeneficialOwnerControllerApi();

const useGetBeneficialOwnerList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListBeneficialOwner(payload);

      return res.data.data.contents;
    },
    queryKey: ['beneficial-owners', payload],
  });

  return query;
};

export default useGetBeneficialOwnerList;
