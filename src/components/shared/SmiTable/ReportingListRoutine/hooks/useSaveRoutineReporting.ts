import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import { RoutineReportingControllerApi as RoutineControllerApiAgreement } from '@/services/openapi/agreement-service';
import { RoutineReportingControllerApi as RoutineControllerApiMip } from '@/services/openapi/mip-service';

import type {
  RoutineReportingRequestDto as RoutineReportingRequestDtoAgreement,
} from '@/services/openapi/agreement-service';
import type { RoutineReportingRequestDto as RoutineReportingRequestDtoMip } from '@/services/openapi/mip-service';


const mipService = new RoutineControllerApiMip();
const agreementService = new RoutineControllerApiAgreement();

const useSaveRoutineReporting = ({
  onSuccess = () => {},
  onError = (variables: any) => {},
  module,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RoutineReportingRequestDtoMip | RoutineReportingRequestDtoAgreement) => {
      switch (module) {
        case TypeModule.MIP_REVIEW:
          return await mipService.saveRoutineReporting(payload);
        case TypeModule.RISALAH_RAPAT:
          return await agreementService.saveRoutineReporting(payload);
        case TypeModule.MUP:
          return await mipService.saveRoutineReporting(payload);
        default:
          return await mipService.saveRoutineReporting(payload);
      }
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (_, variable) => {
      queryClient.resetQueries({ queryKey: ['get-list-routine-reporting']});
      queryClient.invalidateQueries({ queryKey: ['get-detail-routine-reporting', { id: variable.id }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRoutineReporting;
