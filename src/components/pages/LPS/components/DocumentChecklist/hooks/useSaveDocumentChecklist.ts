import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { DocumentCheckListRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useSaveDocumentChecklist = ({
  onSuccess = () => {},
  onError = (error: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DocumentCheckListRequestDto) => {
      const res = await api.saveDocumentChecklist(payload);

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: async (_, variable) => {
      await queryClient.invalidateQueries({ queryKey: ['documents', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDocumentChecklist;
