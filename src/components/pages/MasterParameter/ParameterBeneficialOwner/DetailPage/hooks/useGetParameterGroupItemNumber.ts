import * as React from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterGroupItemNumberRequest {
  applicationType: string;
  from?: 'item' | 'subitem';
  currentItemNo?: number | string | null;
}

const useGetParameterGroupItemNumber = ({ applicationType, from, currentItemNo }: ParameterGroupItemNumberRequest) => {
  const query = useQuery({
    enabled: !!applicationType,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.noItem', {
        data: {
          applicationType,
          from,
          module: 'BENEFICIAL_OWNER',
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'lov-number', 'bo', applicationType, from],
    select: (data) => {
      const items = data?.contents ?? [];
      return items.map((item: { label?: string; key: string | number }) => ({
        label: String(item.label ?? item.key),
        value: String(item.key),
      }));
    },
  });

  const options = React.useMemo(() => {
    const base = query.data ?? [];
    // eslint-disable-next-line eqeqeq
    const current = currentItemNo != null ? String(currentItemNo) : undefined;
    if (!current) return base;
    return base.some((o) => o.value === current)
      ? base
      : [{ label: current, value: current }, ...base];
  }, [query.data, currentItemNo]);

  return {
    ...query,
    data: options,
  };
};

export default useGetParameterGroupItemNumber;
