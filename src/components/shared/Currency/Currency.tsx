'use client';
import * as React from 'react';

import { useTheme } from '@mui/material';

import { CURRENCY_LIST } from '@/configs/constants';
import { formatCurrency } from '@/helpers/formatCurrency';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input/';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import Text from '../Input/components/Text';

import type { CurrencyProps } from './Currency.types';


const normalizeToNumber = (input?: number | string): number | undefined => {
  if (input === null || input === undefined) return undefined;
  if (typeof input === 'number') return Number.isFinite(input) ? input : undefined;
  const cleaned = String(input).replace(/,/g, '').trim();
  if (cleaned === '') return undefined;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
};

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
    suffix,
    onChange = () => { },
    onCurrencyChange = () => { },
    placeholder = 'Please select something',
    currencyList = CURRENCY_LIST,
    value,
    maxLength,
    error,
    helperText,
    hasDataMaster,
    currHasDataMaster,
    inputSx,
    maxAmount,
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

  const maxAmountNum = React.useMemo(() => normalizeToNumber(maxAmount), [maxAmount]);

  // Stores the decimal part (e.g. '.12') when switching to IDR, to restore later
  const savedDecimalRef = React.useRef<string>('');

  const handleCurrencyChange = (val) => {
    const currentValue = value?.value ?? '';
    const switchingToIDR = val === 'IDR';
    const switchingFromIDR = value?.currency === 'IDR' && val !== 'IDR';

    let newValue = currentValue;

    if (switchingToIDR) {
      // Save decimal part (e.g. '123.12' → save '.12', pass '123')
      const dotIndex = currentValue.indexOf('.');
      if (dotIndex !== -1) {
        savedDecimalRef.current = currentValue.slice(dotIndex); // '.12'
        newValue = currentValue.slice(0, dotIndex); // '123'
      } else {
        savedDecimalRef.current = '';
      }
    } else if (switchingFromIDR) {
      // Restore decimal part (e.g. '123' + '.12' → '123.12')
      if (savedDecimalRef.current) {
        newValue = currentValue + savedDecimalRef.current;
        savedDecimalRef.current = '';
      }
    }

    onChange({ currency: val, value: newValue });
    onCurrencyChange(val);
  };

  const isIDR = value?.currency === 'IDR';

  const handleValueChange = (val) => {
    // Strip leading zero (e.g. 01 → 1)
    let normalized = val.replace(/^0(?=\d)/, '');
    // For IDR: discard any decimal part (decimalScale=0 blocks dot input natively)
    if (isIDR) {
      normalized = normalized.split('.')[0];
    }
    onChange({
      ...value,
      value: normalized,
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
          dataChanges={!!hasDataMaster}
          inputSx={{ ...styleDataMaster, ...inputSx }}
          type="number"
          disabled={!value?.currency || disabled}
          value={value?.value ?? ''}
          decimalScale={isIDR ? 0 : 2}
          thousandSeparator=","
          suffix={isIDR ? suffix : undefined}
          onValueChange={(values: { value: string; floatValue?: number }) => {
            if (
              maxAmountNum !== undefined &&
              values?.floatValue !== undefined &&
              values.floatValue > maxAmountNum
            ) {
              const clamped = maxAmountNum.toFixed(2);
              handleValueChange(clamped);
              return;
            }
            handleValueChange(values?.value);
          }}
          isAllowed={(values: { value: string; floatValue?: number }) => {
            const raw = values?.value ?? '';
            if (typeof maxLength === 'number' && raw.length > maxLength) {
              return false;
            }
            if (
              maxAmountNum !== undefined &&
              values?.floatValue !== undefined &&
              values.floatValue > maxAmountNum
            ) {
              return false;
            }
            return true;
          }}
        />
      </RowWrapper>
      {hasDataMaster &&
        <TextStyle sx={{ pt: 1 }} weight={500}>Data Sebelumnya : {formatCurrency(hasDataMaster.toString())}</TextStyle>}
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
    </ColumnWrapper>
  );
};

export default Currency;
