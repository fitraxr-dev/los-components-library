import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type DropdownValue = {
  value: string;
  label: string;
  [key: string]: string | number;
}

type StatusOptions = {
  label?: string;
  value?: string;
  [key: string]: string | number;
}

interface StatusListPayload {
  process?: string[];
}

interface StatusListResponse {
  contents?: Array<{
    key?: string;
    label?: string;
    [key: string]: any;
  }>;
}

const useGetProcessStatusList = (
  payload: StatusListPayload = {},
  options: StatusOptions = {
    label: 'label',
    value: 'key',
  },
  config?: Partial<UseQueryOptions<DropdownValue[]>>
) => {
  const query = useQuery<DropdownValue[]>({
    enabled: !!payload.process && payload.process.length > 0,
    placeholderData: [],
    queryFn: async () => {
      const res = await API('bucket.bucketList.statusByProcess', {
        data: payload,
      });

      const data: StatusListResponse = res.data?.data ?? {};
      const contents = data.contents || [];

      return contents.map((data) => {
        const finalObject: any = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value as string] || '';
        }

        return finalObject;
      });
    },
    queryKey: ['process-status-list', payload.process],
    ...config,
  });

  return query;
};

export default useGetProcessStatusList;
