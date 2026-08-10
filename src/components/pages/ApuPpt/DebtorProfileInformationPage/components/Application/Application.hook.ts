import { useTheme } from '@mui/material';

import useGetParameterList from '@/hooks/services/useGetParameterList';

import { useDebtorInfoProfile } from '../../DebtorInfoProfile.hook';


const useApplication = () => {
  const {
    isDpopDivision,
  } = useDebtorInfoProfile();
  const theme = useTheme();
  const { data: applicationCategory } = useGetParameterList('apApplicationCategory');
  const { data: applicationType } = useGetParameterList('apApplicationType');

  const optionPurpose = { id: 'id', label: 'value1', value: 'key' };
  const { data: applicationPurpose } = useGetParameterList('apApplicationPurpose ', optionPurpose);
  const findLabelAplicationType = (val: string) => applicationType?.find((item) => item?.value === val)?.label;
  const findLabelAplicationCategory = (val: string) => applicationCategory?.find((item) => item?.value === val)?.label;


  return {
    applicationCategory,
    applicationPurpose,
    applicationType,
    findLabelAplicationCategory,
    findLabelAplicationType,
    isDpopDivision,
    theme,
  };
};

export default useApplication;
