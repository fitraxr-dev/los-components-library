'use client';

import { useState, useMemo } from 'react';

import dayjs from 'dayjs';

import useGetDataTurnAroundTimeByProcess from '@/hooks/services/overview/turn-around-time/useGetDataTurnAroundTime';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';

import type { TATOverviewWithColor } from './TurnAroundTime.types';


const MONTH_MAP: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'Mei',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Agu',
  '09': 'Sep',
  '10': 'Okt',
  '11': 'Nov',
  '12': 'Des',
};

const useTATOverview = () => {
  const currentYear = dayjs().format('YYYY');
  const { isMaker, isDirektur, isChecker, isInternalGuest, divisionCode } = useOverviewContext();

  const getDefaultDivisionId = () => {
    if (isMaker || isChecker) return ['DTI_DIVISION'];
    if (isDirektur) return ['BoD_GROUP'];
    if (isInternalGuest) return [divisionCode];
    return [];
  };

  const defaultDivisionId = getDefaultDivisionId();

  const [filter, setFilter] = useState({
    filter: {
      divisionId: defaultDivisionId,
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
        divisionId: f.divisionId?.length ? f.divisionId : defaultDivisionId,
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
  }, [f?.periode, f?.process, f?.staffId, f?.tlId, f?.divisionId, defaultDivisionId, currentYear]);

  const { data: apiData, isLoading } = useGetDataTurnAroundTimeByProcess(payload, {
    enabled: true,
  });

  const selectedYear = useMemo(() => f?.periode || currentYear, [f?.periode, currentYear]);

  const tatData: TATOverviewWithColor[] = useMemo(() => {
    if (!apiData?.contents) return [];

    const apiDataMap = new Map<string, any>();
    const colorMap = new Map<string, string>();

    apiData.contents.forEach((item: any) => {
      if (item.periode) {
        apiDataMap.set(item.periode, item);
        if (item.data && item.data.length > 0) {
          item.data.forEach((d: any) => {
            if (!colorMap.has(d.name)) {
              colorMap.set(d.name, d.color);
            }
          });
        }
      }
    });

    const allMonths: TATOverviewWithColor[] = [];

    for (let month = 1; month <= 12; month++) {
      const monthNum = String(month).padStart(2, '0');
      const periode = `${selectedYear}-${monthNum}`;
      const monthLabel = MONTH_MAP[monthNum];

      const row: TATOverviewWithColor = {
        averages: {},
        colors: {},
        month: monthLabel,
        periode,
      };

      const apiItem = apiDataMap.get(periode);

      if (apiItem?.data && apiItem.data.length > 0) {
        apiItem.data.forEach((d: any) => {
          row[d.name] = d.value;
          row.colors[d.name] = d.color;
          row.averages[d.name] = d.average ?? 0;
        });
      } else {
        colorMap.forEach((color, name) => {
          row.colors[name] = color;
        });
      }
      allMonths.push(row);
    }

    return allMonths;
  }, [apiData, selectedYear]);

  const barKeys = useMemo(() => {
    if (!apiData?.contents?.length) return [];

    const uniqueNames = new Set<string>();

    apiData.contents.forEach((item: any) => {
      if (item.data && item.data.length > 0) {
        item.data.forEach((d: any) => {
          uniqueNames.add(d.name);
        });
      }
    });

    return Array.from(uniqueNames);
  }, [apiData]);

  return {
    barKeys,
    filter,
    isLoading,
    loading: isLoading,
    setFilter,
    tatData,
  };
};

export default useTATOverview;
