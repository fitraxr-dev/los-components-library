import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface DropdownItem {
  userId: string;
  fullName: string;
  userRole: string;
  userDivision: string;
  original: boolean;
}

export interface DropdownListResponse {
  content: DropdownItem[];
  page?: {
    totalPage: number;
    noPage: number;
    itemPerPage: number;
    totalItem: number;
  };
}

const useGetReassignmentDropdownList = (
  payload?: any,
  config?: Partial<UseQueryOptions<DropdownListResponse>>
) => {
  const query = useQuery<DropdownListResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.reassignmentSku.dropdownList', {
        data: payload || {},
      });

      return res.data?.data ?? { content: []};
    },
    queryKey: ['reassignment-dropdown-list', payload],
    ...config,
  });

  return query;
};

export default useGetReassignmentDropdownList;
