import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ConcernControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ConcernControllerApi();

const useDeleteConcern
 = ({
   onSuccess = () => {},
   onError = () => {},
 }) => {
   const queryClient = useQueryClient();

   const mutation = useMutation({
     mutationFn: async (payload: RequestByIdDtoLong) => {
       const res = await api.deleteConcern(
         payload,
       );

       return res.data.data.content;
     },
     onError: () => {
       onError();
     },
     onSuccess: (_, variable) => {
       queryClient.invalidateQueries({ queryKey: ['concern-summary']});
       onSuccess();
     },
   });

   return mutation;
 };

export default useDeleteConcern
;
