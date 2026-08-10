import useGetParameterList from '@/hooks/services/useGetParameterList';
import useViewOnly from '@/hooks/useViewOnly';

import { useDebtorInfoProfile } from '../../DebtorInfoProfile.hook';


const useBusinessandAddress = () => {
  const {
    watch,
    isDpopDivision,
  } = useDebtorInfoProfile();
  const { viewOnly } = useViewOnly();
  const isViewOnly = viewOnly;
  const { data: businessEntityForm } = useGetParameterList('apBusinessEntityForm ');

  const formatString = (val) => {
    let label = '';
    if (typeof val === 'object' && val !== null) {
      label = val?.value?.toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');
    } else {
      if (val?.length) {
        label = val.toLowerCase()
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
          .join(' ');
      }
    }

    return label;
  };
  const findBisnisEntityFormLabel = (val: string) => businessEntityForm?.find((item) => item?.value === val)?.label;

  return {
    businessEntityForm,
    findBisnisEntityFormLabel,
    formatString,
    isDpopDivision,
    isViewOnly,
    watch,
  };
};

export default useBusinessandAddress;
