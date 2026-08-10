import { useContext, useMemo, useState } from 'react';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useHighRiskContext } from '@/components/layouts/HighRiskLayout/HighRisk.context';

import useGetComplianceAnalysis from './hooks/useGetComplianceAnalysis';
import useSaveComplianceAnalysis from './hooks/useSaveComplianceAnalysis';

import type { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';


export const useComplianceAnalysis = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [payload, setPayload] = useState(null);
  const { goToNextStep } = useHighRiskContext();
  const { viewOnly } = useViewOnly();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [container, setContainer] = useState<DocumentEditorContainerComponent>(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    complianceAnalysisDesc: true,
  });

  const { data: complianceAnalysisData, isPending: isComplianceAnalysisLoading } = useGetComplianceAnalysis({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const { isPending: isSaveLoading, mutate: saveComplianceAnalysis } = useSaveComplianceAnalysis({
    onSuccess: () => {

      setDirtyMsg(undefined);

      recordActivity({
        activity: complianceAnalysisData ? ActivityType.EDIT : ActivityType.ADD,
        bucketProcessId: processId,
        changeAfter: payload ? JSON.stringify({ ...payload, description: '[FILE_DOCX]' }) : null,
        changeBefore: complianceAnalysisData ? JSON.stringify({ ...complianceAnalysisData, description: '[FILE_DOCX]' }) : null,
        module: TypeModule.HIGH_RISK,
        process: TypeProcess.HIGH_RISK_DK,
        remarks: complianceAnalysisData
          ? 'Edit Compliance Analysis Document'
          : 'Add new Compliance Analysis Document',
      });
    },
  });

  const handleSave = async ({ goToNext }: { goToNext?: boolean }) => {
    const description = await convertToDocx(container);
    setPayload({ bucketProcessId: processId,
      description: description,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK });

    saveComplianceAnalysis({
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
    url: 'mip.hr.saveCompliance',
  });

  return {
    complianceAnalysisData,
    container,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isComplianceAnalysisLoading,
    isSaveLoading,
    isWordEditorEmpty,
    setContainer,
    setIsWordEditorEmpty,
    viewOnly,
  };
};
