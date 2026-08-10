import { useContext, useEffect, useMemo, useState } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailShariaCompliance from '../hooks/useGetShariaComplianceDetail';
import useSaveShariaCompliance from '../hooks/useSaveShariaCompliance';


const useEditShariaComplianceChecklist = () => {
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const { id } = useParams();
  const [container, setContainer] = useState(null);
  const router = useCustomRouter();
  const queryParams = useSearchParams();
  const path = usePathname();
  const pathArray = path.split('/');
  const isDetail = pathArray[8]?.includes('detail');
  const { processId } = useIdentity();

  const { reset, getValues, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      aspect: '',
      description: '',
      id: 0,
      isCheckDK: null,
    },
    mode: 'onTouched',
  });

  const { data, isLoading } = useGetDetailShariaCompliance({ id: +id });


  useEffect(() => {
    if (data) {
      reset({
        aspect: data.aspect,
        description: data.description,
        id: data.id,
        isCheckDK: data.isCheckDk === true ? 'yes' : 'no',
      });
    }
  }, [data, reset]);

  const isSub = useMemo(() => {
    const subParam = queryParams.get('sub');
    if (!subParam || subParam === 'undefined' || subParam === 'null') {
      return null;
    }
    return subParam;
  }, [queryParams]);

  useEffect(() => {
    const subParam = queryParams.get('sub');
    if (subParam === 'undefined' || subParam === 'null' || !subParam) {
      const newQuery = new URLSearchParams(queryParams.toString());
      newQuery.delete('sub');

      const newSearch = newQuery.toString();
      const newUrl = newSearch
        ? `${window.location.pathname}?${newSearch}`
        : window.location.pathname;

      window.history.replaceState({}, '', newUrl);
    }
  }, [queryParams]);

  useEffect(() => {
    const isFormDirty = checkFormDirty();
    if (isFormDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [watch('aspect'), watch('isCheckDK'), watch('description'), data, setDirtyMsg]);

  const viewOnly = useMemo(() => !data?.isEditable, [data]);

  const checkFormDirty = () => {
    if (!data) return false;

    const isAspectChanged = watch('aspect') !== data.aspect;
    const currentIsCheckDK = watch('isCheckDK');
    const originalIsCheckDK = data.isCheckDk === true ? 'yes' : 'no';
    const isCheckDKChanged = currentIsCheckDK !== originalIsCheckDK;

    const isDescriptionChanged = watch('description') !== data.description;

    return isAspectChanged || isCheckDKChanged || isDescriptionChanged;
  };
  const handleBack = () => {
    router.back();
  };

  const { mutate: saveShariaCompliance, isPending: isSaveLoading } = useSaveShariaCompliance({
    onError: (error) => {
      const errorData = error?.response?.data || error;
      const errorDetail = errorData?.errorDetail || errorData?.errorDesc || error?.message || 'Data gagal disimpan';
      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => handleBack(), title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const handleSave = async () => {
    const description = await convertToDocx(container);
    saveShariaCompliance({
      bucketProcessId: processId,
      description,
      id: +id,
      isCheckDk: getValues('isCheckDK'),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
    });
  };

  const autoSavePayload = useMemo(() => async () => {

    const descriptionBlob = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: descriptionBlob,
      id: +id,
      isCheckDk: getValues('isCheckDK'),
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
    };
  }, [container, processId, id, getValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !isDetail && !!processId,
    payload: autoSavePayload,
    url: 'mip.syariahCompliance.save',
  });

  return {
    container,
    data,
    getValues,
    handleBack,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isDetail,
    isLoading,
    isSaveLoading,
    isSub,
    reset,
    setContainer,
    setValue,
    viewOnly,
    watch,
  };
};

export default useEditShariaComplianceChecklist;
