import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

const useGetAdditionalInformationById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: Object.values(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await API('mip.additionalInformation.detail', {
        data: payload,
      });

      return res?.data?.data?.content;
    },
    queryKey: ['mip-additional-information', payload],
    // staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetAdditionalInformationById;
