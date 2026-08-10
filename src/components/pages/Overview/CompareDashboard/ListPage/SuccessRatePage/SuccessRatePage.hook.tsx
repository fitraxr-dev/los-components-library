'use client';

import { useMemo } from 'react';

import useGetDataCompareSuccessRate from '@/hooks/services/overview/compare-dashboard/useGetDataCompareSuccessRate';


interface FilterValues {
  direktorat?: string;
  divisi1: string;
  divisi1Label?: string;
  divisi2: string;
  divisi2Label?: string;
}

export interface SuccessRateItem {
  name: string;
  divisi1: number | string;
  divisi2: number | string;
}

export interface SuccessRateGroup {
  category: string;
  items: SuccessRateItem[];
}

const CATEGORY_MAP = {
  all: 'Keseluruhan Pengajuan',
  existingCustomer: 'Existing Customer',
  newCustomer: 'New Customer',
};

const useSuccessRatePage = (filterValues: FilterValues) => {
  const payload = useMemo(() => {
    return {
      div1: filterValues.divisi1 || 'BUSINESS_DIVISION',
      div2: filterValues.divisi2 || 'DPOP',
    };
  }, [filterValues.divisi1, filterValues.divisi2]);

  const { data: apiData, isLoading, isFetching } = useGetDataCompareSuccessRate(payload);

  const content = apiData?.content ?? {};
  const div1 = content.div1 ?? {};
  const div2 = content.div2 ?? {};

  const STATUS_ORDER = [
    'Pipeline',
    'In Progress',
    'Approve',
    'Partial Efektif',
    'Efektif Pembiayaan',
    'Decline',
  ];

  const data: SuccessRateGroup[] = useMemo(() => {
    return Object.keys(CATEGORY_MAP).map((key) => {
      const items1 = div1[key] ?? [];
      const items2 = div2[key] ?? [];

      const map = new Map<string, SuccessRateItem>();

      items1.forEach((i: any) => {
        map.set(i.name, {
          divisi1: i.value ?? '-',
          divisi2: 'Not Relevant',
          name: i.name,
        });
      });

      items2.forEach((i: any) => {
        if (map.has(i.name)) {
          const exist = map.get(i.name)!;
          exist.divisi2 = i.value ?? '-';
        } else {
          map.set(i.name, {
            divisi1: 'Not Relevant',
            divisi2: i.value ?? '-',
            name: i.name,
          });
        }
      });

      return {
        category: CATEGORY_MAP[key],
        items: Array.from(map.values()).sort((a, b) => {
          const indexA = STATUS_ORDER.indexOf(a.name);
          const indexB = STATUS_ORDER.indexOf(b.name);
          return indexA - indexB;
        }),
      };
    });
  }, [div1, div2]);

  const getDivisiNames = {
    divisi1: filterValues.divisi1Label || filterValues.divisi1 || 'Divisi 1',
    divisi2: filterValues.divisi2Label || filterValues.divisi2 || 'Divisi 2',
  };

  return {
    data,
    getDivisiNames,
    isLoading: isLoading || isFetching,
  };
};

export default useSuccessRatePage;
