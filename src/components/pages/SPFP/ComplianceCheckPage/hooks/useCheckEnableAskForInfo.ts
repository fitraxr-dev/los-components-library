import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface CheckSubmitPayload {
  bucketProcessId: string;
  process: string;
  module: string;
}

const useCheckEnableAskForInfo = (
  payload: CheckSubmitPayload,
) => {

  const query = useQuery<boolean, unknown, boolean>({
    queryFn: async () => {
      const response = await API('agreement.offeringLetter.checkEnableAskForInfo', {
        data: payload,
      });

      return (response?.data?.data?.content);
    },
    queryKey: ['check-enable-ask-for-info', payload],
  });

  return query;
};

export default useCheckEnableAskForInfo;
