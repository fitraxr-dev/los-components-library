'use client';

import { useState, useEffect, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useGetBusinessSummaryChangesList from '../../hooks/useGetBusinessSummaryChangesList';

import { createAddNewBusinessSummaryHeader, createUpdateBusinessSummaryHeader } from './constants';


export const useSummary = () => {
  const router = useCustomRouter();
  const [user] = useApp();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMaker = user.currentRole.includes(roles.MAKER);
  const isChecker = user.currentRole.includes(roles.CHECKER);
  const params = useParams();

  // Get id, bucketProcessId and mode from URL params
  const id = (params as any)?.id;
  const bucketProcessId = (params as any)?.processId;
  const routeMode = (params as any)?.mode;

  // Handle special case: bucketProcessId can be 'null' string for detail mode from bucket list
  const actualBucketProcessId = bucketProcessId === 'null' ? null : bucketProcessId;

  // Determine mode based on routeMode
  const isDetail = routeMode === 'detail';
  const isEdit = routeMode === 'edit';
  const isCreate = routeMode === 'create';


  // Submit bucket functionality
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
        router.push('/master-parameter/parameter-va');
      }, 1000);
    },
  });

  // Pagination states
  const [pageAdd, setPageAdd] = useState(1);
  const [pageSizeAdd, setPageSizeAdd] = useState(10);
  const [pageUpdate, setPageUpdate] = useState(1);
  const [pageSizeUpdate, setPageSizeUpdate] = useState(10);

  // Fetch business summary changes list for ADD action
  const {
    data: addBusinessSummaryChangesData,
    isLoading: isAddBusinessSummaryLoading,
  } = useGetBusinessSummaryChangesList(
    {
      filter: {
        action: 'ADD',
        bucketProcessId: actualBucketProcessId || '',
      },
      page: {
        itemPerPage: pageSizeAdd,
        noPage: pageAdd,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    },
    { enabled: !!actualBucketProcessId || isDetail }
  );

  // Fetch business summary changes list for UPDATE action
  const {
    data: updateBusinessSummaryChangesData,
    isLoading: isUpdateBusinessSummaryLoading,
  } = useGetBusinessSummaryChangesList(
    {
      filter: {
        action: 'UPDATE',
        bucketProcessId: actualBucketProcessId || '',
      },
      page: {
        itemPerPage: pageSizeUpdate,
        noPage: pageUpdate,
      },
      searchDetail: {
        key: '',
        value: '',
      },
    },
    { enabled: !!actualBucketProcessId || isDetail }
  );


  // Initialize form
  const form = useForm({
    defaultValues: {},
  });

  // Transform data for UPDATE to show both old and new data
  const transformUpdateDataForVA = (data: any[]) => {
    const transformedData: any[] = [];
    let indexCounter = 1;

    data.forEach((item) => {
      if (item.oldData) {
        // If there's old data, show both Previous and Last Modified rows
        transformedData.push({
          ...item.oldData,
          action: { rowSpan: 2, value: indexCounter },
          createdDate: item.oldData.createdDate || '-',
          // Handle null/empty createdDate
          index: { rowSpan: 2, value: indexCounter },
          status: 'Previous',
          statusLabel: 'Previous',
        });
      } else {
        // If no old data, show Previous row with empty/dash data
        transformedData.push({
          action: { rowSpan: 2, value: indexCounter },
          bankName: '-',
          createdBy: '-',
          createdDate: '-',
          currency: '-',
          customerType: '-',
          // Use '-' for null/empty date values
          index: { rowSpan: 2, value: indexCounter },
          isActive: '-',
          status: 'Previous',
          statusLabel: 'Previous',
          vaType: '-',
        });
      }

      // Always show Last Modified row
      transformedData.push({
        ...item,
        action: { rowSpan: 0, value: '' },
        createdDate: item.createdDate || '-',
        // Handle null/empty createdDate
        index: { rowSpan: 0, value: '' },
        status: 'Last Modified',
        statusLabel: 'Last Modified',
      });

      indexCounter++;
    });

    return transformedData;
  };

  // Extract data for tables
  const addNewBusinessSummaryData = addBusinessSummaryChangesData?.data?.contents || [];
  const updateBusinessSummaryData = updateBusinessSummaryChangesData?.data?.contents
    ? transformUpdateDataForVA(updateBusinessSummaryChangesData.data.contents)
    : [];

  // Extract pagination data
  const tablePageAdd = addBusinessSummaryChangesData?.data?.page;
  const tablePageUpdate = updateBusinessSummaryChangesData?.data?.page;


  const handleDetailClickAdd = (data: any) => {
    // For ADD data, show single data in modal
    NiceModal.show('DETAIL_MODAL_VA', {
      data: { lastModified: data },
      isViewOnly: true,
      mode: 'add',
    });
  };

  const handleDetailClickUpdate = (data: any) => {

    // Since the clicked data is from transformed data, we need to find the original data differently
    // The transformed data has index.value which corresponds to the position in the original array
    const indexValue = data.index?.value;

    if (indexValue && updateBusinessSummaryChangesData?.data?.contents) {
      // Find original data by index (indexValue is 1-based, so subtract 1)
      const originalData = updateBusinessSummaryChangesData.data.contents[indexValue - 1];


      if (originalData) {
        // Prepare data for modal with both Previous and Last Modified
        const modalData = {
          // Last Modified data (original from API)
          hasOldData: !!originalData.oldData,
          // Previous data (null if no old data)
          lastModified: originalData,
          previous: originalData.oldData || null, // Flag to indicate if there's old data
        };


        // Show modal with both old and new data for comparison
        NiceModal.show('DETAIL_MODAL_VA', {
          data: modalData,
          isViewOnly: true,
          mode: 'update',
        });
        return;
      }
    }

    // Fallback: try to find by ID if available
    const originalDataById = updateBusinessSummaryChangesData?.data?.contents?.find((item: any) => {
      return (item.oldData && item.oldData.id === data.id) || item.id === data.id;
    });

    if (originalDataById) {
      const modalData = {
        hasOldData: !!originalDataById.oldData,
        lastModified: originalDataById,
        previous: originalDataById.oldData || null,
      };


      NiceModal.show('DETAIL_MODAL_VA', {
        data: modalData,
        isViewOnly: true,
        mode: 'update',
      });
    } else {
      // Final fallback to showing just the clicked data
      NiceModal.show('DETAIL_MODAL_VA', {
        data: { lastModified: data },
        isViewOnly: true,
        mode: 'add',
      });
    }
  };

  // Create table headers
  const addNewBusinessSummaryHeader = createAddNewBusinessSummaryHeader(handleDetailClickAdd);

  const updateBusinessSummaryHeader = createUpdateBusinessSummaryHeader(
    theme,
    handleDetailClickUpdate
  );

  const handleNext = () => {
    // Record next navigation activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: actualBucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: id?.toString() || '',
      remarks: 'Navigate to Validasi from Summary',
    });

    if (isCreate) {
      // For create mode, navigate to validasi using the ID or bucketProcessId
      router.push(`/master-parameter/parameter-va/${id || bucketProcessId}/create/validasi`);
    } else {
      // For detail and edit modes, navigate to validasi using bucketProcessId
      const validasiPath = `/master-parameter/parameter-va/${id}/${bucketProcessId}/validasi`;
      router.push(validasiPath);
    }
  };

  const handleClose = () => {
    // Record close activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: actualBucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: id?.toString() || '',
      remarks: 'Close Parameter VA Summary',
    });

    router.push('/master-parameter/parameter-va');
  };

  const updateStatus = async (act: 'SUBMIT' | 'RETURN_TO_MAKER' | 'REJECT' | 'CANCELED' | 'COMPLETED' | 'APPROVE') => {
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
        remarks = 'Submit Parameter VA Summary';
        break;
      case 'APPROVE':
      case 'COMPLETED':
        activityType = ActivityType.COMPLETE;
        remarks = 'Approve Parameter VA Summary';
        break;
      case 'REJECT':
        activityType = ActivityType.REJECT;
        remarks = 'Reject Parameter VA Summary';
        break;
      case 'RETURN_TO_MAKER':
        activityType = ActivityType.EDIT;
        remarks = 'Return Parameter VA Summary to Maker';
        break;
      case 'CANCELED':
        activityType = ActivityType.DELETE;
        remarks = 'Cancel Parameter VA Summary';
        break;
    }

    recordActivity({
      activity: activityType,
      bucketProcessId: actualBucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: id?.toString() || '',
      remarks: remarks,
    });

    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          closeNiceModal(MODAL.GLOBAL.SUCCESS);

          const payload = {
            action,
            bucketProcessId: actualBucketProcessId || '',
            comment,
            isCompleteEditAskForInfo: false,
            module: TypeModule.PARAMETER_VA,
            process: TypeProcess.PARAMETER_VA,
          };

          submitBucket({
            submitRequestDto: payload,
          });
        },
      },
    );
  };

  const handleSubmit = () => {
    updateStatus('SUBMIT');
  };

  const handleReturnToMaker = () => {
    updateStatus('RETURN_TO_MAKER');
  };

  const handleReject = () => {
    updateStatus('REJECT');
  };

  const handleCancel = () => {
    updateStatus('CANCELED');
  };

  // Record activity
  useEffect(() => {
    const finalBucketProcessId = bucketProcessId || '';

    if (isCreate) {
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: finalBucketProcessId,
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: 'summary',
        remarks: 'Create Parameter VA Summary',
      });
    } else if (isEdit) {
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: finalBucketProcessId,
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: id?.toString() || '',
        remarks: `Edit Parameter VA Summary - ID: ${id}`,
      });
    } else if (isDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: finalBucketProcessId,
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: id?.toString() || '',
        remarks: `View Parameter VA Summary - ID: ${id}`,
      });
    }
  }, [isCreate, isEdit, isDetail, id, bucketProcessId, recordActivity]);

  // Check if submit button should be enabled (for edit and create modes with data)
  const canSubmit = (isEdit || isCreate) &&
    (addNewBusinessSummaryData.length > 0 || updateBusinessSummaryData.length > 0);

  // Get navigation context from sessionStorage
  const [navigationContext, setNavigationContext] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('maintenanceParameterVANavigation');
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

  // Determine if should show Close button based on approval list detail conditions
  const shouldShowCloseButton = useMemo(() => {
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

  const viewOnly = isDetail;
  const statusForm = form;

  // Check if there's data to submit (for disable action logic)
  const hasDataToSubmit = addNewBusinessSummaryData.length > 0 || updateBusinessSummaryData.length > 0;

  return {
    addNewBusinessSummaryData,
    addNewBusinessSummaryHeader,
    canSubmit,
    form,
    handleCancel,
    handleClose,
    handleNext,
    handleReject,
    handleReturnToMaker,
    handleSubmit,
    hasDataToSubmit,
    isChecker,
    isCreate,
    isDetail,
    isEdit,
    isLoading: isAddBusinessSummaryLoading || isUpdateBusinessSummaryLoading,
    isMaker,
    pageAdd,
    pageSizeAdd,
    pageSizeUpdate,
    pageUpdate,
    setPageAdd,
    setPageSizeAdd,
    setPageSizeUpdate,
    setPageUpdate,
    shouldShowCloseButton,
    statusForm,
    tablePageAdd,
    tablePageUpdate,
    updateBusinessSummaryData,
    updateBusinessSummaryHeader,
    updateStatus,
    viewOnly,
  };
};
