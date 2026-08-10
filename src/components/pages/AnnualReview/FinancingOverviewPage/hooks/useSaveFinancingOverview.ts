import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  id: number | undefined;
  bucketProcessId: string;
  remark: string;
  process: TypeProcess;
  module: TypeModule;
  selected: any[];
  description: any;
  typeSubmission?: string;
  remarks?: string;
  typeFinancing?: string;
  typeProcess?: string;
}

const bucketApi = new BucketControllerApi();

const useSaveFinancingOverview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      bucketProcessId,
      process,
      module,
      remark,
      selected,
      description,
      typeSubmission,
      remarks,
      typeFinancing,
      typeProcess,
    }: SaveDto) => {
      const res = await API('mip.financingFacility.save', {
        data: {
          bucketProcessId,
          description,
          id,
          module,
          process,
          remark,
          selected,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (typeSubmission !== undefined) {
        await bucketApi.saveBucketDetail({
          bucketProcessId,
          module,
          process,
          remarks,
          typeFinancing,
          typeProcess,
          typeSubmission,
        });
      }

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-overview', { bucketProcessId: variable.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-validate']});
      if (variable.typeSubmission !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['detail-bucket-debtor']});
      }
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveFinancingOverview;
