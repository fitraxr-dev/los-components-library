import * as React from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterGroupLovCodeRequest {
  applicationType: string;
  from?: 'item' | 'subitem' | null;
  currentReferenceGroup?: string | null;
}


const useGetParameterGroupLovCode = ({
  applicationType,
  from,
  currentReferenceGroup,
}: ParameterGroupLovCodeRequest) => {
  const query = useQuery({
    enabled: !!applicationType,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.lovCode', {
        data: {
          applicationType,
          from,
          module: 'CUSTOMER_DUE_DILIGENCE',
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'lov-code', 'cdd', applicationType, from],
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
    const current = currentReferenceGroup != null ? String(currentReferenceGroup) : undefined;
    if (!current) return base;
    return base.some((o) => o.value === current)
      ? base
      : [{ label: current, value: current }, ...base];
  }, [query.data, currentReferenceGroup]);

  return {
    ...query,
    data: options,
  };
};

export default useGetParameterGroupLovCode;
