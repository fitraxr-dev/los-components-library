import { useContext, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import useGetConcernDetail from '../../hooks/useGetConcernDetail';
import useSaveConcern from '../../hooks/useSaveConcern';


const validationSchema = yup.object(
  { title: yup.string().required('This field is required') }
);

const useSummaryForm = () => {
  const params: { processId: string; id: string } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const isEditData = params.id !== undefined;
  const searchParams = useSearchParams();
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();
  const [isLoading, setIsLoading] = useState(false);

  const search = searchParams.get('type');
  const queue = searchParams.get('queue');
  const path = usePathname();

  const pathArray = path.split('/');
  const isDetail = pathArray[7]?.includes('detail');


  const {
    control,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { isValid },
  } = useForm({
    defaultValues: { title: '' },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const theme = useTheme();
  const [container, setContainer] = useState(null);

  const { mutate, isPending: isSaveLoading } = useSaveConcern({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi Kesalahan Silahkan, dicoba kembali', type: 'error' });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => {
        setTimeout(() => {
          setIsLoading(false);
          router.back();
        }, 1000);
      },
      title: 'Data berhasil di disimpan',
      type: 'success' });
    },
  });

  const { data } = useGetConcernDetail(
    {
      config: { enabled: params.id !== undefined },
      payload: { id: +params.id },
    },
  );


  useEffect(() => {
    onFormatTitle();
  }, []);

  const onFormatTitle = () => {
    let title ;

    if (search === 'internal') {
      title = `Internal Concern ${queue}`;
    } else {
      title = `External Concern ${queue}`;

    }
    reset({ title });
  };

  const handleOnSave = async (data) => {
    let payload;
    setIsLoading(true);
    if (isEditData) {
      payload = {
        bucketProcessId: params.processId,
        description: await convertToDocx(container),
        id: +params.id,
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DK,
        shariaCompliance: data.title,
        type: search.toUpperCase(),
      };
    } else {
      payload = {
        bucketProcessId: params.processId,
        description: await convertToDocx(container),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DK,
        shariaCompliance: data.title,
        type: search.toUpperCase(),
      };
    }
    mutate(payload);
  };

  const handleCancel = () => {
    router.back();
  };

  const autoSavePayload = useMemo(() => async () => {

    const descriptionBlob = await convertToDocx(container);
    const currentTitle = getValues('title');

    const payload = {
      bucketProcessId: params.processId,
      description: descriptionBlob,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
      shariaCompliance: currentTitle,
      type: search?.toUpperCase(),
      ...(isEditData && { id: +params.id }),
    };

    return payload;
  }, [container, params.processId, params.id, search, isEditData, getValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !isDetail && !viewOnly,
    payload: autoSavePayload,
    url: 'mip.concern.save',
  });

  return {
    container,
    control,
    data,
    handleCancel,
    handleOnSave,
    handleSubmit,
    isAutoSaveFetching,
    isDetail,
    isLoading,
    isSaveLoading,
    setContainer,
    setValue,
    theme,
    viewOnly,
  };
};

export default useSummaryForm;
