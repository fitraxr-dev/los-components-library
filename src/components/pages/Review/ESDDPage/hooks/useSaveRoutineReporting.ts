import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RoutineReportingControllerApi } from '@/services/openapi/mip-service';

import type { RoutineReportingRequestDto } from '@/services/openapi/mip-service';


const api = new RoutineReportingControllerApi();

const useSaveRoutineReporting = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RoutineReportingRequestDto) => {
      const res = await api.saveRoutineReporting(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-list-routine-reporting']});
      queryClient.invalidateQueries({ queryKey: ['get-detail-routine-reporting']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRoutineReporting;
