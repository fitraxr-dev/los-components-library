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

const useCorrectiveActionPlanFormHooks = ({
  module,
  process,
  isBusinessResponse,
  viewOnly,
}: CorrectiveActionPlanFormProps) => {
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
          grade: '1',
          parameter: '',
          targetFullfillment: '',
        }
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
      console.error('Save error:', error);
      const errorMessage = error?.response?.data?.message
        || error?.message
        || 'Terjadi Kesalahan Silahkan, dicoba kembali';

      showNiceModalV2({
        title: errorMessage,
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

  const { isLoading, data } = useGetCorrectiveActionPlanDetail(
    {
      config: { enabled: id !== undefined },
      payload: { id: +id },
    },
  );

  const { data: moduleListESS } = useGetParameterList('ess');

  useEffect(() => {
    if (data && !isLoading) {
      setValue('ess', data.ess === undefined ? null : data.ess);

      if (data.descriptionList?.length > 0) {
        const newDefaultValues = data.descriptionList.map((dt) => {
          return {
            actionDescription: dt.actionDescription,
            businessResponse: dt.businessResponse,
            capId: dt.capId,
            grade: dt.grade,
            id: dt.id,
            parameter: dt.parameter,
            targetFullfillment: dt.targetFullfillment,
          };
        });

        replace(newDefaultValues);
      }
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (data?.businessResponse) {
      setIsWordEditorEmpty({ ...isWordEditorEmpty, businessResponse: false });
    }
  }, [data?.businessResponse]);

  const handleOnSave = async (data) => {
    let payload;
    const descriptionList = data.descriptionList.map((val) => {
      return (
        {
          actionDescription: val.actionDescription,
          grade: val.grade,
          parameter: val.parameter,
          targetFullfillment: val.targetFullfillment,
        }
      );
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
    const convertDocument = async (param) => {
      const docs = await convertToDocx(param);
      return docs;
    };
    const payload = await Promise.all(
      data.descriptionList.map(async (val) => {
        if (val.businessResponse) {
          const response = await convertDocument(val.businessResponse); // Await the async result here
          return ({
            businessResponse: response,
            capId: val.capId,
            id: val.id,
          });
        } else {
          return ({
            businessResponse: null,
            capId: val.capId,
            id: val.id,
          });
        }
      })
    );
    saveDescriptionBusinessResponse(payload);

  };

  const handleAddDescription = () => {
    setCurrentPage(fields.length);
    append({
      actionDescription: '',
      businessResponse: null,
      grade: '',
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
    const formDataValues = methods.getValues();
    const currentEss = watch('ess');

    if (isBusinessResponse) {
      const payload = await Promise.all(
        formDataValues.descriptionList.map(async (val) => {
          const response = val.businessResponse ? await convertToDocx(val.businessResponse) : null;
          return {
            businessResponse: response,
            capId: val.capId,
            id: val.id,
          };
        })
      );
      return payload;
    } else {
      const descriptionList = formDataValues.descriptionList.map((val) => ({
        actionDescription: val.actionDescription,
        grade: val.grade,
        parameter: val.parameter,
        targetFullfillment: val.targetFullfillment,
      }));

      return {
        bucketProcessId: processId,
        description: container ? await convertToDocx(container) : null,
        descriptionList: JSON.stringify(descriptionList),
        ess: currentEss,
        id,
        module,
        process,
      };
    }
  }, [isBusinessResponse, container, processId, id, module, process, methods, watch]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !viewOnly && !!data,
    payload: autoSavePayload,
    url: isBusinessResponse
      ? 'mip.correctiveActionPlan.saveBusinessResponseNew'
      : 'mip.correctiveActionPlan.save',
  });


  return {
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
