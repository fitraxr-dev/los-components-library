import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ShareholderControllerApi } from '@/services/openapi/master-service';

import type { DebtorDescriptionRequest } from '@/services/openapi/master-service';


const api = new ShareholderControllerApi();

const useSaveShareholderRemark = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: DebtorDescriptionRequest) => {
      const res = await api.saveDescriptionShareholder(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shareholder-description']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useSaveShareholderRemark;
