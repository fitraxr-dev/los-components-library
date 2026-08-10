import { useMutation } from '@tanstack/react-query';

import { VisitControllerApi } from '@/services/openapi/site-visit-service';

import type { BaseRequestDto } from '@/services/openapi/site-visit-service';


const api = new VisitControllerApi();

const useGenerateVisitCode = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: BaseRequestDto) => {
      const res = await api.generateVisitCode(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useGenerateVisitCode;
