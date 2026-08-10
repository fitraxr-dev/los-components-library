import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';

import { roles } from '@/configs/constants/general';
import { ActivityType } from '@/enums/Activity';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

// import { useNavigationContext } from '../../context/NavigationContext';
// import { useBucketProcessSafe } from '../../hooks/useBucketProcessSafe';
import { useGetAllDropdownOptions } from '../../hooks/useGetDropdownOptions';
import useGetParameterListSubmission from '../../hooks/useGetParameterListSubmission';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useApprovalStatusModal = () => {
  const router = useRouter();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  // const { navigateToDetail } = useNavigationContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isMaker = currentRole.includes(roles.MAKER);
  const [filter, setFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const [isLoading] = useState(false);
  const { data: searchByOptions } = useGetParameterList('searchByMtcParameterVA', { label: 'value1', value: 'value2' });
  const { data: orderByOptions } = useGetParameterList('sortByMtcParameterVA', { label: 'value1', value: 'value2' });
  const { data: statusOptions } = useGetParameterList('mtcParameterStatus');
  const { bankOptions, vaTypeOptions, customerTypeOptions } = useGetAllDropdownOptions();

  // For approval status, we don't need useBucketProcessSafe since data already exists
  // const {
  //   bucketProcessId,
  //   isLoading: isBucketLoading,
  //   error: bucketError,
  //   registerWorkflowBucket,
  // } = useBucketProcessSafe();

  const DraftStatus = isMaker
    ? ['DRAFT', 'RETURN_TO_MAKER']
    : ['WAITING_APPROVAL_CHECKER'];

  const payload = {
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ? {
      columnName: filter.sortList.columnName,
      sortType: (filter.sortList.sortType as 'asc' | 'desc') || 'asc',
    } : {
      columnName: 'modifiedDate',
      sortType: 'desc',
    },
  };

  const { data, isLoading: isApiLoading } = useGetParameterListSubmission(payload);

  const tablePage = data?.data?.page;
  const tableData = data?.data?.contents?.map((item: any) => ({
    ...item,
  })) || [];

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const getNavigationConfig = (data: any) => {
    let isViewOnly = false;
    let targetStep = 'process';

    if (isMaker) {
      // IsMaker: edit mode for DRAFT and RETURN_TO_MAKER, viewOnly for others
      isViewOnly = !['DRAFT', 'RETURN_TO_MAKER'].includes(data.status);
      targetStep = 'process';
    } else {
      // IsChecker: edit mode for WAITING_TO_CHECKER (2 steppers: summary, validasi), viewOnly for others (all steppers)
      if (data.status === 'WAITING_APPROVAL_CHECKER') {
        isViewOnly = false;
        targetStep = 'summary'; // Start from summary for checker
      } else {
        isViewOnly = true;
        targetStep = 'process'; // Start from process for viewOnly
      }
    }
    return { isViewOnly, targetStep };
  };

  const handleDetailClick = async (data: any) => {
    try {
      // Record detail view activity
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: data.bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: data.code || data.id?.toString() || '',
        remarks: `View detail from Approval Status Modal: ${data.module || data.code}`,
      });

      let finalBucketProcessId = data.bucketProcessId;

      // For approval, we don't need to register workflow, just use existing bucketProcessId

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('maintenanceParameterVANavigation');

        const { isViewOnly } = getNavigationConfig(data);

        // Set navigation data directly to sessionStorage
        const navigationContextData = {
          bucketProcessId: finalBucketProcessId,
          // Include the actual status
          dataStatus: data.status,

          isDetail: isViewOnly,

          // If viewOnly, then it's detail mode
          isEdit: !isViewOnly,

          // If not viewOnly, then it's edit mode
          isViewOnly: isViewOnly,

          module: 'parameter-va',

          source: 'approval-list',
          status: data.status, // Explicitly send data.status to summary
        };

        sessionStorage.setItem('maintenanceParameterVANavigation', JSON.stringify(navigationContextData));
      }

      const { isViewOnly, targetStep } = getNavigationConfig(data);

      // Determine path based on mode (edit or detail)
      const mode = isViewOnly ? 'detail' : 'edit';
      const id = data.id || '1'; // Use actual ID, fallback to '1'
      const processId = data.bucketProcessId || 'null'; // Keep as string for URL
      const basePath = `/master-parameter/parameter-va/${id}/${processId}/${mode}`;
      const finalPath = `${basePath}/${targetStep}`;

      NiceModal.hide('APPROVAL_STATUS_MODAL_PARAMETER_VA');

      setTimeout(() => {
        router.push(finalPath);
      }, 50);
    } catch (error) {
      console.error('Error handling detail click:', error);
    }
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3vw' },
      type: 'index',
    },
    {
      key: 'bucketProcessId',
      label: 'ID Proses',
      sx: { minWidth: '7vw' },
    },
    {
      key: 'bankName',
      label: 'Bank',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'vaType',
      label: 'VA Type',
      sx: { minWidth: '7vw' },
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'currency',
      label: 'Currency',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'modifiedDate',
      label: 'Last Modified',
      sx: { minWidth: '13vw' },
      type: 'date',
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '10vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            handleDetailClick(data);
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions,
      type: 'sort',
    },
    {
      endKey: 'endModifiedDate',
      label: 'Periode Last Modified',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startModifiedDate',
      type: 'period',
    },
    {
      key: 'bankName',
      label: 'Bank',
      options: bankOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'vaType',
      label: 'VA Type',
      options: vaTypeOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      options: customerTypeOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleDetailClick,
    isLoading: isApiLoading || isLoading,
    page,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    tablePage,
  };
};
