import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface PayloadInterface {
  page?: {
    noPage?: number;
    itemPerPage?: number;
  };
  sortList?: {
    columnName?: string;
    sortType?: string;
  };
  searchDetail?: {
    key?: string;
    value?: string;
  };
  filter?: {
    cif?: string;
  };
}

const useGetInquiryAccountListWithPagination = (payload: PayloadInterface) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahExisiting.inquiryAccount', {
        data: payload,
      });

      return res?.data;
    },
    queryKey: ['inquiry-account-list', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};
export default useGetInquiryAccountListWithPagination;
