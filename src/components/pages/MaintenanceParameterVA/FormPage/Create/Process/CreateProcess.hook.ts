'use client';

import { useState, useEffect, useRef } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useCreateParameterVA } from '../../../hooks/useSaveParameterVA';


// Validation schema for create flow
const schema = yup.object({
  active: yup.boolean(),
  bank: yup.string().required('Bank is required'),
  currency: yup.string().required('Currency is required'),
  customerType: yup.string().required('Customer Type is required'),
  digitVaType: yup.string().required('VA Type Digit is required'),
  prefixBank: yup.string().required('Bank Prefix is required'),
  totalDigit: yup.string().required('Total Digit is required'),
  vaType: yup.string().required('VA Type is required'),
});

type FormData = yup.InferType<typeof schema>;

export const useCreateProcess = () => {
  const router = useCustomRouter();
  const [user] = useApp();
  const { recordActivity } = useRecordLog();
  const isMaker = user.currentRole.includes(roles.MAKER);
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [bucketProcessId, setBucketProcessId] = useState<string | null>(null);

  // Get id and processId from URL params for create flow
  const id = (params as any)?.id;
  const processId = (params as any)?.processId;

  const createParameterVAMutation = useCreateParameterVA();

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

  // Initialize form with default values for create
  const form = useForm<FormData>({
    defaultValues: {
      active: true, // Default to active for new records
      bank: '',
      currency: '', // Will be set to IDR after options load
      customerType: '',
      digitVaType: '',
      prefixBank: '',
      totalDigit: '',
      vaType: '',
    },
    resolver: yupResolver(schema),
  });

  // Set bucketProcessId from URL params if available
  useEffect(() => {
    if (processId) {
      setBucketProcessId(processId);
    }
  }, [processId]);


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
      remarks: 'Navigate to Summary from Create Process',
    });

    // Navigate to create summary
    router.push('/master-parameter/parameter-va/create/summary');
  };

  const handleClose = () => {
    // Record close activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucketProcessId,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: 'create',
      remarks: 'Close Create Parameter VA Process',
    });

    router.push('/master-parameter/parameter-va');
  };

  const handleSave = async () => {
    if (!form.formState.isValid) {
      form.trigger();
      return;
    }

    setIsLoading(true);

    try {
      const formData = form.getValues();

      // Record save activity
      recordActivity({
        activity: ActivityType.CREATE,
        bucketProcessId: bucketProcessId || null,
        changeAfter: JSON.stringify(formData),
        changeBefore: '',
        menuCode: 'parameter-va',
        module: 'parameter-va',
        process: 'create',
        remarks: 'Save Create Parameter VA Process',
      });

      // Create parameter VA data
      const response = await createParameterVAMutation.mutateAsync({
        bankName: formData.bank,
        bankPrefix: formData.prefixBank,
        currency: formData.currency,
        customerType: formData.customerType,
        isActive: formData.active,
        totalDigit: parseInt(formData.totalDigit),
        vaType: formData.vaType,
        vaTypeDigit: formData.digitVaType,
      });


      // Handle response based on status code and message
      if (response?.errorDesc === 'Success') {
        // Success case - show success modal
        showNiceModalV2({
          onClose: () => {
            closeNiceModal(MODAL.GLOBAL.SUCCESS);

            // After successful save, get the new bucketProcessId and id from response
            const newBucketProcessId = response?.data?.bucketProcessId;
            const newId = response?.data?.id;

            if (newBucketProcessId && newId) {
              // Set the new bucketProcessId and redirect to dynamic route with create mode
              setBucketProcessId(newBucketProcessId);

              // Redirect to dynamic route with create mode
              router.push(`/master-parameter/parameter-va/${newId}/${newBucketProcessId}/create/process`);
            }
          },
          title: response?.message || 'Data berhasil disimpan',
          type: 'success',
        });
      } else {
        // Check for specific error code 0304 to show warning
        const errorCode = response?.errorCode;
        const errorMessage = response?.data || 'Terjadi kesalahan, mohon coba kembali';

        if (errorCode === '0304') {
          // Show warning modal for error code 0304
          NiceModal.show(MODAL.GLOBAL.WARNING, {
            title: errorMessage,
          });
        } else {
          // Show error modal for other errors
          NiceModal.show(MODAL.GLOBAL.ERROR, {
            message: errorMessage,
          });
        }
      }
    } catch (error: any) {
      console.error('Error saving parameter VA:', error);

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
    } finally {
      setIsLoading(false);
    }
  };

  // No need for additional logic - redirect happens after save

  // Record initial activity
  useEffect(() => {
    recordActivity({
      activity: ActivityType.CREATE,
      bucketProcessId: bucketProcessId || null,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: 'create',
      remarks: 'Create Parameter VA Process',
    });
  }, [bucketProcessId, recordActivity]);

  const canSave = isMaker && !isLoading && form.formState.isValid;
  const canCancel = !isLoading;

  return {
    canCancel,
    canSave,
    dropdownOptions: {
      bankOptions,
      currencyOptions,
      customerTypeOptions,
      vaTypeOptions,
    },
    form,
    handleClose,
    handleNext,
    handleSave,
    isLoading:
    isLoading ||
    customerTypeLoading ||
    vaTypeLoading ||
    bankLoading ||
    currencyLoading ||
    createParameterVAMutation.isPending,
    isMaker,
  };
};
