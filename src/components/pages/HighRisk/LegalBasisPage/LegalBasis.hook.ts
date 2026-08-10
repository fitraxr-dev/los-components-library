import { useContext, useEffect, useMemo, useState } from 'react';


import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useHighRiskContext } from '@/components/layouts/HighRiskLayout/HighRisk.context';

import useGetLegalBasisDetail from './hooks/useGetLegalBasisDetail';
import useSaveLegalBasis from './hooks/useSaveLegalBasisDetail';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


const useLegalBasis = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { goToNextStep } = useHighRiskContext();
  const { setDirtyMsg } = useContext(DirtyContext);

  const [container, setContainer] = useState<DocumentEditorContainerComponent>(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    legalBasisDesc: true,
  });

  const { data: legalBasisDetail, isPending: isLegalBasisFetching } = useGetLegalBasisDetail({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { isPending: isSaveLoading, mutate: saveLegalBasis } = useSaveLegalBasis({
    onSuccess: () => {
      setDirtyMsg(undefined);
    },
  });

  const handleSave = async ({ goToNext }: {goToNext?: boolean}) => {
    const description = await convertToDocx(container);
    saveLegalBasis({
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
    url: 'mip.hr.saveLegal',
  });

  return {
    container,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isLegalBasisFetching,
    isSaveLoading,
    isWordEditorEmpty,
    legalBasisDetail,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  };
};

export default useLegalBasis;
