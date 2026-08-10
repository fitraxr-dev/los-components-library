import { useContext, useState } from 'react';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetDetailRiskIdentification from '@/hooks/services/mip/identification-legal-risk/useGetDetailRiskIdentification';
import useSaveRiskIdentification from '@/hooks/services/mip/identification-legal-risk/useSaveRiskIdentification';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';


const useLegalAndComplianceIssue = () => {
  const [state] = useApp();
  const { processId } = useIdentity();
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [container, setContainer] = useState(null);

  const { data: stepperData } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { data, isLoading: isRiskIdentificationLoading } = useGetDetailRiskIdentification({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
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
      shouldGoNext ? goToNextStep() : null;
    },
  });
  const riskIdentificationDataContents = data?.riskDescription;

  const handleSave = async () => {
    const description = await convertToDocx(container);
    saveRiskIdentification({
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.MIP_REVIEW,
      riskDescription: description,
    });
  };

  return {
    container,
    handleSave,
    isRiskIdentificationLoading,
    isSaveLoading,
    processId,
    riskIdentificationDataContents,
    setContainer,
    setShouldGoNext,
    stepperStatus: stepperData?.from,
    stepperSteps: stepperData?.steps,
    viewOnly,
  };
};

export default useLegalAndComplianceIssue;
