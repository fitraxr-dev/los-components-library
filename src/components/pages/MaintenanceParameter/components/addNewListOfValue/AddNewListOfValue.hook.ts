import React, { useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { ActivityType } from '@/enums/Activity';
import { API } from '@/helpers/api';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useRecordLog from '@/hooks/useRecordLog';


const schema = yup.object({
  ariumCode: yup.string(), // Make optional
  code: yup.string().optional(),
  isActive: yup.boolean(), // Make optional
  temenosCode: yup.string(), // Make optional
  valueName: yup.string().required('Value Name is required'), // Only Value Name is mandatory
});

type FormData = yup.InferType<typeof schema>;

const useAddNewListOfValue = (props?: { editData?: any; isEdit?: boolean }) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();

  // Get data from route parameters
  const bucketProcessId = params.processId as string;
  const moduleName = params.module as string;

  const {
    control,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      ariumCode: props?.editData?.ariumCode || '',
      code: props?.editData?.code || '',
      isActive: props?.editData?.isActive !== undefined ? props?.editData?.isActive : true,
      temenosCode: props?.editData?.temenosCode || '',
      valueName: props?.editData?.valueName || '',
    },
    resolver: yupResolver(schema),
  });

  // Reset form when editData changes
  React.useEffect(() => {
    if (props?.editData) {
      reset({
        ariumCode: props.editData.ariumCode || '',
        code: props.editData.code || '',
        isActive: props.editData.isActive !== undefined ? props.editData.isActive : true,
        temenosCode: props.editData.temenosCode || '',
        valueName: props.editData.valueName || '',
      });
    }
  }, [props?.editData, reset]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload: any = {
        ariumCode: data.ariumCode,
        bucketProcessId,
        isActive: data.isActive,
        module: moduleName,
        temenosCode: data.temenosCode,
        valueName: data.valueName,
      };

      // Add id to payload only when editing
      if (props?.isEdit) {
        payload.id = props.editData.id;
      }

      const res = await API('parameter.parameterLov.save', {
        data: payload,
      });
      return res.data;
    },
  });

  const onSave = (callback: (data: FormData) => void) => {
    return handleSubmit(async (data: FormData) => {
      try {
        if (!data) return;
        // Prepare data for recordActivity
        const changeAfter = JSON.stringify({
          ariumCode: data.ariumCode,
          bucketProcessId,
          isActive: data.isActive,
          module: moduleName,
          temenosCode: data.temenosCode,
          valueName: data.valueName,
          ...(props?.isEdit && { id: props.editData.id }),
        });

        const changeBefore = props?.isEdit && props?.editData
          ? JSON.stringify({
            ariumCode: props.editData.ariumCode,
            bucketProcessId,
            code: props.editData.code,
            isActive: props.editData.isActive,
            module: moduleName,
            temenosCode: props.editData.temenosCode,
            valueName: props.editData.valueName,
          })
          : null;

        // Record activity before API call
        recordActivity({
          activity: props?.isEdit ? ActivityType.EDIT : ActivityType.CREATE,
          bucketProcessId,
          changeAfter,
          changeBefore,
          menuCode: 'parameter-lov',
          module: moduleName,
          process: 'parameter-lov',
          remarks: props?.isEdit
            ? `edit parameter lov item: ${data.valueName} (${data.ariumCode})`
            : `add new parameter lov item: ${data.valueName} (${data.ariumCode})`,
        });

        await saveMutation.mutateAsync(data);
        await queryClient.invalidateQueries({
          queryKey: ['parameter-lov-item-list'],
        });

        showNiceModalV2({
          onClose: () => {
            callback(data);
          },
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      } catch (error: any) {
        console.error('Error saving data:', error);
        const errorDetail = error?.message || 'Data gagal disimpan';
        showNiceModalV2({
          title: errorDetail,
          type: 'error',
        });
      }
    });
  };

  // Watch form values to check if Value Name is filled (minimal validation)
  const [valueName] = watch(['valueName']);
  const isFormValid = React.useMemo(() => {
    return valueName?.trim() !== '';
  }, [valueName]);

  const watchedValues = watch();

  const autoSavePayload = useMemo(() => () => {
    if (!props?.isEdit) return Promise.resolve(null);

    return Promise.resolve({
      ariumCode: watchedValues.ariumCode,
      bucketProcessId,
      id: props.editData?.id,
      isActive: watchedValues.isActive,
      module: moduleName,
      temenosCode: watchedValues.temenosCode,
      valueName: watchedValues.valueName,
    });
  }, [watchedValues, props?.isEdit, props?.editData?.id, bucketProcessId, moduleName]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!props?.isEdit && !!bucketProcessId,
    payload: autoSavePayload,
    url: 'parameter.parameterLov.save',
  });

  return {
    control,
    errors,
    isAutoSaveFetching,
    isFormValid,
    isLoading: saveMutation.isPending,
    onSave,
  };
};

export default useAddNewListOfValue;
