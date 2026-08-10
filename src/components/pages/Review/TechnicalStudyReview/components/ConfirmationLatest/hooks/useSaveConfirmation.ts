import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type Payload = {
  bucketProcessId: string;
  isUpdate: boolean;
}

const useSaveConfirmation = ({
  onError = () => {},
  onSuccess = () => {},
}: { onError?: () => void; onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await API('technicalReview.delstRequest.businessSave', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-review-confirmation-difference']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveConfirmation;
