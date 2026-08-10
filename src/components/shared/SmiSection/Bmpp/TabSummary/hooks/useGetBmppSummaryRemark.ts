import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { BmppControllerApi, type RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();

const useGetBmppSummaryRemark = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getBmppSummaryRemark(payload);

      return res.data.data.content;
    },

    queryKey: ['bmpp-summary-remark', payload],
  });
  return query;
};

export default useGetBmppSummaryRemark;
