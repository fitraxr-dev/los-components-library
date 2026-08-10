import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterSLAList from './hooks/useGetParameterSLAList';
import { MODAL, TABLE_HEADER } from './List.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const { isMaker } = useMasterParameter();
  const router = useCustomRouter();

  const [page, setPage] = React.useState(1);
  const [filter, setFilter] = React.useState<SearchValue>(null);
  const [pageSize, setPageSize] = React.useState(10);

  React.useEffect(() => {
    setPage(1);
  }, [filter, pageSize]);

  const { data: searchByOptions } = useGetParameterList('searchByParameterSLA');
  const { data: sortByOptions } = useGetParameterList('sortByParameterSLA');

  const filterDropdownList: Dropdown[] = searchByOptions;
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'slaBusinessTo',
      label: 'SLA Bisnis',
      placeholder1: 'From',
      placeholder2: 'To',
      startKey: 'slaBusinessFrom',
      type: 'textPeriod',
    },
    {
      endKey: 'slaNonBusinessTo',
      label: 'SLA Non-bisnis',
      placeholder1: 'From',
      placeholder2: 'To',
      startKey: 'slaNonBusinessFrom',
      type: 'textPeriod',
    },
    {
      endKey: 'slaSummaryTo',
      label: 'SLA Summary',
      placeholder1: 'From',
      placeholder2: 'To',
      startKey: 'slaSummaryFrom',
      type: 'textPeriod',
    },
  ];

  const { data: parameterSLAData, isLoading } = useGetParameterSLAList({
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
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SLA_DETAIL_PAGE, {
              mode: 'detail',
              processId: data?.module,
            });
            router.push(nextPath);
          },
        },
        ...(isMaker && data.isEditable ? [{
          iconName: 'edit',
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
                const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SLA_DETAIL_PAGE, {
                  mode: 'edit',
                  processId: data?.module,
                });
                router.push(nextPath);
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin mengedit data ini?',
              type: 'warning',
            });
          },
        }] : []),
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  const handleOpenApprovalStatusModal = () => {
    NiceModal.show(MODAL.APPROVAL_STATUS_MODAL);
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenApprovalStatusModal,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: parameterSLAData?.contents,
    tableHeader,
    totalPage: parameterSLAData?.page?.totalPage,
  };
};

export default useList;
