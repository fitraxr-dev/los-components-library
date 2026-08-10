import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DynamicStepperControllerApi } from '@/services/openapi/processor-service';

import type { MappingDynamicStepRequestDto } from '@/services/openapi/processor-service';


const api = new DynamicStepperControllerApi();

const useCreateMappingStepper = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: MappingDynamicStepRequestDto) => {
      const res = await api.createMappingStepper(payload);
      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['stepper-bucket-process']});
      queryClient.invalidateQueries({ queryKey: ['parameter-list-v2']});


      onSuccess();
    },
  });

  return mutation;
};


export default useCreateMappingStepper;
