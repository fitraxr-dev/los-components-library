import { useState } from 'react';


import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetRiskProfileList from '../../hook/useGetRiskProfileList';


export const useRiskProfileTable = () => {
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();

  const { data: responseData } = useGetRiskProfileList({
    bucketProcessId: processId,
    module: TypeModule.MUP,
    process: TypeProcess.MUP,
  });

  const handleOpenEditModal = (id: number) => {
    router.push(replacePath(
      mup.RATING_AND_RISK_PROFILE_EDIT_PAGE,
      { id: id, processId: processId }
    ));
  };

  const riskProfileList = responseData?.contents || [];

  return {
    handleOpenEditModal,
    riskProfileList,
    viewOnly,
  };
};
