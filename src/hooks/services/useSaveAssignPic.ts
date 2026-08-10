import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { AssignmentRequestDto } from './useSaveAssignPic.types';


const useSaveAssignPic = ({
  onSuccess = (variables: any) => {},
  onError = (variables: any) => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: AssignmentRequestDto) => {
      const res = await API('bucket.assignment.assign', {
        data: payload,
      });

      return await new Promise((resolve) =>
        setTimeout(() => {
          resolve(res.data);
        }, 5000));
    },
    onError: (variables) => {
      onError(variables);
    },
    onSuccess: (variables) => {
      onSuccess(variables);
      queryClient.invalidateQueries({ queryKey: ['bucket-list-assignment']});
      queryClient.invalidateQueries({ queryKey: ['assignment-list']});
    },
  });
  return mutation;
};

export default useSaveAssignPic;
