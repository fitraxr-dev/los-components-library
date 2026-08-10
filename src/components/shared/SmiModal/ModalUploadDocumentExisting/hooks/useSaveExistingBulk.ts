import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { SaveBulkingDataDocumentExistingRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();


const useSaveExistingBulk = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveBulkingDataDocumentExistingRequestDto) => {
      const res = await api.saveBulkingDataDocumentExisting(payload);
      return res.data.data.contents;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['document']});
      queryClient.invalidateQueries({ queryKey: ['elo-documents']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveExistingBulk;
