import { useContext, useState } from 'react';

import { useParams } from 'next/navigation';


import { mup } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import { parseNumber } from '@/helpers/utils';
import useGetDetailRiskProfile from '@/hooks/services/mip/risk-profile/useGetDetailRiskProfile';
import useSaveRiskProfile from '@/hooks/services/mip/risk-profile/useSaveRiskProfile';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';


export const useEditRiskProfile = () => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { id } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [descriptionContainer, setDescriptionContainer] = useState(null);
  const [mitigationContainer, setMitigationContainer] = useState(null);
  const [responseContainer, setResponseContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    description: true,
    mitigation: true,
    response: true,
  });

  const { data: riskDetailData } = useGetDetailRiskProfile({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const { mutate: saveRiskProfile } = useSaveRiskProfile({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
      showNiceModalV2({ onClose: () => {
        setDescriptionContainer(null);
        setMitigationContainer(null);
        setResponseContainer(null);
        router.push(replacePath(`${mup.RATING_AND_RISK_PROFILE_PAGE}?tab=risk-profile`, {
          processId,
        }));
      }, type: 'success' });
    },
  });

  const handleClickCancel = () => {
    router.push(replacePath(`${mup.RATING_AND_RISK_PROFILE_PAGE}?tab=risk-profile`, {
      processId,
    }));
  };

  const handleSave = async () => {
    const businessResponse = await convertToDocx(responseContainer);
    saveRiskProfile({
      bucketProcessId: processId,
      businessResponse: businessResponse,
      id: parseNumber(id),
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      riskType: riskDetailData?.riskType,
    });
  };

  return {
    descriptionContainer,
    handleClickCancel,
    handleSave,
    isWordEditorEmpty,
    mitigationContainer,
    responseContainer,
    riskDetailData,
    setDescriptionContainer,
    setIsWordEditorEmpty,
    setMitigationContainer,
    setResponseContainer,
  };
};
