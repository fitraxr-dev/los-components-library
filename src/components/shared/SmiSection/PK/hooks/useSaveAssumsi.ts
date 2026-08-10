import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  AdditionalInformationControllerApi,
  AssumptionQualificationControllerApi,
} from '@/services/openapi/agreement-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description: any;
  module: TypeModule;
  process: TypeProcess;
  descriptionAssumsi: any;
}

const api = new AdditionalInformationControllerApi();
const api_assumsi = new AssumptionQualificationControllerApi();

const useSaveAssumsi = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      {
        bucketProcessId,
        module,
        process,
        description,
        descriptionAssumsi,
      }: SaveDto) => {
      await api.saveAdditionalInformation(
        bucketProcessId,
        process,
        module,
        description,
      );
      await api_assumsi.saveAssumptionQualification(
        bucketProcessId,
        process,
        module,
        descriptionAssumsi
      );
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      console.log(variable, 'ini variable dari onSucces');
      queryClient.invalidateQueries({ queryKey: ['ls-additional-info', { bucketProcessId: variable.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['ls-asumsi-kualifikasi', { bucketProcessId: variable.bucketProcessId }]});

      onSuccess();
    },
  });

  return mutation;
};


export default useSaveAssumsi;
