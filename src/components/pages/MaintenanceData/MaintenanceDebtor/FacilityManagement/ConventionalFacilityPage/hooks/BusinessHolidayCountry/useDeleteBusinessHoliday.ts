import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDeleteBusinessHoliday = ({
  onSuccess = () => { },
  onError = (error: any) => { },

}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityConventional.businessHolidayCountryDelete', { data: payload });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['conventional-business-holiday-country-data']});
    },
  });

  return mutation;
};


export default useDeleteBusinessHoliday;
