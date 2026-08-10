import { useContext, useEffect, useMemo, useState } from 'react';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailRiskIdentification from '@/hooks/services/mip/identification-legal-risk/useGetDetailRiskIdentification';
import useSaveRiskIdentification from '@/hooks/services/mip/identification-legal-risk/useSaveRiskIdentification';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import { useMUPAccess } from '@/components/pages/MUP/hooks/useMUPAccess';


const useLegalAndComplianceIssue = () => {
  const { processId } = useIdentity();
  const { goToNextStep } = useMUPContext();
  const { viewOnly: globalViewOnly } = useViewOnly();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { recordActivity } = useRecordLog();
  const { baseMUPAccess, isAnalyst } = useMUPAccess();

  const [container, setContainer] = useState(null);

  const isViewOnly = globalViewOnly || isAnalyst || !baseMUPAccess.canUpdate;

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: 'Initialize Legal and Compliance Issue page',
        component: 'LegalAndComplianceIssuePage',
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'Initialize Legal and Compliance Issue page',
    });
  }, [processId, recordActivity]);

  const { data, isLoading: isRiskIdentificationLoading } = useGetDetailRiskIdentification({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { isPending: isSaveLoading, mutate: saveRiskIdentification } = useSaveRiskIdentification({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });
  const riskIdentificationDataContents = data?.riskDescription;

  const handleSave = async (shouldGoNext = false) => {
    if (isViewOnly) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        changeAfter: JSON.stringify({
          action: 'Navigating to next step in view-only mode',
          component: 'LegalAndComplianceIssuePage',
        }),
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: 'Moving to next step from Legal and Compliance Issue page',
      });
      goToNextStep();
      return;
    }

    const description = await convertToDocx(container);

    await recordActivity({
      activity: ActivityType.SAVE,
      bucketProcessId: processId,
      changeAfter: JSON.stringify({
        action: shouldGoNext ? 'Saved Legal and Compliance Issue data and proceeding to next step' : 'Saved Legal and Compliance Issue data',
        component: 'LegalAndComplianceIssuePage',
        contentSaved: !!description,
      }),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: 'Saved Legal and Compliance Issue information',
    });

    saveRiskIdentification(
      {
        bucketProcessId: processId,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        riskDescription: description,
      },
      {
        onSuccess: () => shouldGoNext && goToNextStep(),
      }
    );
  };

  const autoSavePayload = useMemo(() => async () => {
    if (!container) return null;

    const description = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      riskDescription: description,
    };
  }, [container, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } },
    isActive: !isViewOnly && !!processId,
    payload: autoSavePayload,
    url: 'mip.identificationLegalRisk.save',
  });

  return {
    container,
    goToNextStep,
    handleSave,
    isAutoSaveFetching,
    isRiskIdentificationLoading,
    isSaveLoading,
    isViewOnly,
    processId,
    riskIdentificationDataContents,
    setContainer,
  };
};

export default useLegalAndComplianceIssue;
