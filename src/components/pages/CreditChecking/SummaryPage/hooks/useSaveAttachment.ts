import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposalControllerApi } from '@/services/openapi/mip-service';

import type { ProposalAttachmentDto } from '@/services/openapi/mip-service';


const api = new ProposalControllerApi();

const useSaveAttachment = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ProposalAttachmentDto) => {
      const res = await api.saveProposalAttachment(payload);

      return res.data;
    },

    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attachment-list', {
          filter: {
            bucketProcessId: variables.bucketProcessId,
            documentGroup: variables.documentGroup,
          },
        }],
      });
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveAttachment;
