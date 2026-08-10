import { useMutation, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { PkProcessingTypeControllerApi } from '@/services/openapi/agreement-service';

import type { PKProcessingTypeMappingNumberRequestDto } from '@/services/openapi/agreement-service';


const api = new PkProcessingTypeControllerApi();

const useGetMappingNumber = (payload: PKProcessingTypeMappingNumberRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getMappingNumber(payload);

      return res.data;
    },
    queryKey: ['mapping-pk-adendum-list'],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetMappingNumber;
