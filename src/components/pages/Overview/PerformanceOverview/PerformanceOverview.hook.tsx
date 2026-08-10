'use client';

import { useMemo, useState } from 'react';

import dayjs from 'dayjs';

import useGetDataPerformanceOverview from '@/hooks/services/overview/performance-overview/useGetDataPerformanceOverview';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';

import type { PerformanceOverviewData, FilterState } from './PerformanceOverView.types';


const usePerformanceOverview = () => {
  const { isBusinessDivision, isNonBusinessDivision, isMaker, isDirektur, isChecker } = useOverviewContext();

  const currentYear = dayjs().format('YYYY');

  const [filter, setFilter] = useState<FilterState>({
    filter: {
      divisionId: [],
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
  }, [f?.periode, f?.process, f?.staffId, f?.tlId, f?.divisionId, currentYear]);

  const { data: apiData, isFetching } = useGetDataPerformanceOverview(payload);

  const uniqueStatuses: any[] = useMemo(() => {
    if (!apiData?.contents?.length) return [];

    const statusMap = new Map();
    apiData.contents.forEach((item: any) => {
      if (Array.isArray(item.data)) {
        item.data.forEach((statusItem: any) => {
          if (!statusMap.has(statusItem.name)) {
            statusMap.set(statusItem.name, {
              color: statusItem.color,
              description: statusItem.description,
              name: statusItem.name,
            });
          }
        });
      }
    });

    return Array.from(statusMap.values());
  }, [apiData]);

  const overviewData: PerformanceOverviewData[] = useMemo(() => {
    if (!apiData?.contents?.length) return [];

    return apiData.contents.map((item: any) => {
      const [year, month] = item.periode.split('-');
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const monthLabel = monthNames[parseInt(month) - 1];

      const flatData: any = { month: monthLabel };

      if (Array.isArray(item.data)) {
        item.data.forEach((statusItem: any) => {
          if (statusItem.value > 0) {
            flatData[statusItem.name] = statusItem.value;
          }
        });
      }

      return flatData;
    });
  }, [apiData]);

  const filteredData = useMemo(() => {
    return overviewData;
  }, [overviewData, isMaker, isDirektur, isBusinessDivision, isNonBusinessDivision, isChecker]);

  return {
    filter,
    loading: isFetching,
    overviewData: filteredData,
    payload,
    setFilter,
    uniqueStatuses,
  };
};

export default usePerformanceOverview;
