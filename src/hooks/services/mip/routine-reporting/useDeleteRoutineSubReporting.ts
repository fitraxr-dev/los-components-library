import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { API } from '@/helpers/api';


const useDeleteRoutineSubReporting = ({
  onSuccess = () => {},
  onError = () => {},
  module,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, any>({
    mutationFn: async (payload: any) => {
      try {
        console.log('Deleting routine sub-reporting with payload:', payload, 'and module:', module);

        let endpoint = 'mip.routineReporting.delete';
        switch (module) {
          case TypeModule.MIP_REVIEW:
            endpoint = 'mip.routineReporting.delete';
            break;
          case TypeModule.RISALAH_RAPAT:
            endpoint = 'agreement.routineReporting.delete';
            break;
          case TypeModule.MUP:
            endpoint = 'mip.routineReporting.delete';
            break;
          default:
            endpoint = 'mip.routineReporting.delete';
            break;
        }

        const response = await API(endpoint, {
          data: payload,
        });

        console.log('API response (delete routine sub-reporting):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (delete routine sub-reporting):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-list-routine-reporting']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteRoutineSubReporting;
