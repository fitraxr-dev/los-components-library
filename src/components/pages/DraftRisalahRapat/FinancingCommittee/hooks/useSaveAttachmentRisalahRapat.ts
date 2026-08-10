import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';


interface SaveAttachmentRisalahRapatRequest {
  bucketProcessId: string;
  listId: number[];
  module: TypeModule;
  process: TypeProcess;
}

const useSaveAttachmentRisalahRapat = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveAttachmentRisalahRapatRequest) => {
      const res = await API('bucketDocument.draftMemo.attachmentRisalahRapat', { data: payload });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['history-draft-memo']});
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['document']});
    },
  });

  return mutation;
};

export default useSaveAttachmentRisalahRapat;
