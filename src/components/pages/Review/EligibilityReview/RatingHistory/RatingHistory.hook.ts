import { useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';

import useGetRatingHistory from './hooks/useGetRatingHistory';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useRatingHistory = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { processId } = useParams();
  const searchParams = useSearchParams();

  const debtorId = searchParams.get('debtorId');

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DEPI,
  });

  const debtorName = debtorInfoData?.debtorName;

  const { data, isLoading } = useGetRatingHistory({
    debtorId: Number(debtorId),
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });


  const ratingHistoryList = data?.content?.map((process, index) => ({
    debtor: process.debtor?.name || process.name || '',
    division: process.division || '',
    id: process.id?.toString() || '',
    index: (page - 1) * pageSize + index + 1,
    memoDate: process.memo_date || '',
    memoNumber: process.memo_number || '',
    pic: process.analyst?.name || '',
    ratingAnalyst: process.analyst?.name || '',
    ratingPeriod: process.period || '',
    ratingResult: process.rating_result || '',
    ratingType: process.rating_type || '',
  })) || [];


  const ratingHistoryPage = data?.page;

  const HISTORY_TABLE_HEADER: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtor',
      label: 'Customer / Proyek',
      sx: {
        minWidth: '14vw',
      },
    },
    {
      key: 'pic',
      label: 'Nama PIC Staff',
      sx: {
        minWidth: '14vw',
      },
    },
    {
      key: 'division',
      label: 'Division',
      sx: {
        minWidth: '8vw',
      },
    },
    {
      key: 'ratingType',
      label: 'Rating Type',
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'ratingAnalyst',
      label: 'Rating Analyst',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'memoNumber',
      label: 'Nomor Memo',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'memoDate',
      label: 'Tanggal Rating Memo',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'ratingPeriod',
      label: 'Rating Periode',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'ratingResult',
      label: 'Rating Result',
      sx: {
        minWidth: '12vw',
      },
    },
  ];

  return {
    HISTORY_TABLE_HEADER,
    debtorName,
    isLoading,
    page,
    pageSize,
    ratingHistoryList,
    ratingHistoryPage,
    setPage,
    setPageSize,
  };
};
