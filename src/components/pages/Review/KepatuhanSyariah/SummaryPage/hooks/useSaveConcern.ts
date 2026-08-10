import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ConcernControllerApi } from '@/services/openapi/mip-service';


const api = new ConcernControllerApi();

interface SaveCorrectiveActionPlanDto {
  bucketProcessId: string;
  module: string;
  process: string;
  type: string;
  id?: number;
  shariaCompliance?: string;
  description?: any;
}
const useSaveConcern
 = ({
   onSuccess = () => {},
   onError = () => {},
 }) => {
   const queryClient = useQueryClient();

   const mutation = useMutation({
     mutationFn: async ({
       bucketProcessId,
       module,
       process,
       type,
       id,
       shariaCompliance,
       description,
     }: SaveCorrectiveActionPlanDto) => {
       const res = await api.saveConcern(
         bucketProcessId,
         module,
         process,
         type,
         id,
         shariaCompliance,
         description,
       );

       return res.data.data.content;
     },
     onError: () => {
       onError();
     },
     onSuccess: (_, variable) => {
       queryClient.invalidateQueries({ queryKey: ['concern-detail']});
       onSuccess();
     },
   });

   return mutation;
 };

export default useSaveConcern
;
