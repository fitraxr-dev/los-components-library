import { useQuery } from '@tanstack/react-query';

import { ShareholderControllerApi } from '@/services/openapi/master-service';

import type { DebtorRequest } from '@/services/openapi/master-service';


const api = new ShareholderControllerApi();

const useGetShareholderRemark = (payload: DebtorRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveDescriptionShareholder(payload);
      const shareholderData = res.data.data.content;

      return shareholderData;
    },
    queryKey: ['shareholder-description', payload],
  });

  return query;
};

export default useGetShareholderRemark;
