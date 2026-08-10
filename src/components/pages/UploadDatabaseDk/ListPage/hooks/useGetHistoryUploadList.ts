import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface HistoryUploadResponse {
  contents: Array<{
    id: number;
    fileName: string;
    status: number;
    statusLabel: string;
    totalFailed: number;
    totalRow: number;
    totalSuccess: number;
    createdDate: string;
    modifiedDate: string;
    createdBy: string;
    modifiedBy: string;
    errorMessages: string[];
    message: string | null;
  }>;
  page: {
    noPage: number;
    itemPerPage: number;
    totalPage: number;
    totalData: number;
  };
}

interface HistoryUploadPayload {
  filter: {
    startDate?: string;
    endDate?: string;
    uploadBy?: string;
    status?: string;
  };
  page: {
    itemPerPage: number;
    noPage: number;
  };
}

const useGetHistoryUploadList = (payload: HistoryUploadPayload) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.databaseDk.historyUploadList', { data: payload });
      return res.data.data as HistoryUploadResponse;
    },
    queryKey: ['database-dk-history-upload-list', payload],
  });

  return query;
};

export default useGetHistoryUploadList;
