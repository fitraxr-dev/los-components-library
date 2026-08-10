import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { SaveVARequest } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();
const useSaveVa = (options: any = {}) => {
  const mutation = useMutation({
    // mutationFn sekarang menerima payload langsung dengan tipe SaveVARequest
    mutationFn: async (saveVARequest: SaveVARequest) => {
      const res = await api.saveVA(saveVARequest);
      return res.data;
    },
    // Gunakan onError dan onSuccess dari options
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};


export default useSaveVa;
