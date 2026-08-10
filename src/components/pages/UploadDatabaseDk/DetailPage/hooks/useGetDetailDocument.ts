import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface DetailDocumentContent {
  id: number;
  name: string;
  code: string;
  profile: string;
  birthPlace: string;
  birthDate: string;
  nationality: string;
  category: string;
  createdDate: string;
  modifiedDate: string;
  uploadId: number;
}

interface DetailDocumentData {
  contents: DetailDocumentContent[];
  page: {
    noPage: number;
    itemPerPage: number;
    totalPage: number;
    totalData: number;
  };
}

interface DetailDocumentResponse {
  fileName: string;
  uploadedBy: string;
  uploadDate: string;
  data: DetailDocumentData;
}

interface DetailDocumentPayload {
  filter: {
    uploadId: number;
    category: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
}

const useGetDetailDocument = (payload: DetailDocumentPayload) => {
  const query = useQuery({
    enabled: !!payload.filter.uploadId && !!payload.filter.category,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.databaseDk.detail', { data: payload });
      return res.data.data as DetailDocumentResponse;
    },
    queryKey: ['database-dk-detail-document', payload],
  });

  return query;
};

export default useGetDetailDocument;
