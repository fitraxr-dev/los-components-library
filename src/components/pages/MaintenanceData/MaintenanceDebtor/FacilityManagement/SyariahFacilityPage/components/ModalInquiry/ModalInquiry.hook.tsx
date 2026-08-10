import { useState } from 'react';

import { useTheme } from '@mui/material';

import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import useDebounce from '@/hooks/useDebounce';
import useSessionStorage from '@/hooks/useSessionStorage';


const useModalInquiry = () => {
  const theme = useTheme();
  const HEIGHT = `calc(${theme.typography.body3.fontSize} + ${theme.spacing(
    3
  )})`;

  const [localValue, setLocalValue] = useState<Record<string, any>>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [cifValue, setCifValue] = useSessionStorage('facility-syariah-cif', {
    id: 0,
    label: '',
  });

  const debouncedValue = useDebounce(searchValue, 500);

  const { data, isFetching: isLoading } = useGetAllDebtor({
    filter: {},
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: {
      key: 'md.cif',
      value: debouncedValue,
    },
    sortList: {
      columnName: 'md.cif',
      sortType: 'ASC',
    },
  }, { enabled: debouncedValue.length >= 3 });

  const listCifOption = data?.data?.contents?.filter((item) => item.cif !== null).map((debtor) => ({
    id: debtor.id,
    label: debtor.cif,
  }));

  return {
    HEIGHT,
    cifValue,
    debouncedValue,
    isLoading,
    listCifOption,
    localValue,
    searchValue,
    setCifValue,
    setLocalValue,
    setSearchValue,
    theme,
  };
};

export default useModalInquiry;
