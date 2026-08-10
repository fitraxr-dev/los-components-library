import { useContext, useMemo, useState } from 'react';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useHighRiskContext } from '@/components/layouts/HighRiskLayout/HighRisk.context';

import useGetAssumptionQualificationDetail from './hooks/useGetAssumptionQualificationDetail';
import useSaveAssumptionQualification from './hooks/useSaveAssumptionQualification';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


const useAssumptionQualification = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useHighRiskContext();
  const { setDirtyMsg } = useContext(DirtyContext);

  const [container, setContainer] = useState<DocumentEditorContainerComponent>(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    assumptionQualificationDesc: true,
  });

  const { data: assumptionQualificationData, isPending: isassumptionQualificationLoading } =
  useGetAssumptionQualificationDetail(
    {
      bucketProcessId: processId,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    });

  const { isPending: isSaveLoading, mutate: saveAssumptionQualification } = useSaveAssumptionQualification({
    onSuccess: () => {
      setDirtyMsg(undefined);
    },
  });

  const handleSave = async ({ goToNext }: {goToNext?: boolean}) => {
    const description = await convertToDocx(container);
    saveAssumptionQualification({
      bucketProcessId: processId,
      description: description,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    }, {
      onSuccess: () => {
        showNiceModalV2({ onClose: goToNext ? goToNextStep : undefined, type: 'success' });
      },
    });
  };

  const autoSavePayload = useMemo(() => async () => {

    const description = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description: description,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && !!processId,
    payload: autoSavePayload,
    url: 'mip.hr.saveAssumtion',
  });

  return {
    assumptionQualificationData,
    container,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isSaveLoading,
    isWordEditorEmpty,
    isassumptionQualificationLoading,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  };
};

export default useAssumptionQualification;
