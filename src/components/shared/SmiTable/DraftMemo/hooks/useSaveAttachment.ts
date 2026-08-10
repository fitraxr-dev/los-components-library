import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposalAttachmentControllerApi } from '@/services/openapi/bucket-document-service';

import type { ProposalAttachmentRequestDto } from '@/services/openapi/bucket-document-service';


const api = new ProposalAttachmentControllerApi();

const useSaveAttachment = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ProposalAttachmentRequestDto) => {
      const res = await api.submitProposalAttachmentModify(payload);

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
            documentParent: variables.documentParent,
          },
        }],
      });
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveAttachment;
