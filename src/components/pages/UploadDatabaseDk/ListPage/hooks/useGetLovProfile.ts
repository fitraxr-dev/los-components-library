import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type ProfileOption = {
  value: string;
  label: string;
};

const useGetLovProfile = (config?: Partial<UseQueryOptions<ProfileOption[]>>) => {
  const query = useQuery<ProfileOption[]>({
    placeholderData: [],
    queryFn: async () => {
      const response = await API('master.databaseDk.lovProfile', {});
      const result = response.data.data;

      return result.map((data: any) => ({
        label: data.label,
        value: data.label,
      }));
    },
    queryKey: ['database-dk-lov-profile'],
    ...config,
  });

  return query;
};

export default useGetLovProfile;
