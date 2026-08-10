import * as React from 'react';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketStatusList from '@/hooks/services/useGetBucketStatusList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

// import useGetParameterListByModule from '../../../CreatePage/hooks/useGetParameterListByModule';
// import useGetParameterSyariahProducts from '../../../CreatePage/hooks/useGetParameterSyariahProducts';
import useGetParameterSyariahSubmissionList from '../../hooks/useGetParameterSyariahSubmissionList';
import { MODAL } from '../../List.constant';

import { TABLE_HEADER } from './ApprovalStatusModal.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalStatusModal = () => {
  const router = useCustomRouter();
  const { isMaker } = useMasterParameter();
  const { recordActivity } = useRecordLog();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  const { data: searchByOptions } = useGetParameterList('searchBySubmissionParameterSyariah', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortBySubmissionParameterSyariah', { label: 'value1', value: 'value2' });
  const { data: statusOptions } = useGetParameterList('mtcParameterStatus');
  const { data: productSyariahOptions } = useGetParameterList('productSyariah');


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
      key: 'products',
      label: 'Product',
      options: productSyariahOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'statuses',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const { data: parameterSyariahSubmissionData, isFetching: isLoading } = useGetParameterSyariahSubmissionList({
    filter: {
      // module: 'PARAMETER_SYARIAH',
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  // Record activity when submission list data is loaded
  React.useEffect(() => {
    if (parameterSyariahSubmissionData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-skema-syariah',
        module: TypeModule.PARAMETER_SYARIAH,
        process: TypeProcess.PARAMETER_SYARIAH,
        remarks: 'view parameter skema syariah submission list in approval status modal',
      });
    }
  }, [parameterSyariahSubmissionData, page, pageSize, recordActivity]);

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: () => [
        {
          iconName: 'detail',
          onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data?.bucketProcessId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'parameter-skema-syariah',
              module: TypeModule.PARAMETER_SYARIAH,
              process: TypeProcess.PARAMETER_SYARIAH,
              remarks: 'view parameter skema syariah detail from approval status modal',
            });

            if (isMaker && (data?.status === 'DRAFT' || data?.status === 'RETURN_TO_MAKER')) {
              const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_EDIT_PAGE, {
                processId: data?.bucketProcessId,
              });
              router.push(`${nextPath}?tab=PROCESS`);
            } else if (!isMaker && (data?.status === 'WAITING_APPROVAL_CHECKER')) {
              const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_EDIT_PAGE, {
                processId: data?.bucketProcessId,
              });
              router.push(`${nextPath}?tab=SUMMARY`);
            } else {
              const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_SKEMA_SYARIAH_DETAIL_PAGE, {
                processId: data?.bucketProcessId,
              });
              router.push(`${nextPath}?tab=PROCESS`);
            }
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
    tableData: parameterSyariahSubmissionData?.contents,
    tableHeader,
    totalPage: parameterSyariahSubmissionData?.page?.totalPage,
  };
};

export default useApprovalStatusModal;
