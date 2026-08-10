import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoLong } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();
const useDeleteVa = (options: any = {}) => {
  const mutation = useMutation({
    mutationFn: async (RequestByIdDtoLong: RequestByIdDtoLong) => {
      const res = await api.deleteVA(RequestByIdDtoLong);
      return res.data;
    },
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};


export default useDeleteVa;
