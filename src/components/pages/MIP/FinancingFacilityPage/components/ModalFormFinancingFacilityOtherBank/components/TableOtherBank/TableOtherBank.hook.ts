import { useState } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetParameterListByValue from '@/hooks/services/useGetParameterListByValue';

import type { FormContextValues } from './TableOtherBank.types';


const useTableOtherBank = () => {
  const formMethods = useFormContext();
  const [bankNameModule, setBankNameModule] = useState('');
  const [bankNameKeyword, setBankNameKeyword] = useState('');

  const { selectedBankValue, setSelectedBankValue }: FormContextValues = formMethods.control._options.context;

  const fieldArray = useFieldArray({
    control: formMethods.control,
    name: 'otherBank',
  });

  const { data: bankTypeDropdownList } = useGetParameterList(
    Modules.BANK_TYPE,
    {
      label: 'value1',
      module: 'value2',
      value: 'key',
    }
  );

  const { data: bankNameData, refetch } = useGetParameterListByValue(
    { module: bankNameModule, value: bankNameKeyword },
    {
      label: 'value1',
      value: 'key',
    });

  const bankNameDropdownList = bankNameData.filter((item) => !selectedBankValue.includes(item.value) && item);

  const handleChangeTypeOtherBank = (value) => {
    const bankModule = bankTypeDropdownList.find((item) => item.value === value.value)?.module;
    setBankNameModule(bankModule);
  };

  const handleChangeBank = (currentBankType) => {
    const bankModule = bankTypeDropdownList.find((item) => item.value === currentBankType.id)?.module;
    setBankNameModule(bankModule);
  };

  const handleSelectedBankValue = (initialValue, id: string) => {
    setSelectedBankValue((prev) => {
      if (id) {
        return [
          ...prev,
          id
        ];
      } else {
        return [
          ...prev.filter((item) => item !== initialValue)
        ];
      }
    });
  };

  return {
    bankNameDropdownList,
    bankTypeDropdownList,
    fieldArray,
    handleChangeBank,
    handleChangeTypeOtherBank,
    handleSelectedBankValue,
    setBankNameKeyword,
  };
};

export default useTableOtherBank;
