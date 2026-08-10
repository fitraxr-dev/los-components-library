import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type DropdownValue = {
  value: string;
  label: string;
  [key: string]: string | number;
}

type DivisionOptions = {
  label?: string;
  value?: string;
  [key: string]: string | number;
}

interface DivisionListResponse {
  contents?: Array<{
    key?: string;
    label?: string;
    additionalData?: any;
    [key: string]: any;
  }>;
}

const useGetDivisionList = (
  options: DivisionOptions = {
    label: 'label',
    value: 'key',
  },
  config?: Partial<UseQueryOptions<DropdownValue[]>>
) => {
  const query = useQuery<DropdownValue[]>({
    placeholderData: [],
    queryFn: async () => {
      const res = await API('userManagement.master.divisionList', {
        data: {},
      });

      const data: DivisionListResponse = res.data?.data ?? {};
      const contents = data.contents || [];

      return contents.map((data) => {
        const finalObject: any = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value as string] || '';
        }

        return finalObject;
      });
    },
    queryKey: ['division-list-v2'],
    ...config,
  });

  return query;
};

export default useGetDivisionList;
