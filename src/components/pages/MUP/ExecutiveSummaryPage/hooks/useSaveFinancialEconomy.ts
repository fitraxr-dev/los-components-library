import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancialEconomicIndicatorControllerApi } from '@/services/openapi/mip-service';


const api = new FinancialEconomicIndicatorControllerApi();

const useSaveFinancialEconomy = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveFinancialEconomicIndicator(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['mup-financial-economy']});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  id: number;
  bucketProcessId: string;
  description: any;
  module: string;
  process: string;
}

export default useSaveFinancialEconomy;
