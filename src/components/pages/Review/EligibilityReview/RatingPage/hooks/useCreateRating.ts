import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface CreateRatingPayload {
  bucketMasterId: string;
  bucketProcessId: string;
  moduleName: string;
  processName: string;
  division: string;
  debtorName: string;
  ratingAnalystName: string;
  picRmName: string;
}

interface CreateRatingResponse {
  idDrd: string;
  message?: string;
  status?: string;
}

const useCreateRating = ({
  onSuccess = (variable: any) => {},
  onError = (variable: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateRatingResponse, Error, CreateRatingPayload>({
    mutationFn: async (payload: CreateRatingPayload) => {
      const res = await API('bucketDocument.document.createRating', {
        data: payload,
        method: 'POST',
      });

      return res.data?.data ?? {};
    },
    onError: (error, variables) => {
      console.error('Create rating error:', error);
      onError(error);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['check-drd-status']});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useCreateRating;
