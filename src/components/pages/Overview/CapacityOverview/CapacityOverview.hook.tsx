'use client';

import { useMemo, useState } from 'react';

import dayjs from 'dayjs';

import useGetDataCapacityOverview from '@/hooks/services/overview/capacity-overview/useGetDataCapacityOverview';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';

import type { CapacityOverviewData } from './CapacityOverview.types';


const useCapacityOverview = () => {
  const { isKadiv, isTL } = useOverviewContext();
  const currentYear = dayjs().format('YYYY');
  const [filter, setFilter] = useState({
    filter: {
      divisionId: [],
      orderType: [],
      periode: currentYear,
      process: [],
      staffId: [],
      tlId: [],
    },
  });

  const f = filter.filter;

  const payload = useMemo(() => {
    const periodeRaw = f?.periode;
    const periodeFinal = periodeRaw || currentYear;
    const builtPayload = {
      filter: {
        divisionId: f.divisionId || [],
        orderType: f.orderType || [],
        periode: periodeFinal,
        process: f.process || [],
        staffId: f.staffId || [],
        tlId: f.tlId || [],
      },
      page: {
        itemPerPage: 10,
        noPage: 1,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    };
    return builtPayload;
  }, [f?.divisionId, f?.orderType, f?.periode, f?.process, f?.staffId, f?.tlId, currentYear]);

  const { data, isLoading, isError } = useGetDataCapacityOverview(payload);

  const capacityData: CapacityOverviewData[] = useMemo(() => {
    const contents = data?.contents;

    if (!contents) return [];

    // Handle array response (multiple staff)
    if (Array.isArray(contents)) {
      return contents.map((item) => ({
        existingDebitur: item.existingCustomer ?? 0,
        label: item.name ?? '-',
        newDebitur: item.newCustomer ?? 0,
      }));
    }

    // Handle single object response (backward compatibility)
    return [
      {
        existingDebitur: contents.existingCustomer ?? 0,
        label: contents.name ?? '-',
        newDebitur: contents.newCustomer ?? 0,
      },
    ];
  }, [data]);

  return {
    capacityData,
    error: isError,
    filter,
    loading: isLoading,
    setFilter,
  };
};

export default useCapacityOverview;
