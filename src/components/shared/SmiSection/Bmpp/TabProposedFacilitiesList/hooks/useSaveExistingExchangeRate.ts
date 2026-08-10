import { useMutation } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { BmppExchangeRateRequest } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useSaveExistingExchangeRate = ({
  onSuccess = () => {},
  onError = () => {},
}) => {

  const mutation = useMutation({
    mutationFn: async (payload: BmppExchangeRateRequest) => {
      const res = await api.saveExistingExchangeRate(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveExistingExchangeRate;
