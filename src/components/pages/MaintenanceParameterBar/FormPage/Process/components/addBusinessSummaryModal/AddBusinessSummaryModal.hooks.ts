import { useCallback, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import useSaveBusinessSummary from '../../../../hooks/useSaveBusinessSummary';

import { schema, type FormData } from './constants';


const useAddBusinessSummaryModal = (
  subModule?: string,
  code?: string,
  bucketProcessId?: string,
  onSuccess?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const saveBusinessSummaryMutation = useSaveBusinessSummary();

  // Fetch Business Summary List from API
  const { data: businessSummaryOptions, isFetching: isLoadingBusinessSummary } = useGetParameterList('barBusinessSummary', { label: 'value1', value: 'key' });

  const form = useForm<FormData>({
    defaultValues: {
      items: [
        {
          active: 'Ya',
          kodeBusinessSummary: '',
        },
      ],
      kodeBusinessCall: code || '394281 - Business Summary',
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const handleAddItem = useCallback(() => {
    append({
      active: 'Ya',
      kodeBusinessSummary: '',
    });
  }, [append]);

  const handleRemoveItem = useCallback((index: number) => {
    // Prevent removing the last item
    if (fields.length > 1) {
      remove(index);
    }
  }, [fields.length, remove]);

  const handleSave = useCallback((callback?: (data: any) => void) => {
    return form.handleSubmit((data) => {
      if (!data) return;

      // Transform data to match required format
      const transformedData = {
        bcModuleReference: subModule ? decodeURIComponent(subModule) : undefined,
        bucketProcessId: bucketProcessId || 'MPBC-A1999',
        businessSummaryItems: ((data as any).items || []).map((item: any) => {
          // Find the selected option from businessSummaryOptions
          const selectedOption = businessSummaryOptions?.find((option) => option.label === item.kodeBusinessSummary);

          return {
            code: selectedOption?.value || item.kodeBusinessSummary, // Use the value (key) from the option
            id: null,
            isActive: item.active === 'Ya',
            label: selectedOption?.label || item.kodeBusinessSummary, // Use the label (value1) from the option
          };
        }),
      };

      // Call API to save business summary
      saveBusinessSummaryMutation.mutate(transformedData, {
        onError: (error: any) => {
          setIsLoading(false);

          // Extract error message
          const errorMessage = error?.response?.data?.errorDetail || error?.response?.data?.message || error?.message || 'Terjadi kesalahan, mohon coba kembali';
          // Show error modal
          NiceModal.show(MODAL.GLOBAL.ERROR, {
            title: errorMessage,
          });
        },
        onSuccess: (response: any) => {
          setIsLoading(false);

          // Handle response based on status
          if (response?.errorDesc === 'Success' || response?.status === 'success') {
            // Success case - show success modal
            showNiceModalV2({
              onClose: () => {
                NiceModal.hide(MODAL.GLOBAL.SUCCESS);
              },
              title: response?.message || 'Business Summary berhasil disimpan',
              type: 'success',
            });
          } else {
            // Warning case - show warning modal
            NiceModal.show(MODAL.GLOBAL.WARNING, {
              message: response?.data || response?.message || 'Terjadi kesalahan, mohon coba kembali',
            });
          }

          // Call onSuccess callback to refetch data
          if (onSuccess) {
            onSuccess();
          }

          if (callback) {
            callback(transformedData);
          }
        },
      });
    });
  }, [form, subModule, bucketProcessId, saveBusinessSummaryMutation, onSuccess, businessSummaryOptions]);

  return {
    businessSummaryOptions,
    fields,
    form,
    handleAddItem,
    handleRemoveItem,
    handleSave,
    isLoading: isLoading || saveBusinessSummaryMutation.isPending,
    isLoadingBusinessSummary,
  };
};

export default useAddBusinessSummaryModal;
