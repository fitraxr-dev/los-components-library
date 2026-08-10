import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface DeleteReportRoutinePayload {
  id: number;
  bucketProcessId: string;
  module: string;
  process: string;
}

interface UseDeleteReportRoutineProps {
  module: string;
  onSuccess?: (data: any) => void;
  onError?: () => void;
  queryKey?: string[];
}

const useDeleteReportRoutine = ({
  module,
  onSuccess = (data: any) => { },
  onError = () => { },
  queryKey = ['get-list-routine-reporting'],
}: UseDeleteReportRoutineProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: Omit<DeleteReportRoutinePayload, 'module'>) => {
      const completePayload = {
        ...payload,
        module,
      };

      const res = await API('mip.routineReporting.deleteReport', {
        data: completePayload,
      });

      return res.data ?? {};
    },
    onError: () => {
      onError();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useDeleteReportRoutine;
