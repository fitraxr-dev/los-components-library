'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useGetProcessDetail from '../../hooks/useGetProcessDetail';
import useSaveParameterVA from '../../hooks/useSaveParameterVA';


const schema = yup.object({
  active: yup.boolean().required('Active status is required'),
  bank: yup.string().required('Bank is required'),
  currency: yup.string().required('Currency is required'),
  customerType: yup.string().required('Customer Type is required'),
  digitVaType: yup.string().required('Digit VA Type is required'),
  prefixBank: yup.string().required('Prefix Bank is required'),
  totalDigit: yup.string().required('Total Digit is required'),
  vaType: yup.string().required('VA Type is required'),
});

type FormData = yup.InferType<typeof schema>;

export const useProcess = () => {
  const router = useCustomRouter();
  const [user] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = user.currentRole.includes(roles.MAKER);
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);

  // Get id, processId (bucketProcessId), and mode from URL params
  const id = (params as any)?.id;
  const bucketProcessId = (params as any)?.processId; // This is the bucketProcessId from URL
  const routeMode = (params as any)?.mode;

  // Determine mode based on routeMode
  const isDetail = routeMode === 'detail';
  const isEdit = routeMode === 'edit';
  const isCreate = routeMode === 'create';

  const saveParameterVAMutation = useSaveParameterVA();

  // Fetch dropdown options

  const { data: bankData, isLoading: bankLoading } = useGetParameterList('accountBankVA', { label: 'value1', value: 'value1' });
  const { data: customerTypeData, isLoading: customerTypeLoading } = useGetParameterList('customerType', { label: 'value1', value: 'value1' });
  const { data: currencyData, isLoading: currencyLoading } = useGetParameterList('currency', { label: 'value1', value: 'value1' });
  const { data: vaTypeData, isLoading: vaTypeLoading } = useGetParameterList('vaType', { label: 'value1', value: 'value1' });
  // Transform bank data to match Autocomplete structure
  const bankOptions = bankData?.map((item, index) => ({
    id: item.value || index.toString(),
    label: item.label,
  })) || [];

  // Transform vaType and customerType options to match Autocomplete structure
  const vaTypeOptions = vaTypeData?.map((item) => ({
    id: item.value,
    label: item.label,
  })) || [];

  const customerTypeOptions = customerTypeData?.map((item) => ({
    id: item.value,
    label: item.label,
  })) || [];

  const currencyOptions = currencyData?.map((item) => ({
    id: item.value,
    label: item.label,
  })) || [];

  // Check if this is from bucket list detail (don't send bucketProcessId)
  const [isFromBucketListDetail, setIsFromBucketListDetail] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('maintenanceParameterVANavigation');
        if (stored) {
          const parsed = JSON.parse(stored);
          setIsFromBucketListDetail(parsed.source === 'bucket-list' && parsed.isViewOnly);
        }
      } catch (error) {
        console.warn('Failed to parse navigation data:', error);
      }
    }
  }, []);

  // Fetch process detail for edit, detail, and create modes
  // For detail mode from bucket list, don't send bucketProcessId
  const { data: processDetail, isLoading: processDetailLoading } = useGetProcessDetail(
    id,
    isFromBucketListDetail ? null : (bucketProcessId === 'null' ? null : bucketProcessId), // Don't send bucketProcessId for bucket list detail
    { enabled: !!id && (!!bucketProcessId || isDetail) } // Enable for detail mode even without bucketProcessId
  );

  // Initialize form
  const form = useForm<FormData>({
    defaultValues: {
      active: false,
      bank: '',
      currency: '',
      customerType: '',
      digitVaType: '',
      prefixBank: '',
      totalDigit: '',
      vaType: '',
    },
    resolver: yupResolver(schema),
  });

  // Reset form when process detail is loaded (for edit, detail, and create modes)
  useEffect(() => {
    if (processDetail?.data) {
      form.reset({
        active: processDetail.data.isActive || false,
        bank: processDetail.data.bankName || '',
        currency: processDetail.data.currency || '',
        customerType: processDetail.data.customerType || '',
        digitVaType: processDetail.data.vaTypeDigit?.toString() || '',
        prefixBank: processDetail.data.bankPrefix || '',
        totalDigit: processDetail.data.totalDigit?.toString() || '',
        vaType: processDetail.data.vaType || '',
      });
    }
  }, [processDetail, form]);

  // No need to register workflow here since bucketProcessId comes from URL params

  const handleNext = () => {
    // Record next navigation activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: id?.toString() || '',
      remarks: 'Navigate to Summary from Process',
    });

    // Navigate to summary based on mode
    if (isCreate) {
      // For create mode, maintain create mode in URL
      const summaryPath = `/master-parameter/parameter-va/${id}/${bucketProcessId}/create/summary`;
      router.push(summaryPath);
    } else {
      // For edit and detail modes
      const summaryPath = `/master-parameter/parameter-va/${id}/${bucketProcessId}/summary`;
      router.push(summaryPath);
    }
  };

  const handleClose = () => {
    router.push('/master-parameter/parameter-va');
  };

  const handleSave = () => {
    form.handleSubmit((data: FormData) => {
      setIsLoading(true);

      // Record save activity based on mode
      const activityType = isCreate ? ActivityType.CREATE : ActivityType.EDIT;
      const remarks = isCreate ? 'Save Parameter VA Process (Create Mode)' : 'Save Parameter VA Process Changes';

      recordActivity({
        activity: activityType,
        bucketProcessId: bucketProcessId || '',
        changeAfter: JSON.stringify(data),
        changeBefore: isCreate ? '' : JSON.stringify(processDetail?.data || {}),
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: id?.toString() || '',
        remarks: remarks,
      });

      saveParameterVAMutation.mutate(
        {
          bankName: data.bank,
          bankPrefix: data.prefixBank,
          bucketProcessId: bucketProcessId || '',
          currency: data.currency,
          customerType: data.customerType,
          isActive: data.active,
          totalDigit: Number(data.totalDigit || 0),
          vaType: data.vaType,
          vaTypeDigit: data.digitVaType || '',
        },
        {
          onError: (error: any) => {
            setIsLoading(false);

            // Check for specific error code 0304 to show warning
            const errorCode = error?.response?.data?.errorCode;
            const errorMessage = error?.response?.data?.data || error?.message || 'Terjadi kesalahan, mohon coba kembali';

            if (errorCode === '0304') {
              // Show warning modal for error code 0304
              NiceModal.show(MODAL.GLOBAL.WARNING, {
                message: errorMessage,
              });
            } else {
              // Show error modal for other errors
              NiceModal.show(MODAL.GLOBAL.ERROR, {
                message: errorMessage,
              });
            }
          },
          onSuccess: (response: any) => {
            setIsLoading(false);

            // Handle response based on status code and message
            if (response?.errorDesc === 'Success') {
              // Success case - show success modal
              showNiceModalV2({
                onClose: () => {
                  closeNiceModal(MODAL.GLOBAL.SUCCESS);
                },
                title: response?.message || 'Data berhasil disimpan',
                type: 'success',
              });
            } else {
              // Warning case - show warning modal
              NiceModal.show(MODAL.GLOBAL.WARNING, {
                title: response?.data || 'Terjadi kesalahan, mohon coba kembali',
              });
            }
          },
        }
      );
    })();
  };

  // Record activity
  useEffect(() => {
    if (isCreate) {
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: id?.toString() || '',
        remarks: `Create Parameter VA Process - ID: ${id}`,
      });
    } else if (isEdit) {
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: id?.toString() || '',
        remarks: `Edit Parameter VA Process - ID: ${id}`,
      });
    } else if (isDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: id?.toString() || '',
        remarks: `View Parameter VA Process - ID: ${id}`,
      });
    }
  }, [isCreate, isEdit, isDetail, id, bucketProcessId, recordActivity]);

  // Check if form is valid
  const isFormValid = form.formState.isValid;
  const canProceed = isFormValid; // Next button disabled if form invalid

  // Get form values to check for null/empty fields
  const formValues = form.getValues();
  const hasNullFields = !formValues.bank || !formValues.currency || !formValues.vaType ||
                       !formValues.digitVaType || !formValues.customerType ||
                       !formValues.prefixBank || !formValues.totalDigit;

  // Disable save and cancel if any required field is null/empty
  const canSave = !hasNullFields;
  const canCancel = !hasNullFields;

  // Submit bucket functionality
  const { mutate: submitBucket } = useSubmitBucket({
    onError() {
      showNiceModalV2({
        onClose: () => {},
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

  const handleCancel = () => {
    recordActivity({
      activity: ActivityType.DELETE,
      bucketProcessId: bucketProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: id?.toString() || '',
      remarks: 'Cancel Parameter VA Process',
    });

    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          closeNiceModal(MODAL.GLOBAL.SUCCESS);

          const payload = {
            action: 'CANCELED',
            bucketProcessId: bucketProcessId || '',
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

  const watchedValues = form.watch();

  // Autosave Payload
  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      bankName: watchedValues.bank,
      bankPrefix: watchedValues.prefixBank,
      bucketProcessId: bucketProcessId || '',
      currency: watchedValues.currency,
      customerType: watchedValues.customerType,
      isActive: watchedValues.active,
      totalDigit: Number(watchedValues.totalDigit || 0),
      vaType: watchedValues.vaType,
      vaTypeDigit: watchedValues.digitVaType || '',
    });
  }, [watchedValues, bucketProcessId]);

  // Autosave Hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: isEdit && !isCreate && !!bucketProcessId,
    payload: autoSavePayload,
    url: 'parameter.paramVa.processSave',
  });

  return {
    canCancel,
    canProceed,
    canSave,
    dropdownOptions: {
      bankOptions,
      currencyOptions,
      customerTypeOptions,
      vaTypeOptions,
    },
    form,
    handleCancel,
    handleClose,
    handleNext,
    handleSave,
    isAutoSaveFetching,
    isCreate,
    isDetail,
    isEdit,
    isLoading:
    isLoading ||
    processDetailLoading ||
    customerTypeLoading ||
    vaTypeLoading ||
    bankLoading ||
    currencyLoading,
    isMaker,
  };
};
