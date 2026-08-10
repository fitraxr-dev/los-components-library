import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  draftParent?: string;
  nameOL?: string;
  process: TypeProcess;
  module: TypeModule;
  file: any;
  note?: any;
  noteReviewer?: any;
  status?: string;
  noDraft?: string;
  noteDate?: string;
  noteReviewerDate?: string;
}

const useSaveResponsOfferingLetter = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveDto) => {
      const {
        bucketProcessId,
        module,
        process,
        nameOL,
        status,
        noDraft,
        draftParent,
        note,
        noteReviewer,
        file,
        noteDate,
        noteReviewerDate,
      } = payload;

      // Create FormData manually to add all fields including dates
      const formData = new FormData();

      if (bucketProcessId !== undefined) {
        formData.append('bucketProcessId', bucketProcessId);
      }
      if (module !== undefined) {
        formData.append('module', module);
      }
      if (process !== undefined) {
        formData.append('process', process);
      }
      if (nameOL !== undefined) {
        formData.append('nameOL', nameOL);
      }
      if (status !== undefined) {
        formData.append('status', status);
      }
      if (noDraft !== undefined) {
        formData.append('noDraft', noDraft);
      }
      if (draftParent !== undefined) {
        formData.append('draftParent', draftParent);
      }
      if (note !== undefined) {
        formData.append('note', note);
      }
      if (noteReviewer !== undefined) {
        formData.append('noteReviewer', noteReviewer);
      }
      if (file !== undefined) {
        formData.append('file', file);
      }
      if (noteDate !== undefined) {
        formData.append('noteDate', noteDate);
      }
      if (noteReviewerDate !== undefined) {
        formData.append('noteReviewerDate', noteReviewerDate);
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
      queryClient.invalidateQueries({ queryKey: ['upload-offering-letter']});
      queryClient.invalidateQueries({ queryKey: ['offering-letter-detail']});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveResponsOfferingLetter;
