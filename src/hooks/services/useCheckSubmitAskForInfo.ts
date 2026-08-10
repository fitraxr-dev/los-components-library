import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface CheckSubmitPayload {
  bucketProcessId: string;
}

const useCheckSubmitAskForInfo = (
  payload: CheckSubmitPayload,
) => {

  const query = useQuery<boolean, unknown, boolean>({
    queryFn: async () => {
      const response = await API('agreement.offeringLetter.checkSubmitAskForInfo', {
        data: payload,
      });

      return (response?.data?.data?.content);
    },
    queryKey: ['check-submit-ask-for-info', payload],
  });

  return query;
};

export default useCheckSubmitAskForInfo;
