'use client';

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

import useGetBusinessSummaryChangesList from '../../hooks/useGetBusinessSummaryChangesList';


import { ADD_NEW_BUSINESS_SUMMARY_HEADER, createUpdateBusinessSummaryHeader } from './constants';


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
  const theme = useTheme();

  const [pageAdd, setPageAdd] = useState(1);
  const [pageSizeAdd, setPageSizeAdd] = useState(10);

  const [pageUpdate, setPageUpdate] = useState(1);
  const [pageSizeUpdate, setPageSizeUpdate] = useState(10);

  // Get route params
  const routeId = (params as any)?.id;
  const routeProcessId = (params as any)?.processId;
  const routeSubModule = (params as any)?.submodule;
  const routeMode = (params as any)?.mode;

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
      remarks: `View Summary Page - Mode: ${routeMode}`,
    });
  }, [routeId, routeProcessId, routeMode, recordActivity]);

  // Record activity for page view
  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-bar',
      module: 'parameter-bar',
      process: 'summary',
      remarks: 'View Parameter Mapping Bar Summary',
    });
  }, [recordActivity, routeProcessId]);

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
        process: 'summary',
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


  // Get navigation context from sessionStorage
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

  const {
    data: addBusinessSummaryChangesListData,
    isLoading: isAddBusinessSummaryLoading,
  } = useGetBusinessSummaryChangesList({
    filter: {
      action: 'ADD',
      bucketProcessId: routeProcessId || '',
      module: decodeURIComponent(routeSubModule) || '',
    },
    page: {
      itemPerPage: pageSizeAdd,
      noPage: pageAdd,
    },
  });

  const {
    data: updateBusinessSummaryChangesListData,
    isLoading: isUpdateBusinessSummaryLoading,
  } = useGetBusinessSummaryChangesList({
    filter: {
      action: 'UPDATE',
      bucketProcessId: routeProcessId || '',
      module: decodeURIComponent(routeSubModule) || '',
    },
    page: {
      itemPerPage: pageSizeUpdate,
      noPage: pageUpdate,
    },
  });

  const tablePageAdd = addBusinessSummaryChangesListData?.data?.page;
  const tableDataAdd = addBusinessSummaryChangesListData?.data?.contents || [];

  const tablePageUpdate = updateBusinessSummaryChangesListData?.data?.page;

  const transformUpdateDataForMaintenanceBar = (data: any[]) => {
    const transformedData: any[] = [];
    let indexCounter = 1;

    data.forEach((item) => {
      if (item.oldData) {
        transformedData.push({
          ...item.oldData,
          index: { rowSpan: 2, value: indexCounter },
          status: 'Previous',
          statusLabel: 'Previous',
        });
      }

      transformedData.push({
        ...item,
        index: { rowSpan: 0, value: '' },
        status: 'Last Modified',
        statusLabel: 'Last Modified',
      });

      indexCounter++;
    });

    return transformedData;
  };

  const tableDataUpdate = updateBusinessSummaryChangesListData?.data?.contents
    ? transformUpdateDataForMaintenanceBar(updateBusinessSummaryChangesListData.data.contents)
    : [];


  const updateStatus = async (act: 'SUBMIT' | 'RETURN_TO_MAKER' | 'REJECT' | 'CANCELED' | 'COMPLETED') => {
    let action: string = act;
    if (act === 'REJECT') {
      action = 'REJECTED';
    }

    // Record activity based on action
    let activityType = ActivityType.VIEW;
    let remarks = '';

    switch (act) {
      case 'SUBMIT':
        activityType = ActivityType.SUBMIT;
        remarks = 'Submit Parameter Mapping Bar Summary';
        break;
      case 'COMPLETED':
        activityType = ActivityType.APPROVE;
        remarks = 'Approve Parameter Mapping Bar Summary';
        break;
      case 'REJECT':
        activityType = ActivityType.REJECT;
        remarks = 'Reject Parameter Mapping Bar Summary';
        break;
      case 'RETURN_TO_MAKER':
        activityType = ActivityType.RETURN_TO_MAKER;
        remarks = 'Return to Maker Parameter Mapping Bar Summary';
        break;
      case 'CANCELED':
        activityType = ActivityType.CANCEL;
        remarks = 'Cancel Parameter Mapping Bar Summary';
        break;
      default:
        activityType = ActivityType.VIEW;
        remarks = `Update Status Parameter Mapping Bar Summary: ${act}`;
    }

    recordActivity({
      activity: activityType,
      bucketProcessId: routeProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-bar',
      module: 'parameter-mapping-bar',
      process: routeId?.toString() || '',
      remarks,
    });

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
            process: 'summary',
            remarks: `Submitting Parameter Mapping Bar with action: ${action}`,
          });

          submitBucket({
            submitRequestDto: payload,
          });
        },
      },
    );
  };


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
      remarks: 'Close Summary Page',
    });

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterBarNavigation');
    }
    router.push('/master-parameter/parameter-mapping-bar');
  };

  const handleCancel = () => {
    updateStatus('CANCELED');
  };

  // Determine if should show Close button based on approval list detail conditions
  const shouldShowCloseButton = React.useMemo(() => {
    if (!navigationContext) return false;

    // If coming from approval list and in detail mode
    if (navigationContext.source === 'approval-list' && navigationContext.isViewOnly) {
      // For Maker: if status is NOT 'DRAFT' and NOT 'RETURN_TO_MAKER', show Close button only
      if (isMaker && navigationContext.status !== 'DRAFT' && navigationContext.status !== 'RETURN_TO_MAKER') {
        return true;
      }

      // For Checker: if status is NOT 'WAITING_APPROVAL_CHECKER', show Close button only
      if (isChecker && navigationContext.status !== 'WAITING_APPROVAL_CHECKER') {
        return true;
      }
    }

    return false;
  }, [isChecker, isMaker, navigationContext]);

  const statusForm = form;
  const hasDataToSubmit = tableDataAdd?.length > 0 || tableDataUpdate?.length > 0;
  return {
    addNewBusinessSummaryHeader: ADD_NEW_BUSINESS_SUMMARY_HEADER,
    bucketProcessId: routeProcessId || '',
    form,
    handleCancel,
    handleClose,
    hasDataToSubmit,
    isLoading: isAddBusinessSummaryLoading || isUpdateBusinessSummaryLoading,
    isMaker,
    pageAdd,
    pageUpdate,
    setPageAdd,
    setPageSizeAdd,
    setPageSizeUpdate,
    setPageUpdate,
    shouldShowCloseButton,
    statusForm,
    tableDataAdd,
    tableDataUpdate,
    tablePageAdd,
    tablePageUpdate,
    updateBusinessSummaryHeader: createUpdateBusinessSummaryHeader(theme),
    updateStatus,
    viewOnly,
  };
};
