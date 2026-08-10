import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AssignmentControllerApi } from '@/services/openapi/bucket-service';

import type { ReAssignmentListRequestDto } from '@/services/openapi/bucket-service';


const api = new AssignmentControllerApi();

const useSaveReassignPic = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ReAssignmentListRequestDto) => {
      const res = await api.reAssignmentPic(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['bucket-list', {
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

export default useSaveReassignPic;
