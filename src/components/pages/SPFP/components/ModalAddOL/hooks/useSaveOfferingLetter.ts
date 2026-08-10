import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  draftParent?: string;
  bucketProcessId: string;
  nameOL: string;
  process: TypeProcess;
  module: TypeModule;
  noDraft: string;
}

const useSaveOfferingLetter = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, module, process, nameOL, draftParent, noDraft }: SaveDto) => {
      const formData = new FormData();
      formData.append('bucketProcessId', bucketProcessId);
      formData.append('module', module);
      formData.append('process', process);
      formData.append('nameOL', nameOL);
      formData.append('noDraft', noDraft);
      if (draftParent) {
        formData.append('draftParent', draftParent);
      }

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


export default useSaveOfferingLetter;
