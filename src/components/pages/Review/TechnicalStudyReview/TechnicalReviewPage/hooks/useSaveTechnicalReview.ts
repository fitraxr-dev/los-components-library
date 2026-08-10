import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DelstRequestControllerApi } from '@/services/openapi/technical-review-service';


export type SaveDto = {
  bucketProcessId: string;
  notes: string;
  process: string;
  module: string;
  options?: string;
  additionalInformation: string;
  type: string;
}

const api = new DelstRequestControllerApi();

const useSaveTechnicalReview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, notes, process, module, type, additionalInformation, options }: SaveDto) => {
      const res = await api.creationDelstRequest(
        bucketProcessId,
        notes,
        process,
        module,
        type,
        additionalInformation,
        options,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['technical-review', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveTechnicalReview;
