'use client';

import { useState, useEffect } from 'react';

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

import useGetBusinessSummaryChangesList from '../../../hooks/useGetBusinessSummaryChangesList';

import { createAddNewBusinessSummaryHeader, createUpdateBusinessSummaryHeader } from './constants';


export const useCreateSummary = () => {
  const router = useCustomRouter();
  const [user] = useApp();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const isMaker = user.currentRole.includes(roles.MAKER);
  const isChecker = user.currentRole.includes(roles.CHECKER);
  const params = useParams();

  // Get id and bucketProcessId from URL params for create flow
  const id = (params as any)?.id;
  const bucketProcessId = (params as any)?.processId;

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

  // Fetch business summary changes list for ADD action (create flow)
  const {
    data: addBusinessSummaryChangesData,
    isLoading: isAddBusinessSummaryLoading,
  } = useGetBusinessSummaryChangesList(
    {
      filter: {
        action: 'ADD',
        bucketProcessId: bucketProcessId,
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
    { enabled: !!bucketProcessId }
  );

  // For create flow, we don't need UPDATE data since it's a new record
  const updateBusinessSummaryChangesData = null;
  const isUpdateBusinessSummaryLoading = false;

  // Initialize form
  const form = useForm({
    defaultValues: {},
  });

  // Extract data for tables
  const addNewBusinessSummaryData = addBusinessSummaryChangesData?.data?.contents || [];
  const updateBusinessSummaryData: any[] = []; // Empty for create flow

  // Extract pagination data
  const tablePageAdd = addBusinessSummaryChangesData?.data?.page;
  const tablePageUpdate = null; // No update data for create flow

  const handleDetailClickAdd = (data: any) => {
    // For ADD data in create flow, show single data in modal
    NiceModal.show('DETAIL_MODAL_VA', {
      data: { lastModified: data },
      isViewOnly: true,
      mode: 'add',
    });
  };

  const handleDetailClickUpdate = (data: any) => {
    // Not applicable for create flow
  };

  // Create table headers
  const addNewBusinessSummaryHeader = createAddNewBusinessSummaryHeader(handleDetailClickAdd);
  const updateBusinessSummaryHeader = createUpdateBusinessSummaryHeader(
    theme,
    handleDetailClickUpdate
  );

  const handleClose = () => {
    // Record close activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucketProcessId || null,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: 'create',
      remarks: 'Close Create Parameter VA Summary',
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
        remarks = 'Submit Create Parameter VA Summary';
        break;
      case 'APPROVE':
      case 'COMPLETED':
        activityType = ActivityType.COMPLETE;
        remarks = 'Approve Create Parameter VA Summary';
        break;
      case 'REJECT':
        activityType = ActivityType.REJECT;
        remarks = 'Reject Create Parameter VA Summary';
        break;
      case 'RETURN_TO_MAKER':
        activityType = ActivityType.EDIT;
        remarks = 'Return Create Parameter VA Summary to Maker';
        break;
      case 'CANCELED':
        activityType = ActivityType.DELETE;
        remarks = 'Cancel Create Parameter VA Summary';
        break;
    }

    recordActivity({
      activity: activityType,
      bucketProcessId: bucketProcessId || null,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: 'create',
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
            bucketProcessId: bucketProcessId,
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

  const handleNext = () => {
    // Record next navigation activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: 'create',
      remarks: 'Navigate to Validasi from Create Summary',
    });

    // Navigate to create validasi
    router.push('/master-parameter/parameter-va/create/validasi');
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

  // Check if we should redirect to create route with bucketProcessId (if we have bucketProcessId)
  useEffect(() => {
    if (bucketProcessId && id) {
      // If we have bucketProcessId, redirect to create route with bucketProcessId
      router.push(`/master-parameter/parameter-va/${id}/${bucketProcessId}/create/summary`);
    }
  }, [bucketProcessId, id, router]);

  // Record activity
  useEffect(() => {
    const finalBucketProcessId = bucketProcessId || null;

    recordActivity({
      activity: ActivityType.CREATE,
      bucketProcessId: finalBucketProcessId,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: 'create',
      remarks: 'Create Parameter VA Summary',
    });
  }, [bucketProcessId, recordActivity]);

  const viewOnly = false; // Create flow is never view-only
  const statusForm = form;

  // Check if there's data to submit
  const hasDataToSubmit = addNewBusinessSummaryData.length > 0;

  return {
    addNewBusinessSummaryData,
    addNewBusinessSummaryHeader,
    form,
    handleCancel,
    handleClose,
    handleNext,
    handleReject,
    handleReturnToMaker,
    handleSubmit,
    hasDataToSubmit,
    isChecker,
    isCreate: true, // Always true for create flow
    isDetail: false,
    isEdit: false,
    isLoading: isAddBusinessSummaryLoading,
    isMaker,
    pageAdd,
    pageSizeAdd,
    pageSizeUpdate,
    pageUpdate,
    setPageAdd,
    setPageSizeAdd,
    setPageSizeUpdate,
    setPageUpdate,
    shouldShowCloseButton: false, // Not applicable for create flow
    statusForm,
    tablePageAdd,
    tablePageUpdate,
    updateBusinessSummaryData,
    updateBusinessSummaryHeader,
    updateStatus,
    viewOnly,
  };
};
