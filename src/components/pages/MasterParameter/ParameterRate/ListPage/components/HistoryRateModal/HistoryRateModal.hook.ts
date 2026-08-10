import * as React from 'react';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketStatusList from '@/hooks/services/useGetBucketStatusList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetParameterRateHistoryList from '../../hooks/useGetParameterRateHistoryList';
import { MODAL } from '../../List.constant';

import { TABLE_HEADER } from './HistoryRateModal.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useHistoryRateStatusModal = () => {
  const router = useCustomRouter();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  React.useEffect(() => {
    setPage(1);
  }, [filter]);

  const { data: searchByOptions } = useGetParameterList('searchByParameterRate');
  const { data: sortByOptions } = useGetParameterList('sortByParameterRate');
  const { data: currencyOptions } = useGetParameterList('currency');
  const { data: statusOptions } = useGetBucketStatusList({
    module: TypeModule.PARAMETER_RATE,
    process: TypeProcess.PARAMETER_RATE,
  });

  const filterDropdownList: Dropdown[] = searchByOptions;
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endLastModifiedDate',
      label: 'Last Modified',
      startKey: 'startLastModifiedDate',
      type: 'period',
    },
    {
      key: 'currency',
      label: 'Currency',
      options: currencyOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'isActive',
      label: 'Active',
      options: [
        { label: 'Ya', value: true },
        { label: 'Tidak', value: false }
      ],
      type: 'single-select',
    },
  ];

  const { data: parameterRateSubmissionData, isLoading } = useGetParameterRateHistoryList({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: () => [
        {
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_RATE_DETAIL_PAGE, {
              mode: 'submission',
              processId: data?.bucketProcessId,
            });
            router.push(nextPath);
            closeNiceModal(MODAL.HISTORY_RATE_MODAL);
          },
        },
      ],
      sx: {
        minWidth: '5vw',
      },
      type: 'action',
    }
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: parameterRateSubmissionData?.contents,
    tableHeader,
    totalPage: parameterRateSubmissionData?.page?.totalPage,
  };
};

export default useHistoryRateStatusModal;
