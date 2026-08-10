import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LpaInformationControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new LpaInformationControllerApi();

const useDeleteFinancingFacility = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {
      const res = await api.deleteLpaInformation(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpa-list']});
      queryClient.invalidateQueries({ queryKey: ['lpa-validate']});
      queryClient.invalidateQueries({ queryKey: ['documents']});
      onSuccess();
    },
  });

  return mutation;
};


export default useDeleteFinancingFacility;
