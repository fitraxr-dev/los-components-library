import { useContext } from 'react';

import { useTheme } from '@mui/material';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useViewOnly from '@/hooks/useViewOnly';

import { DebtorInformationContext } from '../../DebtorInformation.context';


const useTypeSection = () => {
  const { changePayload, payload } = useContext(DebtorInformationContext);
  const { viewOnly } = useViewOnly();
  const theme = useTheme();

  const { data: typeProcessData } = useGetParameterList(Modules.TYPE_PROCESS);
  const { data: typeSubmissionData } = useGetParameterList(Modules.TYPE_SUBMISSION);
  const { data: typeFinancingData } = useGetParameterList(Modules.FINANCING_TYPE);

  const debtorData = payload.debtor;

  return {
    changePayload,
    debtorData,
    payload,
    theme,
    typeFinancingData,
    typeProcessData,
    typeSubmissionData,
    viewOnly,
  };
};

export default useTypeSection;
