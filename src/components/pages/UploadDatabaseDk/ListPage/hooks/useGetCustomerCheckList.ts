import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface CustomerCheckContent {
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

interface CustomerCheckResponse {
  contents: CustomerCheckContent[];
  page: {
    noPage: number;
    itemPerPage: number;
    totalPage: number;
    totalData: number;
  };
}

interface CustomerCheckPayload {
  filter?: {
    profile?: string;
    category?: string;
  } | null;
  sortList?: {
    columnName: string;
    sortType: 'ASC' | 'DESC';
  } | null;
  searchDetail?: {
    key: string;
    value: string;
  } | null;
  page: {
    itemPerPage: number;
    noPage: number;
  };
}

const useGetCustomerCheckList = (payload: CustomerCheckPayload) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.databaseDk.customerCheckList', { data: payload });
      return res.data.data as CustomerCheckResponse;
    },
    queryKey: ['database-dk-customer-check-list', payload],
  });

  return query;
};

export default useGetCustomerCheckList;
