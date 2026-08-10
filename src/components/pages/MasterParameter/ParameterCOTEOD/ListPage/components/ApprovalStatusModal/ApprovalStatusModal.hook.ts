import * as React from 'react';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketStatusList from '@/hooks/services/useGetBucketStatusList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetParameterCOTEODSubmissionList from '../../hooks/useGetParameterCOTEODSubmissionList';
import { MODAL } from '../../List.constant';

import { TABLE_HEADER } from './ApprovalStatusModal.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalStatusModal = () => {
  const router = useCustomRouter();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  React.useEffect(() => {
    setPage(1);
  }, [filter]);

  const { data: searchByOptions } = useGetParameterList('searchByParameterCotEodDraft');
  const { data: sortByOptions } = useGetParameterList('sortByParameterCotEodDraft');
  const { data: statusOptions } = useGetBucketStatusList({
    module: TypeModule.PARAMETER_COT_EOD,
    process: TypeProcess.PARAMETER_COT_EOD,
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
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    }
  ];

  const { data: parameterCOTEODSubmissionData, isLoading } = useGetParameterCOTEODSubmissionList({
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
            const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_COT_EOD_DETAIL_PAGE, {
              mode: `submission-${data.process.toLowerCase()}`,
              processId: data?.bucketProcessId,
            });
            router.push(nextPath);
            closeNiceModal(MODAL.APPROVAL_STATUS_MODAL);
          },
        },
      ],
      sx: {
        minWidth: '10vw',
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
    tableData: parameterCOTEODSubmissionData?.contents,
    tableHeader,
    totalPage: parameterCOTEODSubmissionData?.page?.totalPage,
  };
};

export default useApprovalStatusModal;
