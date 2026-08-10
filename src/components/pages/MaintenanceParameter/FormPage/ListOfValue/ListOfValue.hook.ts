import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, useRouter } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import useGetParameterLOVItemList from './hooks/useGetParameterLOVItemList';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useListOfValue = () => {
  const router = useRouter();
  const params = useParams();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = currentRole.includes(roles.MAKER);
  const isChecker = currentRole.includes(roles.CHECKER);

  // Get route params (consistent with BAR pattern)
  const routeId = (params as any)?.id;
  const routeProcessId = (params as any)?.processId;
  const routeMode = (params as any)?.mode;
  const routeDescription = (params as any)?.description;
  const routeModule = (params as any)?.module;

  // Get navigation context from sessionStorage (consistent with BAR pattern)
  const [navigationContext, setNavigationContext] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('maintenanceParameterNavigation');
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

  // Handle processId - can be 'null' string for detail mode (consistent with BAR pattern)
  const effectiveProcessId = routeProcessId === 'null' ? null : routeProcessId;

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

  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  const { data: searchByOptions } = useGetParameterList('searchByListItemParamLov', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByListItemParamLov', { label: 'value1', value: 'value2' });

  const filterDropdownList: Dropdown[] = searchByOptions || [];
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      endKey: 'endCreatedDate',
      label: 'Periode Created Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startCreatedDate',
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
      endKey: 'endModifiedDate',
      label: 'Periode Modified Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startModifiedDate',
      type: 'period',
    },
  ];

  // Get LOV item list data (consistent with VA pattern)
  const {
    data: lovItemData,
    isLoading: lovItemLoading,
    error: lovItemError,
    refetch: refetchLOVItem,
  } = useGetParameterLOVItemList({
    filter: {
      ...filter?.filter,
      bucketProcessId: effectiveProcessId || '',
      module: routeModule || '',
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
  });

  // Reset page when dependencies change (consistent with VA pattern)
  useEffect(() => {
    setPage(1);
  }, [effectiveProcessId, routeModule]);

  // Simple data mapping like BAR pattern
  const tablePage = lovItemData?.page || {
    itemPerPage: pageSize,
    noPage: 1,
    totalData: 0,
    totalPage: 1,
  };
  const tableData = lovItemData?.contents?.map((item: any) => ({
    ...item,
  })) || [];

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    // Record activity for next navigation
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: effectiveProcessId,
      menuCode: 'parameter-lov',
      module: routeModule,
      process: 'parameter-lov',
      remarks: `navigate from process to summary step in parameter lov: ${routeDescription}`,
    });

    // Navigate to summary page with route params - preserve processId (consistent with BAR pattern)
    const basePath = '/master-parameter/parameter-lov/';
    if (routeId && routeProcessId && routeMode) {
      const pathParts = [routeId, routeProcessId, routeDescription, routeModule, routeMode, 'summary'];
      const summaryPath = pathParts.join('/');
      router.push(basePath + summaryPath);
    } else if (routeId && routeMode) {
      const summaryPath = `${routeId}/edit/${routeDescription}/${routeModule}/summary`;
      router.push(basePath + summaryPath);
    } else {
      router.push('/master-parameter/parameter-lov');
    }
  };

  const handleAdd = () => {
    const handleSuccess = () => {
      refetchLOVItem();
    };

    NiceModal.show('MODAL_ADD_LIST_OF_VALUE', {
      bucketProcessId: effectiveProcessId,
      module: routeModule,
      onSuccess: handleSuccess,
    });
  };

  const handleEdit = (item: any) => {
    const handleSuccess = () => {
      refetchLOVItem();
    };

    NiceModal.show('MODAL_ADD_LIST_OF_VALUE', {
      bucketProcessId: effectiveProcessId,
      editData: item,
      isEdit: true,
      module: routeModule,
      onSuccess: handleSuccess,
    });
  };

  const handlePageSizeChange = React.useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  const handleClose = () => {
    // Clear sessionStorage and navigate back to list (consistent with BAR pattern)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterNavigation');
    }
    router.push('/master-parameter/parameter-lov');
  };

  // Table header with action buttons (consistent with BAR pattern)
  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3vw' },
      type: 'index',
    },
    {
      key: 'code',
      label: 'LOV Code',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'valueName',
      label: 'Value Name',
      sx: { minWidth: '15vw' },
    },
    {
      key: 'ariumCode',
      label: 'Kode Arium',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'temenosCode',
      label: 'Kode Temenos',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Yes' : 'No'),
      sx: { minWidth: '7vw' },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sx: { minWidth: '13vw' },
      type: 'date',
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
    ...(isViewOnly || isDetailMode ? [] : [{
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          onClick: (data: any) => handleEdit(data),
        },
      ],
      type: 'action' as const,
    }]),
  ];

  return {
    effectiveProcessId,
    filter,
    filterContentList,
    filterDropdownList,
    handleAdd,
    handleClose,
    handleEdit,
    handleNext,
    handlePageSizeChange,
    handleSave,
    isCreateMode,
    isDetailMode,
    isEditMode,
    isLoading: isLoading || lovItemLoading,
    isMaker,
    isViewOnly,
    lovItemData,
    lovItemError,
    lovItemLoading,
    page,
    pageSize,
    routeDescription,
    routeId,
    routeMode,
    routeModule,
    routeProcessId,
    setFilter,
    setPage,
    tableData,
    tableHeader,
    tablePage,
    totalPage: tablePage?.totalPage || 1,
  };
};
