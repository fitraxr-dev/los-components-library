import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface PayloadInterface {
  cif: string;
}

const useGetInquiryAccountList = (payload: PayloadInterface) => {
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
export default useGetInquiryAccountList;
