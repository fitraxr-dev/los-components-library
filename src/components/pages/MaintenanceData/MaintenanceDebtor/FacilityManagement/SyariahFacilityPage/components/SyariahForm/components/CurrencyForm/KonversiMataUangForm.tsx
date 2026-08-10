import { useTheme } from '@mui/material';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import Currency from '@/components/shared/Currency';

import type { TCurrencyProps } from './CurrencyForm.types';


const KonversiMataUangForm = ({ kursProps }: TCurrencyProps) => {
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, {
    label: 'value1',
    rate: 'value2',
    value: 'key',
  });

  const theme = useTheme();

  return (
    <Currency
      isMandatory={true}
      currencyList={currencyDropdownList}
      label="Konversi Mata Uang"
      disabledCurrency
      placeholder="Konversi Mata Uang"
      containerSx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing(3),
      }
      }
      value={{
        currency: 'IDR',
        value: kursProps.value,
      }}
      onChange={kursProps.onChange}
      error={kursProps.error}
      helperText={
        kursProps.error && kursProps.errorMessage
      }
      disabled={kursProps.disabled}
    />
  );
};

export default KonversiMataUangForm;
