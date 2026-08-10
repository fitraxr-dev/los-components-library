import { useMutation } from '@tanstack/react-query';

import { DocumentDebtorRemarkControllerApi } from '@/services/openapi/mip-service';

import type { DocumentDebtorRemarkRequestDto } from '@/services/openapi/mip-service';


const api = new DocumentDebtorRemarkControllerApi();


const useSaveDebtorDocumentRemark = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: DocumentDebtorRemarkRequestDto) => {
      const res = await api.saveDocumentDebtorRemark(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {

      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDebtorDocumentRemark;
