import { useMutation } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';
import { DynamicStepperControllerApi } from '@/services/openapi/processor-service';

import type {
  BucketCreateRequestDto,
  BucketCreateResponseDto,
  GenericSingleDtoBucketCreateResponseDto,
} from '@/services/openapi/bucket-service';


type PartialRegisterDynamicStepper = BucketCreateRequestDto & {
  typeStep?: string;
  debtorId?: string;
}


const api = new BucketControllerApi();
const api_dynamic = new DynamicStepperControllerApi();

const useRegisterDynamicStepper = ({
  onSuccess = (data: BucketCreateResponseDto) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: PartialRegisterDynamicStepper) => {
      const payloadRegis = {
        bucketProcessId: payload.bucketProcessId,
        debtorId: payload.debtorId,
        module: payload.module,
        process: payload.process,
        syncWithLatestSubmission: payload.syncWithLatestSubmission,
      };
      const res = await api.registerBucketDebtor(payloadRegis);
      const payloadMapping = {
        bucketProcessId: res.data.data.content.bucketProcessId,
        module: payload.module,
        process: payload.process,
        typeStep: payload.typeStep,
      };
      await api_dynamic.createMappingStepper(payloadMapping);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data: GenericSingleDtoBucketCreateResponseDto) => {
      onSuccess(data.content);
    },
  });

  return mutation;
};


export default useRegisterDynamicStepper;
