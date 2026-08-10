import { useState } from 'react';

import { usePathname } from 'next/navigation';

import { mip } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetDebtorHistory from '@/components/pages/Review/EligibilityReview/RatingHistory/hooks/useGetDebtorHistory';

import { modal } from '../../RatingAndRiskProfile.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useHistoryRating = () => {
  const [filter, setFilter] = useSessionStorage('filter-component-rating-history-modal-mip', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { processId } = useIdentity();
  const path = usePathname();
  const router = useCustomRouter();

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  });

  // --- PARAMETER ---
  const { data: searchByOptions } = useGetParameterList('searchByHistoryDEPIDebtorName', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---

  const debtorName = debtorInfoData?.debtorName;
  const { data, isLoading } = useGetDebtorHistory({
    filter: {
      ...filter?.filter,
      debtorName,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: !!debtorName,
  });

  const ratingHistoryList = data?.content?.contents?.map((process, index) => ({
    debtor: process.name || '',
    id: process.id || '',
  })) || [];
  const ratingHistoryPage = data?.content?.page;


  const handleOpenHistory = (row: any) => {
    const queryParams = new URLSearchParams({
      debtorId: row?.id || null,
      lastPath: path,
    }).toString();

    router.push(`${replacePath(
      mip.RATING_HISTORY,
      {
        processId: processId,
      }
    )}?${queryParams}`);
    closeNiceModal(modal.HISTORY_RATING);
  };

  const TABLE_HEADER: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtor',
      label: 'Nama Customer / Proyek',
      sx: {
        minWidth: '14vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => {
            handleOpenHistory(row);
          },
        },
      ],
      sx: { minWidth: '5vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;
  const filterContentList = [];

  return {
    TABLE_HEADER,
    debtorName,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    ratingHistoryList,
    ratingHistoryPage,
    setFilter,
    setPage,
    setPageSize,
  };
};

export default useHistoryRating;
