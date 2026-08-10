import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type CategoryOption = {
  value: string;
  label: string;
};

const useGetLovCategory = (config?: Partial<UseQueryOptions<CategoryOption[]>>) => {
  const query = useQuery<CategoryOption[]>({
    placeholderData: [],
    queryFn: async () => {
      const response = await API('master.databaseDk.lovCategory', {});
      const result = response.data.data;

      return result.map((data: any) => ({
        label: data.label,
        value: data.label,
      }));
    },
    queryKey: ['database-dk-lov-category'],
    ...config,
  });

  return query;
};

export default useGetLovCategory;
