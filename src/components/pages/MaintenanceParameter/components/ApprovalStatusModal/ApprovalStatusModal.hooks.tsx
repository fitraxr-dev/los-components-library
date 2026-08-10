import React, { useEffect, useState, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';

import { roles } from '@/configs/constants/general';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useBucketProcessSafe } from '../../hooks/useBucketProcessSafe';
import useGetParameterSubmission from '../../hooks/useGetParameterSubmission';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useApprovalStatusModal = () => {
  const router = useCustomRouter();
  const params = useParams();
  const [user] = useApp();
  console.log('ini user', user);
  const isMaker = user.currentRole.includes(roles.MAKER);
  const isChecker = user.currentRole.includes(roles.CHECKER);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filter, setFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  const handleFilterChange = (newFilter: SearchValue) => {
    setFilter(newFilter);
  };

  const {
    bucketProcessId,
    isLoading: isBucketLoading,
    error: bucketError,
    registerWorkflowBucket,
  } = useBucketProcessSafe();

  const { data: searchByOptions } = useGetParameterList('searchBySubmissionParameter', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortBySubmissionParameter', { label: 'value1', value: 'value2' });
  const { data: statusOptions } = useGetParameterList('mtcParameterStatus');


  // Process filter data to ensure proper format
  const processedFilter = useMemo(() => {
    const baseFilter = { ...filter?.filter };
    return baseFilter;
  }, [filter]);

  const payload = {
    filter: processedFilter,
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
      sortType: 'desc' as const,
    },
  };


  const { data: submissionData, isFetching: isLoading } = useGetParameterSubmission(payload);


  dayjs.locale('id');
  const totalPage = submissionData?.data?.page?.totalPage;
  const tableData = submissionData?.data?.contents?.map((item: any) => ({
    ...item,
  })) || [];

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const getNavigationConfig = (data: any) => {
    let isViewOnly = false;
    let targetStep = 'process';
    let isBucketListDetail = false;

    // Check if this is from bucket list detail (consistent with BAR pattern)
    if (data.source === 'bucket-list' || data.isBucketListDetail) {
      isBucketListDetail = true;
      isViewOnly = true; // Always view only for bucket list detail
      targetStep = 'process'; // Only process step enabled
    } else {
      // From approval list - based on status (consistent with BAR pattern)
      if (isMaker) {
        // Maker: edit mode for DRAFT and RETURN_TO_MAKER, viewOnly for others
        isViewOnly = !['DRAFT', 'RETURN_TO_MAKER'].includes(data.status);
        targetStep = 'process';
      } else if (isChecker) {
        // Checker: edit mode for WAITING_APPROVAL_CHECKER, viewOnly for others
        const status = data.originalStatus || data.status;
        if (status === 'WAITING_APPROVAL_CHECKER') {
          isViewOnly = false; // Checker should be in edit mode
          targetStep = 'summary'; // Start from summary step for checker
        } else {
          isViewOnly = true; // View only for other statuses
          targetStep = 'process';
        }
      } else {
        // Default case for other roles
        isViewOnly = true;
        targetStep = 'process';
      }
    }

    return { isBucketListDetail, isViewOnly, targetStep };
  };

  const handleDetailClick = async (data: any) => {
    try {
      let finalBucketProcessId = data.bucketProcessId || bucketProcessId;

      if (!finalBucketProcessId && !isMaker) {
        finalBucketProcessId = await registerWorkflowBucket(parseInt(data.id));
      }

      const { isBucketListDetail, isViewOnly, targetStep } = getNavigationConfig(data);

      // Store navigation data in sessionStorage (consistent with BAR pattern)
      const navigationData = {
        ...data,
        bucketProcessId: finalBucketProcessId,
        isBucketListDetail,
        isViewOnly,
        modul: data.module,
        source: isBucketListDetail ? 'bucket-list' : 'approval-list',
        status: data.status,
        subModule: targetStep,
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('maintenanceParameterNavigation', JSON.stringify(navigationData));
      }

      // Navigate using new routing structure
      const mode = isViewOnly ? 'detail' : 'edit';
      const processId = finalBucketProcessId || 'null';
      const description = encodeURIComponent(data.description);
      const pathParts = [data.id, processId, description, data.module, mode, targetStep];
      const basePath = `/master-parameter/parameter-lov/${pathParts.join('/')}`;

      NiceModal.hide('APPROVAL_STATUS_MODAL_PARAMETER');

      setTimeout(() => {
        router.push(basePath);
      }, 50);
    } catch (error) {
      console.error('Error handling detail click:', error);
    }
  };

  const tableHeader: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
    { key: 'bucketProcessId', label: 'ID Proses', sx: { minWidth: '7vw' } },
    { key: 'description', label: 'Label', sx: { minWidth: '1vw' } },
    { key: 'modifiedBy', label: 'Modified By', sx: { minWidth: '12vw' } },
    { key: 'modifiedDate', label: 'Last Modified', sx: { minWidth: '12vw' }, type: 'date' },
    { key: 'statusLabel', label: 'Status', sx: { minWidth: '1vw' }, type: 'status' },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: handleDetailClick,
        },
      ],
      sx: { minWidth: '5vw' },
      type: 'action',
    },
  ];

  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'lastModifiedDate',
      label: 'Periode Created Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startLastModifiedDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions || [],
      type: 'multiple-autocomplete',
    },
  ];


  return {
    filter,
    filterContentList,
    filterDropdownList: searchByOptions,
    isLoading,
    page,
    setFilter: handleFilterChange,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  };
};

export default useApprovalStatusModal;
