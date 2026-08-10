import { useState } from 'react';

import { useParams } from 'next/navigation';


import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import { parseNumber } from '@/helpers/utils';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import useGetDetailRiskProfileById from '../hooks/useGetDetailRiskProfileById';
import useSaveRiskProfile from '../hooks/useSaveRiskProfile';


export const useEditRiskProfile = () => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { id } = useParams();
  const [descriptionContainer, setDescriptionContainer] = useState(null);
  const [mitigationContainer, setMitigationContainer] = useState(null);
  const [responseContainer, setResponseContainer] = useState(null);
  const [isWordEditorEmpty, setIsWordEditorEmpty] = useState({
    description: true,
    mitigation: true,
    response: true,
  });

  const { data: riskDetailData } = useGetDetailRiskProfileById({ id: parseNumber(id) });

  const { mutate: saveRiskProfile } = useSaveRiskProfile({
    onSuccess: () => {
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
