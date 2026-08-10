import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface PayloadInterface {
  facilityId: string;
  bucketProcessId?: string;
}

const useGetChildLimit = (payload: PayloadInterface) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.facilityManagementSyariahExisiting.limitAnak', {
        data: payload,
      });

      const result = res.data.data?.attributes.reduce((acc, curr) => {
        acc[curr.attributeKey] = curr.attributeValue;
        return acc;
      }, {});

      const newResult = { data: { ...res?.data?.data, ...result } };

      return newResult;
    },
    queryKey: ['detail-syariah-child-limit', payload],
    select: (data) => data.data,
  });

  return query;
};
export default useGetChildLimit;
