import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

// Hook untuk mendapatkan Bank Options
export const useGetBankOptions = () => {
  return useQuery({
    queryFn: async () => {
      const response = await API('parameter.paramVa.getBank', {});

      // Response structure: response.data.data.listParameter
      const data = response.data?.data?.listParameter || [];

      return data.map((item: any) => ({
        label: item.value1, // "BNI", "BRI", "BSI", "MANDIRI"
        value: item.key, // "BNI", "BRI", "BSI", "MANDIRI"
      })) || [];
    },
    queryKey: ['param-va-bank-options'],
    staleTime: 5 * 60 * 1000,
  });
};

// Hook untuk mendapatkan VA Type Options
export const useGetVaTypeOptions = () => {
  return useQuery({
    queryFn: async () => {
      const response = await API('parameter.paramVa.getVaType', {});

      // Response structure: response.data.data.listParameter
      const data = response.data?.data?.listParameter || [];

      return data.map((item: any) => ({
        label: item.value1,
        value: item.key,
      })) || [];
    },
    queryKey: ['param-va-va-type-options'],
    staleTime: 5 * 60 * 1000,
  });
};

// Hook untuk mendapatkan Customer Type Options
export const useGetCustomerTypeOptions = () => {
  return useQuery({
    queryFn: async () => {
      const response = await API('parameter.paramVa.getCustomerType', {});

      // Response structure: response.data.data.listParameter
      const data = response.data?.data?.listParameter || [];

      return data.map((item: any) => ({
        label: item.value1,
        value: item.key,
      })) || [];
    },
    queryKey: ['param-va-customer-type-options'],
    staleTime: 5 * 60 * 1000,
  });
};

// Hook untuk mendapatkan semua dropdown options sekaligus
export const useGetAllDropdownOptions = () => {
  const bankQuery = useGetBankOptions();
  const vaTypeQuery = useGetVaTypeOptions();
  const customerTypeQuery = useGetCustomerTypeOptions();

  return {
    bankOptions: bankQuery.data || [],
    customerTypeOptions: customerTypeQuery.data || [],
    error: bankQuery.error || vaTypeQuery.error || customerTypeQuery.error,
    isLoading: bankQuery.isLoading || vaTypeQuery.isLoading || customerTypeQuery.isLoading,
    vaTypeOptions: vaTypeQuery.data || [],
  };
};
