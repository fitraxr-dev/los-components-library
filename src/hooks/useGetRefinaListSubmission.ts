import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface RefinaListSubmissionPayload {
  limit?: number;
  page?: number;
  sortOrder?: 'asc' | 'desc';
  sortColumn?: string;
  status?: string;
  regionName?: string;
  regionType?: string;
}

interface RefinaSubmissionItem {
  debiturName: string;
  refinaId: string;
  productName: string;
  projectName: string;
  rmName: string;
  submissionDate: string;
  refinaStatus: string;
}

interface RefinaPageInfo {
  noPage: number;
  itemPerPage: number;
  totalPage: number;
  totalData: number;
}

interface RefinaListSubmissionResponse {
  contents: RefinaSubmissionItem[];
  page: RefinaPageInfo;
}

const useGetRefinaListSubmission = (
  payload: RefinaListSubmissionPayload,
  config?: Partial<UseQueryOptions<RefinaListSubmissionResponse>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('pipeline.refina.getListSubmission', {
        data: payload,
      });
      return res.data.data;
    },
    queryKey: [
      'refina-list-submission',
      payload
    ],
    ...config,
  });

  return query;
};

export default useGetRefinaListSubmission;
