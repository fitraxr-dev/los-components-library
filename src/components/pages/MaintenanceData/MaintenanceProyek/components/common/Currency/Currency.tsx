'use client';
import { useTheme } from '@mui/material';

import { CURRENCY_LIST } from '@/configs/constants';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input/';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


import type { CurrencyProps } from '@/components/shared/Currency/Currency.types';


const Currency = ({
  label = '',
  labelProps = {},
  containerSx = {},
  ...props
}: CurrencyProps) => {
  const theme = useTheme();

  const {
    id,
    testId,
    disabled,
    disabledCurrency,
    onChange = () => { },
    onCurrencyChange = () => {},
    placeholder = 'Please select something',
    currencyList = CURRENCY_LIST,
    value,
    maxLength,
    error,
    helperText,
    hasDataMaster,
    currHasDataMaster,
    inputSx,
  } = props;

  const styleDataMaster = {
    backgroundColor: (hasDataMaster || currHasDataMaster) && '#FCE6E8',
  };

  const styDropdown = {
    '.MuiSelect-select': {
      minHeight: '0px !important',
    },
    backgroundColor: '#FCE6E8',
    mr: theme.spacing(1),
    width: '6.9vw',
    ...styleDataMaster,
  };

  const handleCurrencyChange = (val) => {
    onChange({
      currency: val,
      value: value?.value ?? '',
    });
    onCurrencyChange(val);
  };

  const handleValueChange = (val) => {
    onChange({
      ...value,
      value: val.replace(/^0(?=\d)/, ''),
    });
  };

  return (
    <ColumnWrapper sx={{ ...containerSx }}>
      <RowWrapper >
        <Text {...props}>{label}</Text>
      </RowWrapper>
      <RowWrapper>
        <Input
          id={`currency-${id}`}
          data-testid={`currency-${testId}`}
          type="dropdown"
          disabled={disabled || disabledCurrency}
          dropdownList={currencyList}
          value={value?.currency}
          onChange={handleCurrencyChange}
          inputSx={styDropdown}
          error={error}
        />
        <Input
          id={`value-${id}`}
          data-testid={`value-${testId}`}
          containerSx={{ flex: 1 }}
          error={error}
          placeholder={placeholder}
          inputSx={{ ...styleDataMaster, ...inputSx }}
          type="number"
          disabled={!value?.currency || disabled}
          value={value?.value ?? ''}
          decimalScale={2}
          onValueChange={(values) => {
            handleValueChange(values?.value);
          }}
          isAllowed={({ value }: { value: string }) => {
            if (value.length > maxLength) {
              return false;
            }
            return true;
          }}
          thousandSeparator=","
        />
      </RowWrapper>
      {helperText && (
        <TextStyle
          variant="body7"
          color={error ? theme.palette.error.main : theme.palette.primary.main}
          weight={500}
          mt={1}
        >
          {helperText}
        </TextStyle>
      )}
      {hasDataMaster && (
        <TextStyle sx={{ pt: 1 }} weight={500}>
          Data Sebelumnya : {hasDataMaster}
        </TextStyle>
      )}
    </ColumnWrapper>
  );
};

export default Currency;
