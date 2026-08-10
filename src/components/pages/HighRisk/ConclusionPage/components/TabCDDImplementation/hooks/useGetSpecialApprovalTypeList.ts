import { useQuery } from '@tanstack/react-query';

import { SpecialApprovalTypeControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new SpecialApprovalTypeControllerApi();

const useGetSpecialApprovalTypeList = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListSpecialApprovalAllType(payload);

      return res.data.data;
    },

    queryKey: ['special-approval-type-list', payload],
  });

  return query;
};

export default useGetSpecialApprovalTypeList;
