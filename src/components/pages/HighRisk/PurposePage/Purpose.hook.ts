import { useContext, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useHighRiskContext } from '@/components/layouts/HighRiskLayout/HighRisk.context';

import useGetPurposeDetail from './hooks/useGetPurposeDetail';
import useSavePurposeDetail from './hooks/useSavePurposeDetail';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


const usePurpose = () => {
  const { processId } = useIdentity();
  const { goToNextStep } = useHighRiskContext();
  const { viewOnly } = useViewOnly();
  const { setDirtyMsg } = useContext(DirtyContext);

  const [container, setContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    description: true,
  });
  const validationScheme = yup.object({
    applicationType: yup.string().nullable(),
    remark: yup.string().nullable(),
  });

  const { data: applicationTypeList } = useGetParameterList('typeSubmission', { label: 'value1', value: 'key' });
  const {
    data: purposeDetail,
    isPending: isFetchingDetail,
  } = useGetPurposeDetail({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { isPending: isSaveLoading, mutate: savePurposeDetail } = useSavePurposeDetail({
    onSuccess: () => {
      setDirtyMsg(undefined);
    },
  });

  const {
    control,
    reset,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      applicationType: '',
      remark: '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationScheme),
  });

  const handleSave = async ({ goToNext }: { goToNext?: boolean }) => {
    const description = await convertToDocx(container);
    savePurposeDetail({
      applicationType: watch().applicationType,
      bucketProcessId: processId,
      description: description,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
      remark: watch().remark,
    }, {
      onSuccess: () => {
        showNiceModalV2({ onClose: goToNext ? goToNextStep : undefined, type: 'success' });
      },
    });
  };

  useEffect(() => {
    const formValues = {
      applicationType: purposeDetail?.applicationType,
      remark: purposeDetail?.remark,
    };

    if (applicationTypeList && !formValues.applicationType) {
      formValues.applicationType = applicationTypeList[0]?.value;
    }

    reset(formValues);
  }, [applicationTypeList, purposeDetail]);

  const autoSavePayload = useMemo(() => async () => {

    const descriptionBlob = await convertToDocx(container);
    const formValues = getValues();

    return {
      applicationType: formValues.applicationType,
      bucketProcessId: processId,
      description: descriptionBlob,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
      remark: formValues.remark,
    };
  }, [container, processId, getValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!processId,
    payload: autoSavePayload,
    url: 'mip.hr.savePurpose',
  });

  return {
    applicationTypeList,
    container,
    control,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isFetchingDetail,
    isSaveLoading,
    isWordEditorEmpty,
    purposeDetail,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  };
};

export default usePurpose;
