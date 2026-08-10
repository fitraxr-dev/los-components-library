import { useEffect, useMemo } from 'react';

import { useTheme } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber, parseNumber } from '@/helpers/utils';
import useGetDebtorNameset from '@/hooks/services/useGetDebtorNameset';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useGetDebtSecurityById from '../hooks/useGetDebtSecuritiesById';
import useSaveDebtSecuritiesDebtor from '../hooks/useSaveDebtSecuritiesDebtor';


const useDetailPage = () => {
  const theme = useTheme();
  const { processId, debtorId } = useIdentity();
  const { data } = useGetDebtSecurityById({ id: +processId });
  const { data: institutionTypeDropdownList } = useGetParameterList('institutionType');

  const { control, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      bonds: '',
      currExchangeRate: '',
      currFaceValue: '',
      debtorId: '',
      debtorName: '',
      exchangeRate: {
        currency: '',
        value: '',
      },
      faceValue: {
        currency: '',
        value: '',
      },
      faceValueInIdr: {
        currency: '',
        value: '',
      },
      id: null,
      institutionTypeId: '',
      issuer: '',
      maturityDate: '',
      seq: '',
    },
  });

  const getValuesNominal = useMemo(() => {
    const { faceValue, exchangeRate } = watch();

    const faceValueNominal = parseNumber(faceValue.value);
    const exchangeRateValue = parseNumber(exchangeRate.value);

    switch (faceValue.currency) {
      case 'USD':
        return {
          currency: 'IDR',
          value: formatNumber((faceValueNominal * exchangeRateValue).toString()),
        };

      default:
        return {
          currency: 'IDR',
          value: formatNumber((faceValueNominal).toString()),
        };
    }
  }, [watch('faceValue'), watch('exchangeRate')]);

  const faceValue = useWatch({
    control,
    defaultValue: {
      currency: '',
      value: '',
    },
    name: 'faceValue',
  });

  useEffect(() => {
    if (data) {
      const { exchangeRate, currFaceValue, faceValue, faceValueInIdr } = data;

      reset({
        id: data.id,
        ...data,
        exchangeRate: {
          currency: 'IDR',
          value: exchangeRate,
        },
        faceValue: {
          currency: currFaceValue,
          value: faceValue,
        },
        faceValueInIdr: {
          currency: 'IDR',
          value: faceValueInIdr,
        },
        institutionTypeId: data.institutionType,
      });
    }
  }, [data]);

  const institutionTypeId: string = useWatch({ control: control, defaultValue: '', name: 'institutionTypeId' });

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(institutionTypeId);

  const { mutate } = useSaveDebtSecuritiesDebtor(
    {
      onError: () => {
        showNiceModalV2({
          title: 'Gagal Menyimpan Data',
          type: 'error',
        });
      },
      onSuccess: () => {
        showNiceModalV2({
          title: 'Berhasil Menyimpan Data',
          type: 'success',
        });
      },
    }
  );

  const saveData = (data) => {
    mutate({
      bonds: data.bonds,
      currExchangeRate: data.exchangeRate.currency,
      currFaceValue: data.faceValue.currency,
      debtorId: debtorId,
      debtorName: data.debtorName,
      exchangeRate: data.exchangeRate.value,
      faceValue: data.faceValue.value,
      faceValueInIdr: getValuesNominal.value,
      id: data.id,
      institutionType: data.institutionTypeId,
      issuer: data.issuer,
      maturityDate: data.maturityDate,
      seq: data.seq,
    });
  };

  const { data: dataNameSet, isPending: isNamesetLoading } = useGetDebtorNameset({
    institution: watch('institutionTypeId'),
  }, { enabled: isPemda });


  const nameset = useMemo(() => {
    if (dataNameSet) {
      if (institutionTypeId === DebtorNamesetResponseDtoRegionalGovernEnum.CENTRALGOVERNMENT) {
        return [{ id: 'OTHERS', label: 'OTHERS' }];
      } else {
        return dataNameSet.data.map((val) => ({
          id: val.name,
          label: val.name,
        }));
      }
    } else {
      return [];
    }
  }, [dataNameSet]);

  return {
    control,
    faceValue,
    getValuesNominal,
    handleSubmit,
    institutionTypeDropdownList,
    isPemda,
    nameset,
    saveData,
    theme,
    watch,
  };
};

export default useDetailPage;
