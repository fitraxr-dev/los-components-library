import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { SaveRemarkRequestDto } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useSaveDebitorRemark = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: SaveRemarkRequestDto) => {
      const res = await api.saveDebtorRemark(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debtor-description']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useSaveDebitorRemark;
