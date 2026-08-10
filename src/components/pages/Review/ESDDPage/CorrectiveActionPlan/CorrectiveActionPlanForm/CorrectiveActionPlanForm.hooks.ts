'use client';

import { useContext, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetCorrectiveActionPlanDetail from '@/hooks/services/mip/corrective-action-plan/useGetCorrectiveActionPlanDetail';
import useSaveDescriptionBusinessResponse from '@/hooks/services/mip/corrective-action-plan/useSaveCapDescriptionBusinessResponse';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useSaveDescriptionData from '../hooks/useSaveDescriptionData';


import type { CorrectiveActionPlanFormProps } from './CorrectiveActionPlanForm.types';


const validationSchema = yup.object({
  ess: yup.string().nonNullable().required('This field is required'),
});

const MAX_DESCRIPTION_COUNT = 5;

const useCorrectiveActionPlanFormHooks = ({ module, process }: CorrectiveActionPlanFormProps) => {
  const { id } = useParams();
  const router = useCustomRouter();
  const path = usePathname();
  const { setDirtyMsg } = useContext(DirtyContext);

  const queryClient = useQueryClient();
  const { processId } = useIdentity();

  const isEditData = id !== undefined;
  const segments: string[] = path.split('/');
  const basePath: string = segments.slice(0, isEditData ? -2 : -1).join('/');

  const methods = useForm({
    defaultValues: {
      descriptionList: [
        {
          actionDescription: '',
          businessResponse: null,
          commentsActionDescription: [],
          commentsParameter: [],
          commentsTargetFullfillment: [],
          grade: '1',
          parameter: '',
          targetFullfillment: '',
        },
      ],
    },
    mode: 'onChange',
  });

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: { ess: null },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: methods.control,
    name: 'descriptionList',
  });

  const theme = useTheme();
  const [container, setContainer] = useState(null);
  const [responseContainer, setResponseContainer] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    businessResponse: true,
    foudings: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEssFilled, setIsEssFilled] = useState(false);

  const canAddMoreDescription = fields.length < MAX_DESCRIPTION_COUNT;

  useEffect(() => {
    if (id) {
      queryClient.invalidateQueries({
        queryKey: ['get-corrective-action-plan-bucket-detail', +id],
      });
    }
  }, [id, queryClient]);

  const { mutate: saveDescription } = useSaveDescriptionData({
    onError: (error) => {
      setIsSubmitting(false);
      const errorData = error?.response?.data || error;
      const errorDetail = errorData?.errorDetail || errorData?.errorDesc || error?.message || 'Data gagal disimpan';
      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => {
          router.push(basePath);
        },
        title: 'Data berhasil di disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: saveDescriptionBusinessResponse } = useSaveDescriptionBusinessResponse({
    onError: () => {
      setIsSubmitting(false);
      showNiceModalV2({ title: 'Terjadi Kesalahan Silahkan, dicoba kembali', type: 'error' });
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setDirtyMsg(undefined);
      showNiceModalV2({
        onClose: () => {
          router.push(basePath);
        },
        title: 'Data berhasil di disimpan',
        type: 'success',
      });
    },
  });

  const { isLoading, data } = useGetCorrectiveActionPlanDetail({
    config: { enabled: id !== undefined && id !== null },
    payload: { id: +id },
  });

  const { data: moduleListESS } = useGetParameterList('ess');

  useEffect(() => {
    const subscription = watch((value) => {
      setIsEssFilled(!!value.ess && value.ess !== '');
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (data && !isLoading) {
      setValue('ess', data.ess === undefined ? null : data.ess);
      setIsEssFilled(!!data.ess && data.ess !== '');

      if (data.descriptionList?.length > 0) {
        const newDefaultValues = data.descriptionList.map((dt) => {
          return {
            actionDescription: dt.actionDescription,
            businessResponse: dt.businessResponse,
            capId: dt.capId,
            commentsActionDescription: dt.commentsActionDescription || [],
            commentsParameter: dt.commentsParameter || [],
            commentsTargetFullfillment: dt.commentsTargetFullfillment || [],
            grade: dt.grade,
            id: dt.id,
            parameter: dt.parameter,
            targetFullfillment: dt.targetFullfillment,
          };
        });

        replace(newDefaultValues);
      }
    }
  }, [data, isLoading, replace, setValue]);

  useEffect(() => {
    if (data?.businessResponse) {
      setIsWordEditorEmpty({ ...isWordEditorEmpty, businessResponse: false });
    }
  }, [data?.businessResponse]);

  const handleOnSave = async (data) => {
    setIsSubmitting(true);
    let payload;
    const descriptionList = data.descriptionList.map((val) => {
      return {
        actionDescription: val.actionDescription,
        commentsActionDescription: val.commentsActionDescription || [],
        commentsParameter: val.commentsParameter || [],
        commentsTargetFullfillment: val.commentsTargetFullfillment || [],
        grade: val.grade,
        id: val.id,
        parameter: val.parameter,
        targetFullfillment: val.targetFullfillment,
      };
    });
    if (isEditData) {
      payload = {
        bucketProcessId: processId,
        description: await convertToDocx(container),
        descriptionList: JSON.stringify(descriptionList),
        ess: watch('ess'),
        id,
        module,
        process,
      };
    } else {
      payload = {
        bucketProcessId: processId,
        description: await convertToDocx(container),
        descriptionList: JSON.stringify(descriptionList),
        ess: watch('ess'),
        module,
        process,
      };
    }
    saveDescription(payload);
  };

  const handleSaveBusinessResponse = async (data) => {
    setIsSubmitting(true);
    const convertDocument = async (param) => {
      const docs = await convertToDocx(param);
      return docs;
    };
    const payload = await Promise.all(
      data.descriptionList.map(async (val) => {
        if (val.businessResponse) {
          const response = await convertDocument(val.businessResponse);
          return {
            businessResponse: response,
            capId: val.capId,
            id: val.id,
          };
        } else {
          return {
            businessResponse: null,
            capId: val.capId,
            id: val.id,
          };
        }
      }),
    );
    saveDescriptionBusinessResponse(payload);
  };

  const handleAddDescription = () => {
    if (!canAddMoreDescription) {
      showNiceModalV2({
        title: `Maksimal ${MAX_DESCRIPTION_COUNT} deskripsi yang dapat ditambahkan`,
        type: 'warning',
      });
      return;
    }

    setCurrentPage(fields.length);
    append({
      actionDescription: '',
      businessResponse: null,
      commentsActionDescription: [],
      commentsParameter: [],
      commentsTargetFullfillment: [],
      grade: '1',
      parameter: '',
      targetFullfillment: '',
    });
  };

  const handleDeleteDescription = () => {
    let page = currentPage;
    if (page > 0) {
      page = page - 1;
    } else {
      page = 0;
    }
    setCurrentPage(page);
    remove(currentPage);
  };

  const handleCancel = () => {
    router.back();
  };

  const autoSavePayload = useMemo(() => async () => {

    const formValues = methods.getValues();
    const descriptionList = formValues.descriptionList.map((val: any) => ({
      actionDescription: val.actionDescription,
      commentsActionDescription: val.commentsActionDescription || [],
      commentsParameter: val.commentsParameter || [],
      commentsTargetFullfillment: val.commentsTargetFullfillment || [],
      grade: val.grade,
      id: val.id,
      parameter: val.parameter,
      targetFullfillment: val.targetFullfillment,
    }));

    const descriptionBlob = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: descriptionBlob,
      descriptionList: JSON.stringify(descriptionList),
      ess: watch('ess'),
      id: +id,
      module,
      process,
    };
  }, [container, processId, id, methods, watch, module, process]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: isEditData && !!data && !!container,
    payload: autoSavePayload,
    url: 'mip.correctiveActionPlan.save',
  });

  return {
    canAddMoreDescription,
    container,
    control,
    currentPage,
    data,
    errors,
    fields,
    handleAddDescription,
    handleCancel,
    handleDeleteDescription,
    handleOnSave,
    handleSaveBusinessResponse,
    isAutoSaveFetching,
    isEditData,
    isEssFilled,
    isSubmitting,
    isWordEditorEmpty,
    methods,
    moduleListESS,
    responseContainer,
    setContainer,
    setCurrentPage,
    setIsWordEditorEmpty,
    setResponseContainer,
    setValue,
    theme,
    watch,
  };
};

export default useCorrectiveActionPlanFormHooks;
