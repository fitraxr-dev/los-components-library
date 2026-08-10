import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import useGetBucketHistoryAskForInfo from '@/hooks/services/bucket/timeline/useGetBucketHistoryAskForInfo';

import { HISTORY_ASK_FOR_INFO_TABLE_HEADER, HISTORY_ASK_FOR_INFO_ITEM_STATUS } from './TableHistoryAskForInfo.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useHistoryAskForInfo = (props: SmiComponentProps) => {
  const { module, process, id } = props;
  const [itemPerPage, setItemPerPage] = useState(5);
  const [noPage, setNoPage] = useState(1);

  console.log('coba props', props);

  const {
    data: data,
    isFetching: isFetchLoading,
  } = useGetBucketHistoryAskForInfo({
    filter: {
      bucketProcessId: String(id),
      module: module,
      process: process,
      status: 'ASK_FOR_INFO',
    },
    page: {
      itemPerPage,
      noPage,
    },
  }, { enabled: !!id });

  const tableData = data?.contents.map((item) => ({
    ...item,
    comment: item.comment ?? '-',
    createdBy: item.createdBy,
    createdDate: item.createdDate,
    division: item.division,
    statusLabel: item.statusLabel,
  }));

  const tablePage = data?.page;

  const tableHeader: Array<TableHeader> = [...HISTORY_ASK_FOR_INFO_TABLE_HEADER];

  return {
    isFetchLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};
