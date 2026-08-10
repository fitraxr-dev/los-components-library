import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


import type { UseMutationOptions } from '@tanstack/react-query';


interface SaveParameterVARequest {
  bucketProcessId: string;
  bankName: string;
  currency: string;
  vaType: string;
  vaTypeDigit: string;
  customerType: string;
  bankPrefix: string;
  totalDigit: number;
  isActive: boolean;
}

interface CreateParameterVARequest {
  bankName: string;
  currency: string;
  vaType: string;
  vaTypeDigit: string;
  customerType: string;
  bankPrefix: string;
  totalDigit: number;
  isActive: boolean;
}

interface SaveParameterVAResponse {
  success: boolean;
  message?: string;
  data?: {
    bucketProcessId?: string;
    id?: number;
  };
}

const useSaveParameterVA = (
  options?: Partial<UseMutationOptions<SaveParameterVAResponse, Error, SaveParameterVARequest>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: SaveParameterVARequest) => {
      try {
        const response = await API('parameter.paramVa.processSave', { data: payload });
        return response.data;
      } catch (error) {
        console.error('Save Parameter VA API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

const useCreateParameterVA = (
  options?: Partial<UseMutationOptions<SaveParameterVAResponse, Error, CreateParameterVARequest>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateParameterVARequest) => {
      try {
        const response = await API('parameter.paramVa.processSave', { data: payload });
        return response.data;
      } catch (error) {
        console.error('Create Parameter VA API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useSaveParameterVA;
export { useCreateParameterVA };
