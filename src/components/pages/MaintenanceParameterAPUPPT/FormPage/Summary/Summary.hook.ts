import React, { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material/styles';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import TextStyle from '@/components/shared/TextStyle';

import useGetSummaryGroupAdd from './hooks/useGetSummaryGroupAdd';
import useGetSummaryGroupUpdate from './hooks/useGetSummaryGroupUpdate';
import useGetSummaryItemAdd from './hooks/useGetSummaryItemAdd';
import useGetSummaryItemUpdate from './hooks/useGetSummaryItemUpdate';
import useGetSummarySubAdd from './hooks/useGetSummarySubAdd';
import useGetSummarySubUpdate from './hooks/useGetSummarySubUpdate';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const truncateText = (value, maxLength = 100) => {
  // eslint-disable-next-line eqeqeq
  const str = value == null ? '' : String(value);
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

export const useSummary = () => {
  const params = useParams();
  const router = useRouter();
  const form = useForm();
  const [{ currentRole }] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = !!currentRole?.includes?.(roles.MAKER);
  const isChecker = !!currentRole?.includes?.(roles.CHECKER);
  const [isLoading, setIsLoading] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const theme = useTheme();

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

  // Set viewOnly based on navigation context and role
  React.useEffect(() => {
    if (navigationContext) {
      // Use isViewOnly flag from context if explicitly set
      if (typeof navigationContext.isViewOnly === 'boolean') {
        setViewOnly(navigationContext.isViewOnly);
      } else {
        const status = navigationContext.status?.toUpperCase();
        if (isMaker) {
          // Maker: viewOnly for status other than DRAFT and RETURN_TO_MAKER
          setViewOnly(!['DRAFT', 'RETURN_TO_MAKER'].includes(status));
        } else if (isChecker) {
          // Checker: viewOnly for status other than WAITING_APPROVAL_CHECKER
          setViewOnly(status !== 'WAITING_APPROVAL_CHECKER');
        }
      }
    }
  }, [navigationContext, isMaker, isChecker]);

  // Record initial page view activity
  React.useEffect(() => {
    const routeId = (params as any)?.id;
    const routeProcessId = (params as any)?.processId;
    const routeMode = (params as any)?.mode;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: `View Summary Page - Mode: ${routeMode}`,
    });
  }, [params, recordActivity]);

  // Get route params
  const routeProcessId = (params as any)?.processId;

  const { data: groupAddData, isLoading: groupAddLoading } = useGetSummaryGroupAdd({
    bucketProcessId: routeProcessId || '',
  });

  // API calls for 6 summary endpoints
  const { data: groupUpdateData, isLoading: groupUpdateLoading } = useGetSummaryGroupUpdate({
    bucketProcessId: routeProcessId || '',
  });

  const { data: itemAddData, isLoading: itemAddLoading } = useGetSummaryItemAdd({
    bucketProcessId: routeProcessId || '',
  });

  const { data: itemUpdateData, isLoading: itemUpdateLoading } = useGetSummaryItemUpdate({
    bucketProcessId: routeProcessId || '',
  });

  const { data: subAddData, isLoading: subAddLoading } = useGetSummarySubAdd({
    bucketProcessId: routeProcessId || '',
  });

  const { data: subUpdateData, isLoading: subUpdateLoading } = useGetSummarySubUpdate({
    bucketProcessId: routeProcessId || '',
  });

  // Check if any data exists
  const hasGroupAddData = groupAddData?.contents && groupAddData.contents.length > 0;
  const hasGroupUpdateData = groupUpdateData?.contents && groupUpdateData.contents.length > 0;
  const hasItemUpdateData = itemUpdateData?.contents && itemUpdateData.contents.length > 0;
  const hasItemAddData = itemAddData?.contents && itemAddData.contents.length > 0;
  const hasSubUpdateData = subUpdateData?.contents && subUpdateData.contents.length > 0;
  const hasSubAddData = subAddData?.contents && subAddData.contents.length > 0;

  // Check if any data exists (for fallback table)
  const hasAnyData = hasGroupUpdateData || hasGroupAddData || hasItemUpdateData ||
    hasItemAddData || hasSubUpdateData || hasSubAddData;

  // Determine if should show Close button (for checker with non-WAITING_APPROVAL_CHECKER status)
  const shouldShowCloseButton = React.useMemo(() => {
    if (!navigationContext) return false;

    // Checker: If explicitly viewOnly, or status !== WAITING_APPROVAL_CHECKER
    if (isChecker) {
      if (typeof navigationContext.isViewOnly === 'boolean' && navigationContext.isViewOnly) {
        return true;
      }
      return navigationContext.status?.toUpperCase() !== 'WAITING_APPROVAL_CHECKER';
    }

    return false;
  }, [isChecker, navigationContext]);

  // Table data for UPDATE - will be defined after handler functions


  const summaryGroupAddHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '5vw' },
      type: 'index',
    },
    {
      key: 'noItemGroup',
      label: 'Nomor\nItem\nGroup',
      sx: { width: '5vw' },
    },
    {
      key: 'itemGroup',
      label: 'Item Group',
      render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.itemGroup ?? '-'), 35)),

      sx: { width: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { width: '5vw' },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sx: { width: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sx: { width: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data: any) => {
            handleDetailGroup(data);
          },
        },
      ],
      sx: { width: '10vw' },
      type: 'action',
    },
  ];

  // Table headers with action detail
  const summaryGroupUpdateHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '5vw' },
      type: 'index',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => {
        return React.createElement(TextStyle, {
          color: theme.palette.primary.main,
          variant: 'body4',
          weight: 600,
        }, row.status);
      },
      sx: { width: '10vw' },
    },
    {
      key: 'noItemGroup',
      label: 'Nomor\nItem\nGroup',
      sx: { width: '5vw' },
    },
    {
      key: 'itemGroup',
      label: 'Item Group',
      render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.itemGroup ?? '-'), 35)),

      sx: { width: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { width: '5vw' },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { width: '10vw' },
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sx: { width: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data: any) => {
            handleDetailGroup(data);
          },
        },
      ],
      sx: { width: '10vw' },
      type: 'action',
    },
  ];

  const summaryItemAddHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '5vw' },
      type: 'index',
    },
    {
      key: 'noItem',
      label: 'Nomor\nItem',
      sx: { width: '5vw' },
    },
    {
      key: 'item',
      label: 'Item',
      render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.item ?? '-'), 35)),

      sx: { width: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { width: '5vw' },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sx: { width: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sx: { width: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data: any) => {
            handleDetailItem(data);
          },
        },
      ],
      sx: { width: '10vw' },
      type: 'action',
    },
  ];

  const summaryItemUpdateHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '5vw' },
      type: 'index',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => {
        return React.createElement(TextStyle, {
          color: theme.palette.primary.main,
          variant: 'body4',
          weight: 600,
        }, row.status);
      },
      sx: { width: '10vw' },
    },
    {
      key: 'noItem',
      label: 'Nomor\nItem',
      sx: { width: '5vw' },
    },
    {
      key: 'item',
      label: 'Item',
      render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.item ?? '-'), 35)),

      sx: { width: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { width: '5vw' },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { width: '10vw' },
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sx: { width: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data: any) => {
            handleDetailItem(data);
          },
        },
      ],
      sx: { width: '10vw' },
      type: 'action',
    },
  ];

  const summarySubItemAddHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '5vw' },
      type: 'index',
    },
    {
      key: 'noSubItem',
      label: 'Nomor\nSub\nItem',
      sx: { width: '5vw' },
    },
    {
      key: 'subItem',
      label: 'Sub Item',
      render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.subItem ?? '-'), 35)),

      sx: { width: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { width: '5vw' },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sx: { width: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sx: { width: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data: any) => {
            handleDetailSubItem(data);
          },
        },
      ],
      sx: { width: '10vw' },
      type: 'action',
    },
  ];

  const summarySubItemUpdateHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { width: '5vw' },
      type: 'index',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => {
        return React.createElement(TextStyle, {
          color: theme.palette.primary.main,
          variant: 'body4',
          weight: 600,
        }, row.status);
      },
      sx: { width: '10vw' },
    },
    {
      key: 'noSubItem',
      label: 'Nomor\nSub\nItem',
      sx: { width: '5vw' },
    },
    {
      key: 'subItem',
      label: 'Sub Item',
      render: (row) => React.createElement(TextStyle, null, truncateText(stripHtmlTags(row?.subItem ?? '-'), 35)),

      sx: { width: '10vw' },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Ya' : 'Tidak'),
      sx: { width: '5vw' },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: { width: '10vw' },
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      sx: { width: '10vw' },
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [],
      sx: { width: '10vw' },
      type: 'action',
    },
  ];

  const handleAdd = () => {
  };

  const handleApprovalStatusModal = () => {
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const { mutate: submitBucket } = useSubmitBucket({
    onError() {
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
        router.push(MASTER_PARAMETER.PARAMETER_MAPPING_APU_PPT_LIST_PAGE);
      }, 1000);
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

          // Get form data if any
          const formValues = form.getValues();

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
    const routeId = (params as any)?.id;
    const routeProcessId = (params as any)?.processId;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Close Summary Page',
    });

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterAPUPPTNavigation');
    }
    router.push(MASTER_PARAMETER.PARAMETER_MAPPING_APU_PPT_LIST_PAGE);
  };

  const handleDetailGroup = (data: any) => {
    // Check if this is from Update table (has Previous and Last Modified rows)
    const isUpdateTable = data?.status === 'Previous' || data?.status === 'Last Modified';

    if (isUpdateTable) {
      // Find the original item from groupUpdateData that contains both previous and lastModified
      const originalItem = groupUpdateData?.contents?.find((item: any) =>
        (item.previous?.noItemGroup === data?.noItemGroup || item.lastModified?.noItemGroup === data?.noItemGroup)
      );

      if (originalItem) {
        // Send the complete API response structure to modal
        const modalData = {
          data: {
            contents: [originalItem], // Send the complete item with previous and lastModified
          },
          viewOnly: viewOnly,
        };
        console.log('Sending complete API response to modal:', modalData);
        NiceModal.show('MODAL_DETAIL_GROUP_UPDATE', modalData);
      } else {
        // Fallback to current logic if original item not found
        const detailData = data?._originalData || data;
        const modalData = {
          data: {
            isActive: detailData?.isActive,
            itemGroup: detailData?.itemGroup,
            noItemGroup: detailData?.noItemGroup,
          },
          previousData: data?.status === 'Previous' ? {
            isActive: data?.isActive,
            itemGroup: data?.itemGroup,
            noItemGroup: data?.noItemGroup,
          } : undefined,
          viewOnly: viewOnly,
        };
        console.log('Fallback data to modal:', modalData);
        NiceModal.show('MODAL_DETAIL_GROUP_UPDATE', modalData);
      }
    } else {
      // For regular data (not from update table)
      const detailData = data?._originalData || data;
      NiceModal.show('MODAL_DETAIL_GROUP', {
        data: {
          isActive: detailData?.isActive,
          itemGroup: detailData?.itemGroup,
          noItemGroup: detailData?.noItemGroup,
        },
        viewOnly: viewOnly,
      });
    }
  };

  const handleDetailItem = (data: any) => {
    // Check if this is from Update table (has Previous and Last Modified rows)
    const isUpdateTable = data?.status === 'Previous' || data?.status === 'Last Modified';

    if (isUpdateTable) {
      // Find the original item from itemUpdateData that contains both previous and lastModified
      const originalItem = itemUpdateData?.contents?.find((item: any) =>
        (item.previous?.noItem === data?.noItem || item.lastModified?.noItem === data?.noItem)
      );

      if (originalItem) {
        // Send the complete API response structure to modal
        const modalData = {
          data: {
            contents: [originalItem], // Send the complete item with previous and lastModified
          },
          viewOnly: viewOnly,
        };
        console.log('Sending complete API response to modal:', modalData);
        NiceModal.show('MODAL_DETAIL_ITEM_UPDATE', modalData);
      } else {
        // Fallback to current logic if original item not found
        const detailData = data?._originalData || data;
        NiceModal.show('MODAL_DETAIL_ITEM_UPDATE', {
          data: {
            isActive: detailData?.isActive,
            item: detailData?.item,
            nomorItem: detailData?.noItem,
            redirectToMaintenanceCustomer: detailData?.additionalAction,
          },
          previousData: data?.status === 'Previous' ? {
            isActive: data?.isActive,
            item: data?.item,
            nomorItem: data?.noItem,
            redirectToMaintenanceCustomer: data?.additionalAction,
          } : undefined,
          viewOnly: viewOnly,
        });
      }
    } else {
      // For regular data (not from update table)
      const detailData = data?._originalData || data;
      NiceModal.show('MODAL_DETAIL_ITEM', {
        data: {
          isActive: detailData?.isActive,
          item: detailData?.item,
          nomorItem: detailData?.noItem,
          redirectToMaintenanceCustomer: detailData?.additionalAction,
        },
        viewOnly: viewOnly,
      });
    }
  };

  const handleDetailSubItem = (data: any) => {
    // Check if this is from Update table (has Previous and Last Modified rows)
    const isUpdateTable = data?.status === 'Previous' || data?.status === 'Last Modified';

    if (isUpdateTable) {
      // Find the original item from subUpdateData that contains both previous and lastModified
      const originalItem = subUpdateData?.contents?.find((item: any) =>
        (item.previous?.noSubItem === data?.noSubItem || item.lastModified?.noSubItem === data?.noSubItem)
      );

      if (originalItem) {
        // Send the complete API response structure to modal
        const modalData = {
          data: {
            contents: [originalItem], // Send the complete item with previous and lastModified
          },
          viewOnly: viewOnly,
        };
        console.log('Sending complete API response to modal:', modalData);
        NiceModal.show('MODAL_DETAIL_SUB_ITEM_UPDATE', modalData);
      } else {
        // Fallback to current logic if original item not found
        const detailData = data?._originalData || data;
        NiceModal.show('MODAL_DETAIL_SUB_ITEM_UPDATE', {
          data: {
            createdBy: detailData?.createdBy,
            createdDate: detailData?.createdDate,
            isActive: detailData?.isActive,
            modifiedBy: detailData?.modifiedBy,
            modifiedDate: detailData?.modifiedDate,
            noSubItem: detailData?.noSubItem,
            subItem: detailData?.subItem,
          },
          previousData: data?.status === 'Previous' ? {
            createdBy: data?.createdBy,
            createdDate: data?.createdDate,
            isActive: data?.isActive,
            modifiedBy: data?.modifiedBy,
            modifiedDate: data?.modifiedDate,
            noSubItem: data?.noSubItem,
            subItem: data?.subItem,
          } : undefined,
          viewOnly: viewOnly,
        });
      }
    } else {
      // For regular data (not from update table)
      const detailData = data?._originalData || data;
      NiceModal.show('MODAL_DETAIL_SUB_ITEM', {
        data: {
          createdBy: detailData?.createdBy,
          createdDate: detailData?.createdDate,
          isActive: detailData?.isActive,
          modifiedBy: detailData?.modifiedBy,
          modifiedDate: detailData?.modifiedDate,
          noSubItem: detailData?.noSubItem,
          subItem: detailData?.subItem,
        },
        viewOnly: viewOnly,
      });
    }
  };

  const transformUpdateDataForLOV = (data: any[], actionHandler: (data: any) => void) => {
    const transformedData: any[] = [];
    let indexCounter = 1;

    data.forEach((item) => {
      if (item.previous) {
        transformedData.push({
          ...item.previous,
          action: { onClick: () => actionHandler(item.lastModified), rowSpan: 2, value: '' },
          index: { rowSpan: 2, value: indexCounter },
          status: 'Previous',
          statusLabel: 'Previous',
        });
      } else {
        transformedData.push({
          _originalData: item.lastModified,
          action: { onClick: () => actionHandler(item.lastModified), rowSpan: 2, value: '' },
          changeType: '-',
          fieldName: '-',
          index: { rowSpan: 2, value: indexCounter },
          newValue: '-',
          oldValue: '-',
          status: 'Previous',
          statusLabel: 'Previous',
        });
      }

      transformedData.push({
        ...item.lastModified,
        action: { rowSpan: 0, value: '' },
        index: { rowSpan: 0, value: '' },
        status: 'Last Modified',
        statusLabel: 'Last Modified',
      });

      indexCounter++;
    });

    return transformedData;
  };

  const tableDataGroupUpdate = groupUpdateData?.contents
    ? transformUpdateDataForLOV(groupUpdateData.contents, handleDetailGroup)
    : [];

  const tableDataItemUpdate = itemUpdateData?.contents
    ? transformUpdateDataForLOV(itemUpdateData.contents, handleDetailItem)
    : [];

  const tableDataSubUpdate = subUpdateData?.contents
    ? transformUpdateDataForLOV(subUpdateData.contents, handleDetailSubItem)
    : [];


  const statusForm = form;

  return {
    form,
    groupAddData: groupAddData?.contents || [],
    groupUpdateData: tableDataGroupUpdate || [],
    handleAdd,
    handleApprovalStatusModal,
    handleCancel,
    handleClose,
    handleDetailGroup,
    handleDetailItem,
    handleDetailSubItem,
    handlePageChange,
    handlePageSizeChange,
    hasAnyData,
    hasGroupAddData,
    hasGroupUpdateData,
    hasItemAddData,
    hasItemUpdateData,
    hasSubAddData,
    hasSubUpdateData,
    isLoading:
      isLoading ||
      groupUpdateLoading ||
      groupAddLoading ||
      itemUpdateLoading ||
      itemAddLoading ||
      subUpdateLoading ||
      subAddLoading,
    isMaker,
    itemAddData: itemAddData?.contents || [],
    itemUpdateData: tableDataItemUpdate || [],
    page,
    pageSize,
    shouldShowCloseButton,
    statusForm,
    subAddData: subAddData?.contents || [],
    subUpdateData: tableDataSubUpdate || [],
    summaryGroupAddHeader,
    summaryGroupUpdateHeader,
    summaryItemAddHeader,
    summaryItemUpdateHeader,
    summarySubItemAddHeader,
    summarySubItemUpdateHeader,
    updateStatus,
    viewOnly,
  };
};
