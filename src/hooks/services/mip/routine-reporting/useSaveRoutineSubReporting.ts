import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { API } from '@/helpers/api';


const useSaveRoutineSubReporting = ({
  onSuccess = () => {},
  onError = () => {},
  module,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API saveRoutineSubReporting with payload:', payload, 'module:', module);

        let response;

        switch (module) {
          case TypeModule.MIP_REVIEW:
          case TypeModule.MUP:
            response = await API('mip.routine.saveRoutineSubReporting', { data: payload });
            break;
          case TypeModule.RISALAH_RAPAT:
            response = await API('agreement.routine.saveRoutineSubReporting', { data: payload });
            break;
          default:
            response = await API('mip.routine.saveRoutineSubReporting', { data: payload });
            break;
        }

        console.log('API response (saveRoutineSubReporting):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (saveRoutineSubReporting):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      // refresh list & detail
      queryClient.invalidateQueries({ queryKey: ['get-list-routine-reporting']});
      queryClient.invalidateQueries({ queryKey: ['get-detail-sub-routine-reporting', { id: variable?.id }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRoutineSubReporting;
