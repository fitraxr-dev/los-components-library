import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ManagementControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-service';


const api = new ManagementControllerApi();

const useGetManagementDetail = ({ id }: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: id !== undefined && id !== null,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getManagementById({ id });

      return res.data;
    },
    queryKey: ['management-detail', { id }],
    select: (data) => data.data.content,
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetManagementDetail;
