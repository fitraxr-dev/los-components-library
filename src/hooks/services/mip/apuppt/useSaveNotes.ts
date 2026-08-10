import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type SaveNotesPayload = {
  bucketProcessId: string;
  process: string;
  module: string;
  cddImplementation: string;
  eddImplementationRemark: string;
  cddImplementationRemark: string;
  simpleCddImplementationRemark: string;
  description: Blob;
}

const useSaveNotes = ({
  onSucess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      cddImplementation,
      eddImplementationRemark,
      cddImplementationRemark,
      simpleCddImplementationRemark,
      description,
    }: SaveNotesPayload) => {
      const res = await API('mip.apuppt.saveNotes', { data: {
        bucketProcessId,
        cddImplementation,
        cddImplementationRemark,
        description,
        eddImplementationRemark,
        module,
        process,
        simpleCddImplementationRemark,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      } });

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes-detail', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSucess();
    },
  });

  return mutation;
};

export default useSaveNotes;
