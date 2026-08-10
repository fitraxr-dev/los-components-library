import { useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { annualReview } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCopyRating from '@/hooks/services/useCopyRating';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetRatingHistory from '@/components/pages/Review/EligibilityReview/RatingHistory/hooks/useGetRatingHistory';

import { standaloneStatuses } from './RatingHistory.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export interface MappedRatingHistoryItem {
  annualReviewId: string;
  debtor: string;
  division: string;
  id: string;
  index: number;
  isCopyRating: boolean;
  memoDate: string;
  memoNumber: string;
  pic: string;
  ratingAnalyst: string;
  ratingPeriod: string;
  ratingResult: string;
  ratingType: string;
}

export const useRatingHistory = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<MappedRatingHistoryItem | null>(null);
  const { processId, pageModule } = useParams();
  const searchParams = useSearchParams();
  const router = useCustomRouter();

  const debtorId = searchParams.get('debtorId');
  const moduleParam = searchParams.get('module') ?? '';
  const processParam = searchParams.get('process') ?? '';

  const [{ stepper }] = useApp();
  const currentBucketStatus = stepper?.from;

  const isStandaloneReRating = standaloneStatuses?.includes(currentBucketStatus);

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: moduleParam,
    process: processParam,
  });

  const { data, isLoading } = useGetRatingHistory({
    debtorCode: debtorInfoData?.debtorId,
    debtorId: Number(debtorId),
    module: moduleParam,
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    process: processParam,
  });

  const ratingHistoryList = data?.content?.map((item, index) => ({
    annualReviewId: item.annual_review?.[0]?.id?.toString() || '',
    debtor: item.debtor?.name || item.name || '',
    division: item.division || '',
    id: item.id?.toString() || '',
    index: (page - 1) * pageSize + index + 1,
    isCopyRating: item.is_copy_rating ?? false,
    memoDate: item.memo_date || '',
    memoNumber: item.memo_number || '',
    pic: item.analyst?.name || '',
    ratingAnalyst: item.analyst?.name || '',
    ratingPeriod: item.period || '',
    ratingResult: item.rating_result || '',
    ratingType: item.rating_type || '',
  })) || [];

  const ratingHistoryPage = data?.page;

  const { mutate: copyRating, isPending: isCopyLoading } = useCopyRating({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          router.replace(replacePath(annualReview.RATING, {
            pageModule: String(pageModule),
            processId: String(processId),
          }));
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSubmit = () => {
    copyRating({
      annualReviewId: selected?.annualReviewId ?? '',
      ratingId: selected?.id ?? '',
      sourceDigitalMemo: selected?.memoNumber ?? '',
      sourceMemoDate: selected?.memoDate ?? '',
      targetBucketProcessId: String(processId),
    });
  };

  const radioHeader: TableHeader = {
    isDisabled: (row) => !row.isCopyRating,
    isSelected: (row) => selected?.id === row.id,
    key: 'radio',
    onSelectChange: (row) => {
      setSelected((prev) => (prev?.id === row.id ? null : row));
    },
    type: 'radio',
  };

  const HISTORY_TABLE_HEADER: TableHeader[] = [
    ...(!isStandaloneReRating ? [radioHeader] : []),
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtor',
      label: 'Customer / Proyek',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'pic',
      label: 'Nama PIC Staff',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'division',
      label: 'Division',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'ratingType',
      label: 'Rating Type',
      sx: { minWidth: '7vw' },
    },
    {
      key: 'ratingAnalyst',
      label: 'Rating Analyst',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'memoNumber',
      label: 'Nomor Memo',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'memoDate',
      label: 'Tanggal Rating Memo',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'ratingPeriod',
      label: 'Rating Periode',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'ratingResult',
      label: 'Rating Result',
      sx: { minWidth: '12vw' },
    },
  ];

  return {
    HISTORY_TABLE_HEADER,
    handleSubmit,
    isCopyLoading,
    isLoading,
    isStandaloneReRating,
    page,
    pageSize,
    ratingHistoryList,
    ratingHistoryPage,
    selected,
    setPage,
    setPageSize,
  };
};
