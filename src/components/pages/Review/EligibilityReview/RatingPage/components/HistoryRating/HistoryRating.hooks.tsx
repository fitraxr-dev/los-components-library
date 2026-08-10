import { useState } from 'react';

import { useParams, usePathname } from 'next/navigation';


import { eligibilityReview } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import useGetDebtorHistory from '../../../RatingHistory/hooks/useGetDebtorHistory';
import { MODAL_ID } from '../../Rating.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useHistoryRating = (props: any) => {
  const [filter, setFilter] = useSessionStorage('filter-component-rating-history-modal', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { processId } = useParams();
  const path = usePathname();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const router = useCustomRouter();
  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: props.module,
    process: props.process,
  }, {
    enabled: !processId?.includes('DEBT'),
  });

  const { data: debtorDataMaster } = useGetDetailMasterDebtor({
    debtorId: String(processId),
  }, {
    enabled: processId?.includes('DEBT'),
  });
  // --- PARAMETER ---
  const { data: searchByOptions } = useGetParameterList('searchByHistoryDEPIDebtorName', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---
  const debtorName = debtorInfoData?.debtorName || debtorDataMaster?.name;
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
      cantAccess: props.cantAccess || false,
      debtorId: row?.id || null,
    }).toString();

    const nextPath = `${replacePath(
      eligibilityReview.RATING_HISTORY,
      {
        module: !!props.cantAccess ? 'bucket-list' : moduleIndex,
        processId: processId,
      }
    )}?${queryParams}`;
    if (!!props.cantAccess) {
      router.push(setPreviewPage(nextPath, path));
    } else {
      router.push(nextPath);
    }
    closeNiceModal(MODAL_ID.HISTORY_MODAL);
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
          iconName: 'detail', onClick: (row) => {
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
