import { useMemo, useState } from 'react';

import { formatDateToUtc } from '@/helpers/date';

import useGetBmppMonitoringSummary from './hooks/useGetBmppMonitoringSummary';

import type { TabSummaryProps } from './TabSummary.types';


const useTabSummary = (props: TabSummaryProps) => {
  const { processId } = props;
  const [noPage, setNoPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: individualBmppSummary, isLoading } = useGetBmppMonitoringSummary({
    filter: {
      bucketProcessId: processId,
    },
    page: {
      itemPerPage: pageSize,
      noPage: noPage,
    },
  });

  const bmppSummaryListData = individualBmppSummary?.contents;
  const tableData = bmppSummaryListData?.map((item) => ({
    conclusion: item.conclusion ?? '-',
    groupName: item.groupName ?? '-',
    leewayDebtorGroup: item.leewayDebtorGroup ?? '-',
    percentage: item.percentage ?? '-',
  }));
  const tablePage = individualBmppSummary?.page;
  const lastUpdateDate = individualBmppSummary?.additionalData?.lastModified ||
    individualBmppSummary?.additionalData?.lastUpdate;

  const dataAsOfDate = useMemo(() => {
    return lastUpdateDate ?
      `${formatDateToUtc(new Date(lastUpdateDate), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [lastUpdateDate]);

  return {
    dataAsOfDate,
    isLoading,
    noPage,
    setNoPage,
    setPageSize,
    tableData,
    tablePage,
  };
};

export default useTabSummary;
