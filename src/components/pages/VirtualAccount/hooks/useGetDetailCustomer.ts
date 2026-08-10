import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoString } from '@/services/openapi/master-service';


const api = new VirtualAccountControllerApi();

const useGetDetailCustomer
 = (payload: RequestByIdDtoString) => {
   const query = useQuery({
     placeholderData: keepPreviousData,
     queryFn: async () => {
       const res = await api.getCustomerInformationBucketVA(payload);

       return res.data.data.content;
     },
     queryKey: ['va-customer-detail', payload],
   });
   return query;
 };

export default useGetDetailCustomer
;
