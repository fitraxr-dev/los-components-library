import React, { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, useRouter } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import useGetDetail from '../../hooks/useGetDetail';
import useGetParameterListByModule from '../AddGroupItem/hooks/useGetParameterListByModule';

import useGetProcessList from './hooks/useGetProcessList';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const truncateText = (value, maxLength = 100) => {
  // eslint-disable-next-line eqeqeq
  const str = value == null ? '' : String(value);
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

// Types
interface TableItem {
  id: number;
  kode: string;
  label: string;
  status: string;
  isActive: boolean;
  applicationType?: string;
  code?: string;
  noItemGroup?: number;
  itemGroup?: string;
}


const useProcess = () => {
  const router = useRouter();
  const params = useParams();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = currentRole.includes(roles.MAKER);
  const isChecker = currentRole.includes(roles.CHECKER);

  // Get route params
  const routeId = (params as any)?.id;
  const routeProcessId = (params as any)?.processId;
  const routeMode = (params as any)?.mode;

  // Get navigation context from sessionStorage
  const [navigationContext, setNavigationContext] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('maintenanceParameterAPUPPTNavigation');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNavigationContext(parsed);
        } catch (error) {
          console.error('Error parsing navigation context:', error);
        }
      }
    }
  }, []);

  // Record initial page view activity
  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || null,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: `View Process Page - Mode: ${routeMode}`,
    });
  }, [routeId, routeProcessId, routeMode, recordActivity]);

  // Handle processId - can be 'null' string for detail mode
  const effectiveProcessId = routeProcessId === 'null' ? null : routeProcessId;

  // Get detail data for form
  const { data: detailData, isLoading: detailLoading, error: detailError } = useGetDetail(
    routeId ? { bucketProcessId: effectiveProcessId, id: routeId.toString() } : null
  );


  const determineMode = () => {
    if (routeMode) return routeMode;

    // Check current URL path to determine mode
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/detail/')) return 'detail';
      if (currentPath.includes('/edit/')) return 'edit';
      if (currentPath.includes('/create/')) return 'create';
    }

    return 'detail'; // Default fallback
  };

  const effectiveRouteMode = determineMode();
  const isCreateMode = effectiveRouteMode === 'create';
  const isEditMode = effectiveRouteMode === 'edit';
  const isDetailMode = effectiveRouteMode === 'detail';
  const isViewOnly = isDetailMode;

  // Determine if should show Close button (for checker with approved status)
  const shouldShowCloseButton = React.useMemo(() => {
    if (!navigationContext) return false;

    // For checker with approved status, show Close button
    if (isChecker && isViewOnly) {
      return true;
    }
    if (isMaker && isViewOnly) {
      return true;
    }

    return false;
  }, [isChecker, isMaker, navigationContext]);

  // Pagination state
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  const { data: searchByOptions } = useGetParameterList('searchByParamApuGroupData', { label: 'value1', value: 'value2' });
  const { data: orderByOptions } = useGetParameterList('sortByParamApuGroupData', { label: 'value1', value: 'value2' });
  const { data: noItemByOptions } = useGetParameterList('listNoItemParamApu');
  const { data: applicationByOptions } = useGetParameterList('apApplicationCategory');

  const filterDropdownList: Dropdown[] = searchByOptions || [];
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions || [],
      type: 'sort',
    },
    {
      endKey: 'endLastModifiedDate',
      label: 'Last Modified',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startLastModifiedDate',
      type: 'period',
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
    {
      key: 'noItem',
      label: 'Nomor Item Group',
      options: noItemByOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'applicationType',
      label: 'Jenis Permohonan',
      options: applicationByOptions,
      type: 'multiple-autocomplete',
    },
  ];

  // Get process list data for table
  const getProcessListPayload = () => {
    if (!routeId) return null;

    // For detail mode (from bucket list): no filter needed
    if (isDetailMode) {
      const payload = {
        filter: {
          ...filter?.filter,
          bucketProcessId: effectiveProcessId,
          id: routeId,
        },
        page: {
          itemPerPage: pageSize,
          noPage: page,
        },
        searchDetail: {
          key: filter?.searchDetail?.key || '',
          value: filter?.searchDetail?.value || '',
        },
        sortList: filter?.sortList ? {
          columnName: filter.sortList.columnName,
          sortType: (filter.sortList.sortType as 'asc' | 'desc') || 'asc',
        } : undefined,
      };
      return payload;
    }

    // For edit mode: use bucketProcessId in filter
    if (isEditMode && effectiveProcessId) {
      const payload = {
        filter: {
          ...filter?.filter,
          bucketProcessId: effectiveProcessId,
          id: routeId,
        },
        page: {
          itemPerPage: pageSize,
          noPage: page,
        },
        searchDetail: {
          key: filter?.searchDetail?.key || '',
          value: filter?.searchDetail?.value || '',
        },
        sortList: filter?.sortList ? {
          columnName: filter.sortList.columnName,
          sortType: (filter.sortList.sortType as 'asc' | 'desc') || 'asc',
        } : undefined,
      };
      return payload;
    }

    return null;
  };

  const { data: processListData, isLoading: processListLoading, error: processListError } = useGetProcessList(
    getProcessListPayload(),
    {
      enabled: !!getProcessListPayload(),
    }
  );

  // Simple data mapping like parameterBar
  const tablePage = processListData?.data?.page || {};
  const tableData = processListData?.data?.contents?.map((item: any) => ({
    ...item,
  })) || [];


  const handleRedirectClick = () => {
    // Record redirect activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: effectiveProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Redirect to Parameter LOV List Page',
    });

    // Navigate to business call detail page with route params
    // if (routeId && effectiveProcessId && routeMode) {
    if (routeId && routeMode) {
      router.push(MASTER_PARAMETER.PARAMETER_LOV_LIST_PAGE);
    }
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    // Record next navigation activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || null,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Navigate to Summary from Process',
    });

    // Navigate to summary page with route params - preserve processId
    const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
    if (routeId && routeProcessId && routeMode) {
      const summaryPath = `${routeId}/${routeProcessId}/${routeMode}/summary`;
      router.push(basePath + summaryPath);
    } else if (routeId && routeMode) {
      const summaryPath = `${routeId}/edit/summary`;
      router.push(basePath + summaryPath);
    } else {
      router.push('/master-parameter/parameter-mapping-apu_ppt');
    }
  };


  const handleAdd = () => {
    // Navigate to Add Group Dokumen Diverifikasi page with route params using new modeGroup structure
    // Always use 'create' mode for adding new group
    const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
    const addGroupPath = `${routeId}/${effectiveProcessId || 'null'}/${effectiveRouteMode}/process/create/add-group`;
    router.push(basePath + addGroupPath);
  };

  const handleDetailItem = (item: TableItem) => {
    // Navigate to process page with current mode, but use detail for the add-group part
    const processId = effectiveProcessId || 'null';
    const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
    const detailPath = `${routeId}/${processId}/${routeMode}/process/detail/add-group/${item.id}`;
    router.push(basePath + detailPath);
  };

  const handleEditItem = (item: TableItem) => {
    // Navigate to process page with edit mode using new modeGroup structure
    const processId = effectiveProcessId || 'null';
    const basePath = '/master-parameter/parameter-mapping-apu_ppt/';
    const editPath = `${routeId}/${processId}/${routeMode}/process/edit/add-group/${item.id}`;
    router.push(basePath + editPath);
  };

  // Submit bucket hook
  const { mutate: submitBucket } = useSubmitBucket({
    onError: (error) => {
      showNiceModal('error', error?.message || 'Terjadi kesalahan');
    },
    onSuccess: () => {
      showNiceModal('success', 'Status berhasil diupdate');
      router.push('/master-parameter/parameter-mapping-apu_ppt');
    },
  });

  const updateStatus = async (act: 'SUBMIT' | 'RETURN_TO_MAKER' | 'REJECT' | 'CANCELED' | 'APPROVED') => {
    let action: string = act;
    if (act === 'REJECT') {
      action = 'REJECTED';
    }

    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          closeNiceModal(MODAL.GLOBAL.SUCCESS);

          const payload = {
            action,
            bucketProcessId: routeProcessId,
            comment,
            isCompleteEditAskForInfo: false,
            module: TypeModule.PARAMETER_APU_PPT,
            process: TypeProcess.PARAMETER_APU_PPT,
          };

          submitBucket({
            submitRequestDto: payload,
          });
        },
      },
    );
  };

  const handleCancel = () => {
    updateStatus('CANCELED');
  };

  const handleClose = () => {
    // Record close activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || null,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Close Process Page',
    });

    // Clear sessionStorage and navigate back to list
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterAPUPPTNavigation');
    }
    router.push('/master-parameter/parameter-mapping-apu_ppt');
  };


  // Table header with action buttons
  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { maxWidth: '5vw', minWidth: '5vw' },
      type: 'index',
    },
    {
      key: 'applicationType',
      label: 'Jenis\nPermohonan',
      sx: { maxWidth: '10vw', minWidth: '10vw' },
    },
    {
      key: 'code',
      label: 'Kode',
      sx: { maxWidth: '10vw', minWidth: '10vw' },
    },
    {
      key: 'noItemGroup',
      label: 'Nomor\nItem\nGroup',
      sx: { maxWidth: '5vw', minWidth: '5vw' },
    },
    {
      key: 'itemGroup',
      label: 'Item Group',
      render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.itemGroup ?? '-'), 35)),
      sx: { maxWidth: '10vw', minWidth: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { maxWidth: '10vw', minWidth: '10vw' },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sx: { maxWidth: '10vw', minWidth: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sx: { maxWidth: '10vw', minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { maxWidth: '10vw', minWidth: '10vw' },
    },
    {
      key: 'modifiedDate',
      label: 'Last Modified',
      sx: { maxWidth: '10vw', minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        {
          iconName: 'detail',
          onClick: (data: any) => handleDetailItem(data),
        },
        ...(routeMode !== 'detail' ? [{
          iconName: 'edit',
          onClick: (data: any) => handleEditItem(data),
        }] : []),
      ],
      sx: { maxWidth: '10vw', minWidth: '10vw' },
      type: 'action',
    },
  ];

  return {
    detailData,
    detailError,
    detailLoading,
    effectiveProcessId,
    filter,
    filterContentList,
    filterDropdownList,
    handleAdd,
    handleCancel,
    handleClose,
    handleDetailItem,
    handleEditItem,
    handleNext,
    handleRedirectClick,
    handleSave,
    isCreateMode,
    isDetailMode,
    isEditMode,
    isLoading: isLoading || detailLoading || processListLoading,
    isMaker,
    isViewOnly,
    page,
    pageSize,
    processListData,
    processListError,
    processListLoading,
    routeId,
    routeMode,
    routeProcessId,
    setFilter,
    setPage,
    setPageSize,
    shouldShowCloseButton,
    tableData,
    tableHeader,
    tablePage,
    totalPage: tablePage?.totalPage || 1,
  };
};

export default useProcess;
