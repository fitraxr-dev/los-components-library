import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RoutineReportingControllerApi } from '@/services/openapi/mip-service';

import type { RoutineReportingBusinessResponseSaveRequestDto } from '@/services/openapi/mip-service';


const api = new RoutineReportingControllerApi();

const useSaveRoutineReportingResponseBusiness = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, businessResponse }: RoutineReportingBusinessResponseSaveRequestDto) => {
      const res = await api.saveRoutineReportingBusinessResponse(id, businessResponse);

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

export default useSaveRoutineReportingResponseBusiness;
