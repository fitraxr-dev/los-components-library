import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type DropdownValue = {
  value: string;
  label: string;
}

interface DebtorLovResponse {
  contents?: Array<{
    key?: string;
    label?: string;
    [key: string]: any;
  }>;
}

const useGetDebtorLov = (
  config?: Partial<UseQueryOptions<DropdownValue[]>>
) => {
  const query = useQuery<DropdownValue[]>({
    placeholderData: [],
    queryFn: async () => {
      const res = await API('bucket.debtor.lov', {
        data: {},
      });

      const data: DebtorLovResponse = res.data?.data ?? {};
      const contents = data.contents || [];

      return contents.map((item) => ({
        label: item?.label || '',
        value: item?.key || '',
      }));
    },
    queryKey: ['debtor-lov'],
    ...config,
  });

  return query;
};

export default useGetDebtorLov;
