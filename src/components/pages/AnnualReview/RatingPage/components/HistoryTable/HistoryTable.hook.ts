import { useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { annualReview } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import useGetDebtorHistory from '@/components/pages/Review/EligibilityReview/RatingHistory/hooks/useGetDebtorHistory';

import { MODAL_ID } from '../../Rating.constants';

import { HISTORY_TABLE_HEADER } from './HistoryTable.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useHistoryTable = (props: { module?: string; process?: string; cantAccess?: boolean }) => {
  const [filter, setFilter] = useSessionStorage('filter-annual-review-history-table', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { processId } = useParams();
  const path = usePathname();
  const pathArray = path.split('/');
  const pageModule = pathArray[2];
  const router = useCustomRouter();

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: props.module,
    process: props.process,
  });

  const { data: searchByOptions } = useGetParameterList('searchByHistoryDEPIDebtorName', { label: 'value1', value: 'value2' });

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

  const ratingHistoryList = data?.content?.contents?.map((item) => ({
    ...item,
    debtor: item.name || '',
    id: item.id || '',
  })) || [];

  const ratingHistoryPage = data?.content?.page;

  const handleOpenHistory = (row: any) => {
    const queryParams = new URLSearchParams({
      debtorId: row?.id ?? '',
      module: props.module ?? '',
      process: props.process ?? '',
    }).toString();

    const nextPath = `${replacePath(
      annualReview.RATING_HISTORY,
      {
        pageModule,
        processId: String(processId),
      }
    )}?${queryParams}`;

    if (props.cantAccess) {
      router.push(setPreviewPage(nextPath, path));
    } else {
      router.push(nextPath);
    }
    closeNiceModal(MODAL_ID.HISTORY_MODAL);
  };

  const TABLE_HEADER: TableHeader[] = [
    ...HISTORY_TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => handleOpenHistory(row),
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

export default useHistoryTable;
