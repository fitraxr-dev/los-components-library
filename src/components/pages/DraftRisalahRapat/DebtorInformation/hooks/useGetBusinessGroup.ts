import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { GetAllDebtorGroupRequestDto } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroup = (payload: GetAllDebtorGroupRequestDto) => {
  const query = useQuery({
    enabled: payload.bucketProcessId !== undefined && payload.bucketProcessId !== null,
    initialData: [],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListDebtorGroup(payload);

      if (!res.data.data.contents) return;
      const result = res.data.data.contents.map((group) => ({
        label: group.name,
        value: group.id.toString(),
      }));

      return result;
    },
    queryKey: ['debtor-group-list', payload],
  });

  return query;
};

export default useGetBusinessGroup;
