'use client';

import { useState, useMemo } from 'react';

import dayjs from 'dayjs';

import useGetDataExistingDebitur from '@/hooks/services/overview/success-rate/useGetDataExistingDebitur';
import useGetDataKeseluruhanPengajuan from '@/hooks/services/overview/success-rate/useGetDataKeseluruhanPengajuan';
import useGetDataNewDebitur from '@/hooks/services/overview/success-rate/useGetDataNewDebitur';
import useGetDataPengajuanPerbulan from '@/hooks/services/overview/success-rate/useGetDataPengajuanPerbulan';

import type { PengajuanPerbulanItem } from './SuccessRate.types';


export default function useSuccessRate() {
  const [filter, setFilter] = useState({
    filter: {
      divisionId: [],
      periode: dayjs().format('MM/YYYY'),
      process: [],
      staffId: [],
      tlId: [],
    },
  });

  const f = filter?.filter ?? {
    divisionId: [],
    periode: null,
    process: [],
    staffId: [],
    tlId: [],
  };

  const basePayload = useMemo(() => {
    const periodeRaw = f?.periode;

    const periodeFinal = (() => {
      if (!periodeRaw) return null;

      const parsed = dayjs(periodeRaw, ['MM/YYYY', 'YYYY-MM']);
      return parsed.isValid()
        ? parsed.format('MM/YYYY')
        : null;
    })();

    const processIds = Array.isArray(f.process)
      ? f.process
      : f.process
        ? [f.process]
        : [];

    const staffIds = Array.isArray(f.staffId)
      ? f.staffId
      : f.staffId
        ? [f.staffId]
        : [];

    const tlIds = Array.isArray(f.tlId)
      ? f.tlId
      : f.tlId
        ? [f.tlId]
        : [];

    const divisionIds = Array.isArray(f.divisionId)
      ? f.divisionId
      : f.divisionId
        ? [f.divisionId]
        : [];

    const filterObj: any = {};
    if (periodeFinal) {
      filterObj.periode = periodeFinal;
    }
    if (staffIds.length > 0) {
      filterObj.staffId = staffIds;
    }
    if (tlIds.length > 0) {
      filterObj.tlId = tlIds;
    }
    if (divisionIds.length > 0) {
      filterObj.divisionId = divisionIds;
    }
    if (processIds.length > 0) {
      filterObj.process = processIds;
    }

    return {
      filter: filterObj,
      page: {
        itemPerPage: 10,
        noPage: 1,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    };
  }, [filter]);

  const { data: pengajuanPerbulanDataRaw, isFetching: isFetchingPengajuan } =
    useGetDataPengajuanPerbulan(basePayload);

  const { data: keseluruhanPengajuanDataRaw, isFetching: isFetchingKeseluruhan } =
    useGetDataKeseluruhanPengajuan(basePayload);

  const { data: newDebiturDataRaw, isFetching: isFetchingNewDebitur } =
    useGetDataNewDebitur(basePayload);

  const { data: existingDebiturDataRaw, isFetching: isFetchingExistingDebitur } =
    useGetDataExistingDebitur(basePayload);

  const loading =
    isFetchingPengajuan ||
    isFetchingKeseluruhan ||
    isFetchingNewDebitur ||
    isFetchingExistingDebitur;

  const pengajuanPerbulanData: PengajuanPerbulanItem[] = useMemo(() => {
    const contents = pengajuanPerbulanDataRaw?.contents ?? [];

    return contents.map((item: any) => {
      const monthName = dayjs(item.periode, 'YYYY-MM').format('MMMM YYYY');
      const row: Record<string, any> = { month: monthName };
      if (Array.isArray(item.data)) {
        item.data.forEach((d: any) => {
          row[d.name] = d.value;
        });
      }

      return row as PengajuanPerbulanItem;
    });
  }, [pengajuanPerbulanDataRaw]);

  const keseluruhanPengajuanData = keseluruhanPengajuanDataRaw?.contents ?? [];
  const newDebiturData = newDebiturDataRaw?.contents ?? [];
  const existingDebiturData = existingDebiturDataRaw?.contents ?? [];

  return {
    existingDebiturData,
    filter,
    keseluruhanPengajuanData,
    loading,
    newDebiturData,
    pengajuanPerbulanData,
    setFilter,
  };
}
