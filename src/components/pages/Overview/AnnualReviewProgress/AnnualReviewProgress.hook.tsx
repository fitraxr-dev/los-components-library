'use client';

import { useMemo, useState } from 'react';

import dayjs from 'dayjs';

import useGetDataAnnualReviewProgress from '@/hooks/services/overview/annual-review-progress/useGetDataAnnualReviewProgress';

import type { AnnualReviewProgressData } from './AnnualReviewProgress.types';


const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const useAnnualReviewProgress = () => {
  const currentYear = dayjs().format('YYYY');

  const [filter, setFilter] = useState({
    filter: {
      divisionId: [],
      periode: currentYear,
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
  }, [f?.periode, f?.staffId, f?.tlId, f?.divisionId, currentYear]);

  const { data, isFetching, isLoading } = useGetDataAnnualReviewProgress(payload);

  const overviewData: AnnualReviewProgressData[] = useMemo(() => {
    const contents = data?.contents ?? [];

    const sorted = [...contents].sort(
      (a, b) =>
        parseInt(a.periode.split('-')[1]) - parseInt(b.periode.split('-')[1])
    );

    return sorted.map((item: any) => {
      const monthIndex = parseInt(item.periode.split('-')[1]) - 1;
      const monthName = MONTH_NAMES[monthIndex];

      const completed = item.data.find((d: any) => d.name === 'Completed')?.value ?? 0;
      const inProgress = item.data.find((d: any) => d.name === 'In Progress')?.value ?? 0;
      const notStarted = item.data.find((d: any) => d.name === 'Not Started')?.value ?? 0;

      return {
        completed,
        inProgress,
        month: monthName,
        notStarted,
      };
    });
  }, [data]);

  return {
    filter,
    loading: isFetching || isLoading,
    overviewData,
    payload,
    setFilter,
  };
};

export default useAnnualReviewProgress;
