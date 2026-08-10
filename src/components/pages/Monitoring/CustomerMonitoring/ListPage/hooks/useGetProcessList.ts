import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type DropdownValue = {
  value: string;
  label: string;
  [key: string]: string | number;
}

type ProcessOptions = {
  label?: string;
  value?: string;
  [key: string]: string | number;
}

interface ProcessListPayload {
  division?: string[];
}

interface ProcessListResponse {
  contents?: Array<{
    module?: string;
    process?: string;
    label?: string;
    [key: string]: any;
  }>;
}

const useGetProcessList = (
  payload: ProcessListPayload = {},
  options: ProcessOptions = {
    label: 'label',
    value: 'process',
  },
  config?: Partial<UseQueryOptions<DropdownValue[]>>
) => {
  const query = useQuery<DropdownValue[]>({
    placeholderData: [],
    queryFn: async () => {
      const res = await API('dashboard.master.processByDivision', {
        data: payload,
      });

      const data: ProcessListResponse = res.data?.data ?? {};
      const contents = data.contents || [];

      return contents.map((data) => {
        const finalObject: any = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value as string] || '';
        }

        return finalObject;
      });
    },
    queryKey: ['process-list-by-division', payload.division],
    ...config,
  });

  return query;
};

export default useGetProcessList;
