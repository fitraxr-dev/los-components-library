import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetApuPptData = (payload: any) => {
  return useQuery({
    // enabled: !!(payload?.bucketProcessId),
    queryFn: async () => {
      const res = await API('master.debtor.apuPptData', {
        data: payload,
      });
      return res?.data?.data;
    },
    queryKey: ['get-apu-ppt-data', payload],
  });
};

export default useGetApuPptData;
