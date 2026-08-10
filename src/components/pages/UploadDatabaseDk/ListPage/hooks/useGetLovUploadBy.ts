import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type UploadByOption = {
  value: string;
  label: string;
};

const useGetLovUploadBy = (config?: Partial<UseQueryOptions<UploadByOption[]>>) => {
  const query = useQuery<UploadByOption[]>({
    placeholderData: [],
    queryFn: async () => {
      const response = await API('master.databaseDk.lovUploadBy', {});
      const result = response.data.data;

      return result.map((data: any) => ({
        label: data.label,
        value: data.userId,
      }));
    },
    queryKey: ['database-dk-lov-upload-by'],
    ...config,
  });

  return query;
};

export default useGetLovUploadBy;
