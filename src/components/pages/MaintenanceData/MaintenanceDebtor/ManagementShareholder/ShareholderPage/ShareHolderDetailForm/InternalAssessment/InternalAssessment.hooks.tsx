import { useState } from 'react';

import { formatDateTime } from '@/helpers/date';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSessionStorage from '@/hooks/useSessionStorage';

import TextStyle from '@/components/shared/TextStyle';

import useGetInternalAssessment from './hooks/useGetInternalAssessment';

import type { internalAssessmentProps } from './InternalAssement.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useInternalAssessment = (props: internalAssessmentProps) => {
  const [filter, setFilter] = useSessionStorage('filter-component-shareholder-assessemnt', null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const { data: searchByOptions } = useGetParameterList('searchByInternalAssessment', { label: 'value1', value: 'value2' });

  const { data: sortByOptions } = useGetParameterList('sortByInternalAssessment', { label: 'value1', value: 'value2' });
  const {
    data: tableData,
    isLoading,

  } = useGetInternalAssessment({
    filter: {
      component: props.component,
      componentIdentifier: String(props?.componentIdentifier),
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: {
      key: 'collectability',
      value: '1',
    },
  }, {
    enabled: !!props?.componentIdentifier,
  });

  const tableHeaderCreditChecking: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '5vw',
      },
      type: 'index',
    },
    {
      key: 'collectability',
      label: 'Collectability',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'collectabilityStatusDate',
      label: 'Status Collectability Date',
      render: (row) => (
        <TextStyle variant="body4" textAlign="center">
          {row.statusCollectabilityDate ? formatDateTime(row.statusCollectabilityDate) : '-'}
        </TextStyle>
      ),
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
    },
    {
      key: 'modifiedDate',
      label: 'Last Modified',
      type: 'date',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Sort By',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Last Checked Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      label: 'Status Collectability Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      type: 'text',
    }
  ];

  const dataAsOf = tableData?.additionalData?.lastUpdate ? formatDateTime(tableData?.additionalData?.lastUpdate) : '-';

  return {
    dataAsOf,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    itemPerPage,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData: tableData?.contents,
    tableHeaderCreditChecking,
    totalPage: tableData?.page?.totalPage,
  };

};

export default useInternalAssessment;
