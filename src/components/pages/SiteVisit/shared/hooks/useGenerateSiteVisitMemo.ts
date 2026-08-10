import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DraftMemoControllerApi } from '@/services/openapi/bucket-document-service';

import type { SiteVisitDocumentRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DraftMemoControllerApi();


const useGenerateSiteVisitMemo = ({
  onSuccess = (file: any) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: SiteVisitDocumentRequestDto) => {
      const res = await api.getSiteVisitMemo(payload, { responseType: 'blob' });
      return res;
    },
    onError: () => {
      onError();
    },
    onSuccess: (res) => {
      console.log(res, 'testing');
      onSuccess(res);
    },
  });

  return mutation;
};

export default useGenerateSiteVisitMemo;
