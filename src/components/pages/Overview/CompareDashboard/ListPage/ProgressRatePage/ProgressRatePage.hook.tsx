'use client';

import { useMemo } from 'react';

import useGetDataCompareProgressRate from '@/hooks/services/overview/compare-dashboard/useGetDataCompareProgressRate';


interface FilterValues {
  direktorat: string;
  divisi1: string;
  divisi2: string;
  divisi1Label?: string;
  divisi2Label?: string;
}

const useProgressRatePage = (filterValues: FilterValues) => {
  const payload = useMemo(() => {
    return {
      div1: filterValues.divisi1 || 'BUSINESS_DIVISION',
      div2: filterValues.divisi2 || 'DPOP',
    };
  }, [filterValues.divisi1, filterValues.divisi2]);

  const { data: apiData, isLoading, isFetching } = useGetDataCompareProgressRate(payload);

  const mappedData = useMemo(() => {
    const content = apiData?.content;
    if (!content) {
      return {
        items: [],
        total1: 0,
        total2: 0,
      };
    }

    const div1 = content.div1 ?? [];
    const div2 = content.div2 ?? [];

    // Merge by name so all unique names from both divisions appear
    const map = new Map<string, { name: string; divisi1: number | string; divisi2: number | string }>();

    div1.forEach((row: any) => {
      map.set(row.name, {
        divisi1: row.value ?? 0,
        divisi2: 'Not Relevant',
        name: row.name,
      });
    });

    div2.forEach((row: any) => {
      if (map.has(row.name)) {
        const exist = map.get(row.name)!;
        exist.divisi2 = row.value ?? 0;
      } else {
        map.set(row.name, {
          divisi1: 'Not Relevant',
          divisi2: row.value ?? 0,
          name: row.name,
        });
      }
    });

    const items = Array.from(map.values());

    const total1 = div1.reduce((acc: number, curr: any) => acc + (curr?.value ?? 0), 0);
    const total2 = div2.reduce((acc: number, curr: any) => acc + (curr?.value ?? 0), 0);

    return { items, total1, total2 };
  }, [apiData]);

  const getDivisiNames = {
    divisi1: filterValues.divisi1Label || filterValues.divisi1 || 'Divisi 1',
    divisi2: filterValues.divisi2Label || filterValues.divisi2 || 'Divisi 2',
  };

  return {
    data: mappedData,
    getDivisiNames,
    isLoading: isLoading || isFetching,
  };
};

export default useProgressRatePage;
