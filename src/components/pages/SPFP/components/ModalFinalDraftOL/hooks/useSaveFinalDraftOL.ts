import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
  noDraft?: string;
  draftParent?: string;
  file: any;
  documentCategory?: string;
  documentGroup?: string;
  documentType?: string;
  signedDate?: string;
  documentName?: string;
  isFinal?: boolean;
}

const useSaveFinalDraftOL = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      module,
      process,
      noDraft,
      draftParent,
      file,
      documentGroup,
      documentType,
      signedDate,
      documentName,
      isFinal,
    }: SaveDto) => {
      const formData = new FormData();
      formData.append('bucketProcessId', bucketProcessId);
      formData.append('module', module);
      formData.append('process', process);
      if (noDraft !== undefined && noDraft !== null) formData.append('noDraft', noDraft);
      if (draftParent) formData.append('draftParent', draftParent);
      if (file) formData.append('file', file);
      if (documentGroup) formData.append('documentGroup', documentGroup);
      if (documentType) formData.append('documentType', documentType);
      if (signedDate) formData.append('signedDate', signedDate);
      if (documentName) formData.append('documentName', documentName);
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


export default useSaveFinalDraftOL;
