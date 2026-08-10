import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AssignmentControllerApi } from '@/services/openapi/bucket-service';

import type { AssignmentRequestDto } from '@/services/openapi/bucket-service';


const api = new AssignmentControllerApi();

const useAddAssignPic = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: AssignmentRequestDto) => {
      const res = await api.assignmentPic(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['assignment-list', {
          filter: {
            module: variables.module,
            process: variables.process,
          },
        }],
      });
      onSuccess();
    },
  });
  return mutation;
};

export default useAddAssignPic;
