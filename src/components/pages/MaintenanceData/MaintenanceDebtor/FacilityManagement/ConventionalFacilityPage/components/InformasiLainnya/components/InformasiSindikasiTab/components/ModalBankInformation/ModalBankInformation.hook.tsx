import { useMemo, useState } from 'react';

import useGetParameterListRaw from '@/hooks/services/useGetParameterListRaw';

import type { ModalBankInformationProps } from './ModalBankInformation.types';


const useModalBankInformation = ({
  addData,
  initialAmount,
  initialBankName,
  initialBankType,
  fieldData,
}: ModalBankInformationProps) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [bankName, setBankName] = useState<string>(initialBankName);
  const [bankType, setBankType] = useState<string>(initialBankType);

  const { data: bankTypeList } = useGetParameterListRaw('bankType');
  const bankTypeOptions = useMemo(() => bankTypeList.map((item) => ({
    id: item.value2,
    label: item.value1,
  })), [bankTypeList]);

  const { data: bankList } = useGetParameterListRaw(bankType);
  const bankOptions = useMemo(() => bankList.map((item) => ({
    id: item.value1,
    label: item.value1,
  })), [bankList]);

  const excludedLabels = new Set(fieldData?.map((field) => field?.bankName));

  const filteredBanks = bankOptions?.filter((bank) => !excludedLabels.has(bank?.id));

  type Option = { label: string; id: string };

  const byValue = (v?: string, list?: Option[]) =>
    (v && list?.find((o) => o?.id === v)) ?? null;

  return {
    amount,
    bankName,
    bankOptions,
    bankType,
    bankTypeOptions,
    byValue,
    filteredBanks,
    setAmount,
    setBankName,
    setBankType,
  };
};
export default useModalBankInformation;
