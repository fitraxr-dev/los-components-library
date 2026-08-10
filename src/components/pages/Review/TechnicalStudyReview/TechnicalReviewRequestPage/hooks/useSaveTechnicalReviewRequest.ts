import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RequestControllerApi } from '@/services/openapi/technical-review-service';


export type SaveDto = {
  bucketProcess: string;
  type: string;
  notes: string;
  additionalInformation: any;
  process: string;
  module: string;
}


const api = new RequestControllerApi();

const useSaveTechnicalReviewRequest = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcess, type, notes, additionalInformation, process, module }: SaveDto) => {
      const res = await api.creationRequestTechnicalReview(
        bucketProcess, type, notes, additionalInformation, process, module);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['technical-review-request', { bucketProcessId: variable.bucketProcess }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveTechnicalReviewRequest;
