import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useRouter } from 'next/navigation';

import { roles } from '@/configs/constants/general';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';

import useGetApprovalStatusList from '../hooks/useGetApprovalStatusList';

import { DEFAULT_PAGE_SIZE } from './ApprovalStatus.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useApprovalStatusModal = () => {
  const router = useRouter();
  const [{ currentRole }] = useApp();
  const isMaker = currentRole.includes(roles.MAKER);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [filter, setFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  // API call for approval status list
  const payload = {
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage,
      noPage,
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

  const { data: approvalData, isFetching: isLoading, error } = useGetApprovalStatusList(payload);

  const tablePage = approvalData?.data?.page;
  const tableData = approvalData?.data?.contents?.map((item: any) => ({
    ...item,
  })) || [];

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const { data: searchByOptions } = useGetParameterList('searchByListApprovalApuBudd', { label: 'value1', value: 'value2' });
  const { data: orderByOptions } = useGetParameterList('sortByListApprovalApuBudd', { label: 'value1', value: 'value2' });
  const { data: statusOptions } = useGetParameterList('mtcParameterStatus');

  const getNavigationConfig = (data: any) => {
    let isViewOnly = false;
    let targetStep = 'process';

    if (isMaker) {
      // IsMaker: edit mode for DRAFT and RETURN_TO_MAKER, viewOnly for others
      isViewOnly = !['DRAFT', 'RETURN_TO_MAKER'].includes(data.status?.toUpperCase());
      targetStep = 'process';
    } else {
      // IsChecker: edit mode for WAITING_TO_CHECKER (2 steppers: summary, validasi), viewOnly for others (all steppers)
      if (data.status?.toUpperCase() === 'WAITING_APPROVAL_CHECKER') {
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
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('maintenanceParameterAPUPPTNavigation');

        const { isViewOnly } = getNavigationConfig(data);

        // Set navigation data directly to sessionStorage
        const navigationContextData = {
          bucketProcessId: data.bucketProcessId,
          isDetail: isViewOnly, // If viewOnly, then it's detail mode
          isEdit: !isViewOnly, // If not viewOnly, then it's edit mode
          isViewOnly: isViewOnly,
          module: 'parameter-mapping-apu-ppt',
          source: 'approval-list',
          status: data.status, // Include the actual status
        };

        sessionStorage.setItem('maintenanceParameterAPUPPTNavigation', JSON.stringify(navigationContextData));
      }

      const { isViewOnly, targetStep } = getNavigationConfig(data);

      // Determine path based on mode (edit or detail)
      const mode = isViewOnly ? 'detail' : 'edit';
      const id = data.id || '1'; // Use actual ID, fallback to '1'
      const processId = data.bucketProcessId || 'null'; // Keep as string for URL
      const basePath = `/master-parameter/parameter-mapping-apu_ppt/${id}/${processId}/${mode}`;
      const finalPath = `${basePath}/${targetStep}`;

      NiceModal.hide('APPROVAL_STATUS_MODAL_PARAMETER_APU_PPT');

      setTimeout(() => {
        router.push(finalPath);
      }, 50);
    } catch (error) {
      console.error('Error handling detail click:', error);
    }
  };

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions,
      type: 'sort',
    },
    {
      endKey: 'endLastModifiedDate',
      label: 'Periode Last Modified',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startLastModifiedDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '5vw' },
      type: 'index',
    },
    {
      key: 'bucketProcessId',
      label: 'ID Proses',
      sx: { width: '10vw' },
    },
    {
      key: 'groupName',
      label: 'Group Name',
      sx: { width: '10vw' },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { width: '10vw' },
    },
    {
      key: 'modifiedDate',
      label: 'Last Modified',
      sx: { width: '10vw' },
      type: 'date',
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { width: '10vw' },
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
      sx: { width: '10vw' },
      type: 'action',
    },
  ];

  return {
    error,
    filter,
    filterContentList,
    filterDropdownList,
    handleDetailClick,
    isLoading,
    itemPerPage,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};
