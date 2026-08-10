import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RoutineReportingControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new RoutineReportingControllerApi();

const useDeleteRoutineSubReporting = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteRoutineSubReporting(payload);

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

export default useDeleteRoutineSubReporting;
