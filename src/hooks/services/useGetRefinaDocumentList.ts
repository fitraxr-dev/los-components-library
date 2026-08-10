import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface GetRefinaDocumentListPayload {
  submissionId: number;
}

interface RefinaDocumentResponse {
  documentName: string;
  description: string;
  documentTo: string;
  updateAt: string;
  downloadUrl: string;
  title?: string;
  path?: string;
  subMenu?: string;
  menu?: string;
}

interface GetRefinaDocumentListResponse {
  contents: RefinaDocumentResponse[];
  page: any;
}

const useGetRefinaDocumentList = (
  payload: GetRefinaDocumentListPayload,
  config?: Partial<UseQueryOptions<GetRefinaDocumentListResponse>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('bucket.refina.getAllDocument', {
        data: payload,
      });
      return res.data.data;
    },
    queryKey: ['refina-document-list', payload],
    ...config,
  });

  return query;
};

export default useGetRefinaDocumentList;
