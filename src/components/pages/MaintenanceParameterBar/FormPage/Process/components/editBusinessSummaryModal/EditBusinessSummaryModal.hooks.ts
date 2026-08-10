import { useCallback, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';

import useSaveBusinessSummary from '../../../../hooks/useSaveBusinessSummary';


const itemSchema = yup.object({
  active: yup.string().required('Active status is required'),
  id: yup.number().optional(),
  kodeBusinessSummary: yup.string().required('Kategori Business Summary is required'),
});

const schema = yup.object({
  items: yup.array().of(itemSchema).min(1, 'At least one item is required'),
  kodeBusinessCall: yup.string(),
});

type FormData = yup.InferType<typeof schema>;
type ItemData = yup.InferType<typeof itemSchema>;

interface EditBusinessSummaryModalProps {
  itemData?: ItemData[];
  subModule?: string;
  code?: string;
  bucketProcessId?: string;
  onSuccess?: () => void;
}

const useEditBusinessSummaryModal = ({
  itemData,
  subModule,
  code,
  bucketProcessId,
  onSuccess,
}: EditBusinessSummaryModalProps) => {
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

  const { fields } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Update form when itemData changes
  useEffect(() => {
    if (itemData && itemData.length > 0) {
      const formData = {
        items: itemData.map((item) => {
          // Handle different data structures from API
          let kodeBusinessSummary = '';

          if (item.kodeBusinessSummary) {
            // If kodeBusinessSummary already exists, normalize it
            kodeBusinessSummary = item.kodeBusinessSummary;

            // If it's in format "KEY - LABEL", extract just the label part
            if (kodeBusinessSummary.includes(' - ')) {
              const labelPart = kodeBusinessSummary.split(' - ')[1];
              // Check if this label exists in businessSummaryOptions
              const matchingOption = businessSummaryOptions?.find((opt) => opt.label === labelPart);
              if (matchingOption) {
                kodeBusinessSummary = labelPart;
              }
            }
          } else if ((item as any).label) {
            // If label exists, use it
            kodeBusinessSummary = (item as any).label;
          } else if ((item as any).value1) {
            // If value1 exists (from API response), use it
            kodeBusinessSummary = (item as any).value1;
          }

          console.log('Edit - Mapping item data:', {
            businessSummaryOptions: businessSummaryOptions?.slice(0, 3), // Show first 3 options for debugging
            kodeBusinessSummary,
            originalItem: item,
          });

          return {
            ...item,
            kodeBusinessSummary,
          };
        }),
        kodeBusinessCall: code || '394281 - Business Summary',
      };

      console.log('Edit - Form data to reset:', formData);
      form.reset(formData);
    }
  }, [itemData, code, form, businessSummaryOptions]);


  const handleSave = useCallback((callback?: (data: any) => void) => {
    return form.handleSubmit((data) => {
      if (!data) return;

      // Transform data to match required format (same as Add modal)
      const item = (data as any).items?.[0]; // Get first (and only) item

      if (!item) {
        console.error('No item data found for editing');
        return;
      }

      // Find the selected option from businessSummaryOptions
      const selectedOption = businessSummaryOptions?.find((option) => option.label === item.kodeBusinessSummary);
      const codeValue = selectedOption?.value || item.kodeBusinessSummary;

      const transformedData = {
        bcModuleReference: subModule ? decodeURIComponent(subModule) : undefined,
        bucketProcessId: bucketProcessId || undefined,
        businessSummaryItems: [{
          code: codeValue,
          id: item.id?.toString() || null,
          isActive: item.active === 'Ya',
          label: selectedOption?.label || item.kodeBusinessSummary,
        }],
      };

      saveBusinessSummaryMutation.mutate(transformedData, {
        onError: (error: any) => {
          setIsLoading(false);


          const errorMessage = error?.response?.data?.errorDetail || error?.response?.data?.message || error?.message || 'Terjadi kesalahan, mohon coba kembali';
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
              title: response?.message || 'Business Summary berhasil diperbarui',
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
  }, [form, bucketProcessId, subModule, code, saveBusinessSummaryMutation, onSuccess, businessSummaryOptions]);

  const watchedValues = form.watch();

  const autoSavePayload = useMemo(() => () => {
    const item = watchedValues.items?.[0];
    if (!item) return Promise.resolve(null);

    const selectedOption = businessSummaryOptions?.find((option) => option.label === item.kodeBusinessSummary);
    const codeValue = selectedOption?.value || item.kodeBusinessSummary;

    const transformedData = {
      bcModuleReference: subModule ? decodeURIComponent(subModule) : undefined,
      bucketProcessId: bucketProcessId || undefined,
      businessSummaryItems: [{
        code: codeValue,
        id: item.id?.toString() || null,
        isActive: item.active === 'Ya',
        label: selectedOption?.label || item.kodeBusinessSummary,
      }],
    };

    return Promise.resolve(transformedData);
  }, [watchedValues, businessSummaryOptions, bucketProcessId, subModule]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!bucketProcessId && !isLoadingBusinessSummary,
    payload: autoSavePayload,
    url: 'parameter.parameterBar.processSave',
  });

  return {
    businessSummaryOptions,
    fields,
    form,
    handleSave,
    isAutoSaveFetching,
    isLoading: isLoading || saveBusinessSummaryMutation.isPending,
    isLoadingBusinessSummary,
  };
};

export default useEditBusinessSummaryModal;
