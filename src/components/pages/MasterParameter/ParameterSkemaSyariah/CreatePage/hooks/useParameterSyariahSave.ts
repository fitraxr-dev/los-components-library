import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterSyariahAttribute {
  attributeKey: string;
  attributeLabel: string;
  attributeType: string;
}

interface ParameterSyariahSaveParams {
  id: number;
  bucketProcessId?: string;
  productCode: string;
  productName: string;
  productReferenceCode: string;
  productReferenceName: string;
  isActive: boolean;
  action: 'ADD' | 'UPDATE';
  attributes: ParameterSyariahAttribute[];
}

const useParameterSyariahSave = (options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (params: ParameterSyariahSaveParams) => {
      const res = await API('parameter.parameterSkemaSyariah.save', {
        data: params,
      });

      return res.data;
    },
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });

  return mutation;
};

export default useParameterSyariahSave;
