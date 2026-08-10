import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';
import type { ProcessingRequestDto } from '@/services/openapi/site-visit-service';


interface useSubmitBucketProps {
  submitRequestDto: SubmitRequestDto | ProcessingRequestDto;
  options?: any;
  submmitRequestDtoPemda?: ProcessingRequestDto;
  debtorName?: string;
}

const useSubmitSiteVisit = ({
  onSuccess = (variable: any) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: useSubmitBucketProps) => {
      const { submitRequestDto, options, debtorName } = payload;

      const res = await API('siteVisit.siteVisit.submit', {
        data: debtorName ? { ...submitRequestDto, debtorName } : submitRequestDto,
        options,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      onSuccess(variable);
    },
  });

  return mutation;
};

export default useSubmitSiteVisit;
