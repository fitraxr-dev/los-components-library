import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
  nameOL?: string;
  status?: string;
  noDraft?: string;
  draftParent?: string;
  note?: any;
  noteReviwer?: any;
  file: any;
  isFinal?: boolean;
}

const useSaveDraftOfferingLetter = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      module,
      process,
      nameOL,
      status,
      noDraft,
      draftParent,
      note,
      noteReviwer,
      file,
      isFinal,
    }: SaveDto) => {
      const formData = new FormData();
      formData.append('bucketProcessId', bucketProcessId);
      formData.append('module', module);
      formData.append('process', process);
      if (nameOL) formData.append('nameOL', nameOL);
      if (status) formData.append('status', status);
      if (noDraft) formData.append('noDraft', noDraft);
      if (draftParent) formData.append('draftParent', draftParent);
      if (note) formData.append('note', note);
      if (noteReviwer) formData.append('noteReviewer', noteReviwer);
      if (file) formData.append('file', file);
      if (isFinal !== undefined) formData.append('isFinal', String(isFinal));

      const res = await API('agreement.offeringLetter.save', {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['upload-offering-letter-list']});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveDraftOfferingLetter;
