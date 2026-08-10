import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetCurrentModule from '@/components/pages/Review/LpaReview/hooks/useGetCurrentModule';

import useGetDetailFinancingOverview from './hooks/useGetDetailFinancingOverview';
import useSaveFinancingOverview from './hooks/useSaveFinancingFacility';


const validationScheme = Yup.object({
  typePermohonanRemark: Yup.string().nullable(),
});

export const useFinancingOverview = () => {
  const { setDirtyMsg } = useContext(DirtyContext);
  const { viewOnly } = useViewOnly();
  const theme = useTheme();
  const goToNextStep = useGoToNextStep();
  const { module, process } = useGetCurrentModule();
  const [container, setContainer] = useState(null);
  const { processId, parentId } = useIdentity();


  const {
    watch,
    register,
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { typePermohonanRemark: '' },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });
  const watchFields = watch();
  const initialFormRef = useRef<{ typePermohonanRemark: any } | null>(null);

  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');
  const [remark, setRemark] = useState(null);

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: processId,
    module,
    process,
  });


  const {
    data: financingOverviewDetail,
    isFetching: isLoading,
  } = useGetDetailFinancingOverview({
    bucketProcessId: processId,
    module,
    process,
  });

  useEffect(() => {
    if (financingOverviewDetail) {
      reset({ typePermohonanRemark: financingOverviewDetail?.remark });
      initialFormRef.current = {
        typePermohonanRemark: financingOverviewDetail?.remark ?? '',
      };
    }
  }, [financingOverviewDetail]);

  // Mark dirty when form field changes from its initial value
  useEffect(() => {
    if (!initialFormRef.current) return;
    const changed =
      (initialFormRef.current.typePermohonanRemark ?? '') !== (watchFields?.typePermohonanRemark ?? '');
    if (changed) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    }
  }, [watchFields?.typePermohonanRemark, setDirtyMsg]);

  // Save
  const { isPending: isSaveLoading, mutate: saveFinancingFacility } = useSaveFinancingOverview({
    onSuccess: () => {
      setDirtyMsg(undefined);
    },
  });

  const handleSave = async (data: any, shouldGoNext: boolean = false) => {
    const documents = await convertToDocx(container);

    const savePayload = {
      bucketProcessId: String(processId),
      description: documents,
      module,
      process,
      remark: data.typePermohonanRemark,
    };

    const performSave = () => {
      saveFinancingFacility(savePayload, {
        onSuccess: () => {
          showNiceModalV2({
            onClose: () => {
              if (shouldGoNext) {
                goToNextStep();
              }
            },
            type: 'success',
          });
        },
      });
    };

    if (isDirty || watch('typePermohonanRemark')) {
      performSave();
    } else {
      showNiceModalV2({
        onSubmit: performSave,
        title: 'Tidak ada perubahan ada form ini, apakah anda yakin ingin melanjutkan?',
        type: 'warning',
      });
    }
  };

  const autoSavePayload = useMemo(() => async () => {

    const documents = await convertToDocx(container);
    const currentRemark = getValues('typePermohonanRemark');

    return {
      bucketProcessId: String(processId),
      description: documents,
      module,
      process,
      remark: currentRemark,
    };
  }, [container, processId, module, process, getValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'lpa.save.save',
  });

  return {
    container,
    control,
    debtorInfoData,
    errors,
    financingOverviewDetail,
    getValues,
    goToNextStep,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isDirty,
    isLoading,
    isSaveLoading,
    processId,
    register,
    remark,
    setContainer,
    setRemark,
    setValue,
    theme,
    typeSubmissionData,
    viewOnly,
  };
};
