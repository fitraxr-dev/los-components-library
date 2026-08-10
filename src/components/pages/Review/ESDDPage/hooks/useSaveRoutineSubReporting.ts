import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RoutineReportingControllerApi } from '@/services/openapi/mip-service';

import type { RoutineSubReportingRequestDto } from '@/services/openapi/mip-service';


const api = new RoutineReportingControllerApi();

const useSaveRoutineSubReporting = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RoutineSubReportingRequestDto) => {
      const res = await api.saveRoutineSubReporting(payload);

      return res.data;
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

export default useSaveRoutineSubReporting;
