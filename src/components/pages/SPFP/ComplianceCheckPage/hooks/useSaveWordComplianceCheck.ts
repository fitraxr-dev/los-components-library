import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type SaveWordComplianceCheckPayload = {
  bucketProcessId: string;
  module: string;
  process: string;
  complianceNumber: string;
  responseFile?: File | Blob;
  reviewFile?: File | Blob;
};

const useSaveWordComplianceCheck = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      module,
      process,
      complianceNumber,
      responseFile,
      reviewFile,
    }: SaveWordComplianceCheckPayload) => {
      const formData = new FormData();
      formData.append('bucketProcessId', bucketProcessId);
      formData.append('module', module);
      formData.append('process', process);
      formData.append('complianceNumber', complianceNumber);
      if (responseFile) formData.append('responseFile', responseFile);
      if (reviewFile) formData.append('reviewFile', reviewFile);

      // DEBUG LOG: Log body sebelum kirim ke BE
      console.log('useSaveWordComplianceCheck FormData body:', {
        bucketProcessId,
        complianceNumber,
        module,
        process,
        responseFile: responseFile,
        reviewFile: reviewFile,
      });

      const res = await API('agreement.complianceCheck.saveResponse', {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
      queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check-child']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveWordComplianceCheck;
