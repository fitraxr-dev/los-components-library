import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, useRouter } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import useGetBusinessSummary from '../../hooks/useGetBusinessSummary';

import type { BusinessSummaryRequest } from '../../hooks/constant/getBusinessSummary';
import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useProcess = () => {
  const router = useRouter();
  const params = useParams();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = currentRole.includes(roles.MAKER);
  const isChecker = currentRole.includes(roles.CHECKER);

  // Get route params (consistent with APUPPT)
  const routeId = (params as any)?.id;
  const routeProcessId = (params as any)?.processId;
  const routeMode = (params as any)?.mode;
  const routeSubModule = (params as any)?.submodule;
  const routeCode = (params as any)?.code;
  const routeDescription = (params as any)?.description;

  // Get navigation context from sessionStorage (consistent with APUPPT)
  const [navigationContext, setNavigationContext] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('maintenanceParameterBarNavigation');
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

  // Handle processId - can be 'null' string for detail mode (consistent with APUPPT)
  const effectiveProcessId = routeProcessId === 'null' ? null : routeProcessId;

  // Record initial page view activity
  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-bar',
      module: 'parameter-mapping-bar',
      process: routeId?.toString() || '',
      remarks: `View Process Page - Mode: ${routeMode}`,
    });
  }, [routeId, routeProcessId, routeMode, recordActivity]);

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

  // Record activity for page view
  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-bar',
      module: 'parameter-bar',
      process: 'process',
      remarks: `View Parameter Mapping Bar Process - ${effectiveRouteMode} mode`,
    });
  }, [recordActivity, routeProcessId, effectiveRouteMode]);

  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);
  const [page, setPage] = useState(1);

  const formatToTitleCase = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const descriptions = routeCode ? formatToTitleCase(decodeURIComponent(routeCode)) : '';
  const businessCallSummaryLabel = `${descriptions} Summary`;

  const { data: searchByOptions } = useGetParameterList('searchByListItemParamBC', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByListItemParamBC', { label: 'value1', value: 'value2' });

  const filterDropdownList: Dropdown[] = searchByOptions ? searchByOptions.map((item: Dropdown) => ({
    ...item,
    label: item.value === 'key' ? businessCallSummaryLabel : item.label,
  })) : [];
  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ? sortByOptions.map((item: any) => ({
        ...item,
        label: item.value === 'key' ? businessCallSummaryLabel : item.label,
      })) : [],
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

  // Get business summary data (consistent with APUPPT pattern)
  const getBusinessSummaryPayload: BusinessSummaryRequest | null = React.useMemo(() => {
    if (!routeId) return null;

    // Helper untuk menentukan sortList secara dinamis
    const getSortList = () => {
      if (filter?.sortList) {
        return {
          columnName: filter.sortList.columnName,
          // Mengambil langsung dari state filter tanpa memaksanya menjadi 'asc'
          sortType: (filter.sortList.sortType as 'asc' | 'desc') || 'asc',
        };
      }
      // Default sorting jika tidak ada filter
      return {
        columnName: 'modifiedDate',
        sortType: 'desc' as const,
      };
    };

    const commonPayload = {
      filter: {
        ...filter?.filter,
        bucketProcessId: effectiveProcessId || '',
        module: decodeURIComponent(routeSubModule) || '',
      },
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: {
        key: filter?.searchDetail?.key || '',
        value: filter?.searchDetail?.value || '',
      },
      sortList: getSortList(),
    };

    // Baik detail maupun edit mode sekarang menggunakan logika yang sama untuk sortList
    if (isDetailMode || (isEditMode && effectiveProcessId)) {
      return commonPayload;
    }

    return null;
  }, [routeId, isDetailMode, isEditMode, effectiveProcessId, routeSubModule, pageSize, page, filter]);

  const {
    data: businessSummaryData,
    isLoading: businessSummaryLoading,
    error: businessSummaryError,
    refetch: refetchBusinessSummary,
  } = useGetBusinessSummary(getBusinessSummaryPayload);

  // Simple data mapping like APUPPT
  const tablePage = businessSummaryData?.data?.page || {
    itemPerPage: pageSize,
    noPage: 1,
    totalData: 0,
    totalPage: 1,
  };
  const tableData = businessSummaryData?.data?.contents?.map((item: any) => ({
    ...item,
  })) || [];

  const handleSave = () => {
    setIsLoading(true);

    // Record save activity
    recordActivity({
      activity: ActivityType.CREATE,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-bar',
      module: 'parameter-mapping-bar',
      process: routeId?.toString() || '',
      remarks: 'Save Parameter Mapping Bar Process',
    });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    // Record next navigation activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-bar',
      module: 'parameter-mapping-bar',
      process: routeId?.toString() || '',
      remarks: 'Navigate to Summary from Process',
    });

    // Navigate to summary page with route params - preserve processId (consistent with APUPPT)
    const basePath = '/master-parameter/parameter-mapping-bar/';
    if (routeId && routeProcessId && routeMode) {
      const pathParts = [routeId, routeProcessId, routeMode, routeSubModule, routeCode, routeDescription, 'summary'];
      const summaryPath = pathParts.join('/');
      router.push(basePath + summaryPath);
    } else if (routeId && routeMode) {
      const summaryPath = `${routeId}/edit/${routeSubModule}/${routeCode}/${routeDescription}/summary`;
      router.push(basePath + summaryPath);
    } else {
      router.push('/master-parameter/parameter-mapping-bar');
    }
  };

  const handleAdd = () => {
    const handleSuccess = () => {
      refetchBusinessSummary();
    };

    NiceModal.show('MODAL_ADD_BUSINESS_SUMMARY', {
      bucketProcessId: effectiveProcessId,
      code: routeCode,
      onSuccess: handleSuccess,
      subModule: decodeURIComponent(routeSubModule),
    });
  };

  const { mutate: submitBucket } = useSubmitBucket({
    onError(error) {
      // Record activity for failed submission
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: routeProcessId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-bar',
        module: 'parameter-bar',
        process: 'process',
        remarks: `Failed to submit Parameter Mapping Bar: ${error?.message || 'unknown error'}`,
      });

      showNiceModalV2({
        onClose: () => {
        },
        type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        type: 'success',
      });

      setTimeout(() => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        closeNiceModal(MODAL.GLOBAL.SUCCESS);
        router.push('/master-parameter/parameter-mapping-bar');
      }, 1000);
    },
  });

  const updateStatus = async (act: 'SUBMIT' | 'RETURN_TO_MAKER' | 'REJECT' | 'CANCELED' | 'COMPLETED') => {
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
            module: TypeModule.PARAMETER_BUSINESS_CALL,
            process: TypeProcess.PARAMETER_BUSINESS_CALL,
          };

          // Record activity before submitting
          recordActivity({
            activity: ActivityType.SUBMIT,
            bucketProcessId: routeProcessId || '',
            changeAfter: JSON.stringify(payload),
            changeBefore: '',
            menuCode: 'parameter-bar',
            module: 'parameter-bar',
            process: 'process',
            remarks: `Submitting Parameter Mapping Bar with action: ${action}`,
          });

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
  const handleEdit = (item: any) => {
    const handleSuccess = () => {
      refetchBusinessSummary();
    };

    NiceModal.show('MODAL_EDIT_BUSINESS_SUMMARY', {
      bucketProcessId: effectiveProcessId,
      code: routeCode,
      itemData: [{
        active: item.isActive ? 'Ya' : 'Tidak',
        id: item.id,
        kodeBusinessSummary: `${item.code} - ${item.label}`,
      }],
      onSuccess: handleSuccess,
      subModule: routeSubModule,
    });
  };

  const handlePageSizeChange = React.useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  const handlePageChange = React.useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClose = () => {
    // Record close activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-bar',
      module: 'parameter-mapping-bar',
      process: routeId?.toString() || '',
      remarks: 'Close Process Page',
    });

    // Clear sessionStorage and navigate back to list (consistent with APUPPT)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterBarNavigation');
    }
    router.push('/master-parameter/parameter-mapping-bar');
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3vw' },
      type: 'index',
    },
    {
      key: 'code',
      label: businessCallSummaryLabel,
      sx: { minWidth: '15vw' },
    },
    {
      key: 'label',
      label: 'Kategori',
      sx: { minWidth: '15vw' },
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

  const description = routeDescription ? decodeURIComponent(routeDescription) : '';

  return {
    businessSummaryData,
    businessSummaryError,
    businessSummaryLoading,
    description,
    effectiveProcessId,
    filter,
    filterContentList,
    filterDropdownList,
    handleAdd,
    handleCancel,
    handleClose,
    handleEdit,
    handleNext,
    handlePageChange,
    handlePageSizeChange,
    handleSave,
    isCreateMode,
    isDetailMode,
    isEditMode,
    isLoading: isLoading || businessSummaryLoading,
    isMaker,
    isViewOnly,
    page,
    pageSize,
    routeCode,
    routeId,
    routeMode,
    routeProcessId,
    routeSubModule,
    setFilter,
    setPage,
    tableData,
    tableHeader,
    tablePage,
    totalPage: tablePage?.totalPage || 1,
  };
};
