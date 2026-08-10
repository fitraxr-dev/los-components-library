import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { RoutineReportingControllerApi as RoutineControllerApiAgreement } from '@/services/openapi/agreement-service';
import { RoutineReportingControllerApi as RoutineControllerApiMip } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong as RequestByIdDtoLongMip } from '@/services/openapi/mip-service';


const mipService = new RoutineControllerApiMip();
const agreementService = new RoutineControllerApiAgreement();


const useDeleteRoutineSubReporting = ({
  onSuccess = () => {},
  onError = () => {},
  module,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLongMip) => {
      switch (module) {
        case TypeModule.MIP_REVIEW:
          return await mipService.deleteRoutineSubReporting(payload);
        case TypeModule.RISALAH_RAPAT:
          return await agreementService.deleteRoutineSubReporting(payload);
        case TypeModule.MUP:
          return await mipService.deleteRoutineSubReporting(payload);
        default:
          return await mipService.deleteRoutineSubReporting(payload);
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
