import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { RoutineReportingControllerApi as RoutineControllerApiAgreement } from '@/services/openapi/agreement-service';
import { RoutineReportingControllerApi as RoutineControllerApiMip } from '@/services/openapi/mip-service';

import type { RoutineSubReportingRequestDto } from '@/services/openapi/mip-service';


const mipService = new RoutineControllerApiMip();
const agreementService = new RoutineControllerApiAgreement();

const useSaveRoutineSubReporting = ({
  onSuccess = () => {},
  onError = () => {},
  module,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RoutineSubReportingRequestDto) => {
      switch (module) {
        case TypeModule.MIP_REVIEW:
          return await mipService.saveRoutineSubReporting(payload);
        case TypeModule.RISALAH_RAPAT:
          return await agreementService.saveRoutineSubReporting(payload);
        case TypeModule.MUP:
          return await mipService.saveRoutineSubReporting(payload);
        default:
          return await mipService.saveRoutineSubReporting(payload);
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.resetQueries({ queryKey: ['get-list-routine-reporting']});
      queryClient.invalidateQueries({ queryKey: ['get-detail-sub-routine-reporting', { id: variable.id }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRoutineSubReporting;
