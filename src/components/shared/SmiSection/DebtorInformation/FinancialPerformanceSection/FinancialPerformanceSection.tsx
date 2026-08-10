import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CURRENCY_LIST } from '@/configs/constants';
import { formatNumber } from '@/helpers/utils';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';

import type { FinancialPerformanceSectionProps } from './FinancialPerformanceSection.types';


const FinancialPerformanceSection = (props: FinancialPerformanceSectionProps) => {
  const { viewOnly = false, control } = props;
  const theme = useTheme();

  return (
    <SectionTitle title="Kinerja Keuangan" isOpen>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginTop: 3,
        }}
      >
        <Controller
          control={control}
          name="performanceFinancial.performanceFinancialDate"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Input
              widthMonthWrapper="3"
              widthYearWrapper="3.5"
              {...field}
              disabled={viewOnly}
              type="date"
              popper={{
                placement: 'right',
              }}
              containerSx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
              }}
              label="As Of:"
              placeholder="Choose Bulan & Tahun Kinerja Keuangan"
              format="MM/YYYY"
              views={['year', 'month']}
              onChange={(val) => onChange(val.toISOString())}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <div />
        <Controller
          control={control}
          name="performanceFinancial.assets"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Currency
              {...field}
              disabled={viewOnly}
              placeholder="Input Assets"
              label="Input Assets"
              containerSx={{ flex: 1 }}
              currencyList={CURRENCY_LIST}
              onChange={(val) => {
                onChange({
                  currency: val.currency,
                  value: formatNumber(val.value),
                });
              }}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="performanceFinancial.liability"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Currency
              {...field}
              disabled={viewOnly}
              placeholder="Input Liabilitas"
              label="Input Liabilitas"
              containerSx={{ flex: 1 }}
              currencyList={CURRENCY_LIST}
              onChange={(val) => {
                onChange({
                  currency: val.currency,
                  value: formatNumber(val.value),
                });
              }}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="performanceFinancial.income"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Currency
              {...field}
              disabled={viewOnly}
              placeholder="Input Pendapatan"
              label="Input Pendapatan"
              containerSx={{ flex: 1 }}
              currencyList={[
                { label: 'IDR', value: 'IDR' },
                { label: 'USD', value: 'USD' },
              ]}
              onChange={(val) => {
                onChange({
                  currency: val.currency,
                  value: formatNumber(val.value),
                });
              }}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="performanceFinancial.netProfit"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Currency
              {...field}
              disabled={viewOnly}
              placeholder="Input Laba Bersih"
              label="Input Laba Bersih"
              containerSx={{ flex: 1 }}
              currencyList={[
                { label: 'IDR', value: 'IDR' },
                { label: 'USD', value: 'USD' },
              ]}
              onChange={(val) => {
                onChange({
                  currency: val.currency,
                  value: formatNumber(val.value),
                });
              }}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="performanceFinancial.ebitda"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Currency
              {...field}
              disabled={viewOnly}
              placeholder="Input Ebitda"
              label="Input Ebitda"
              containerSx={{ flex: 1 }}
              currencyList={[
                { label: 'IDR', value: 'IDR' },
                { label: 'USD', value: 'USD' },
              ]}
              onChange={(val) => {
                onChange({
                  currency: val.currency,
                  value: formatNumber(val.value),
                });
              }}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="performanceFinancial.equity"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Currency
              {...field}
              disabled={viewOnly}
              placeholder="Input Ekuitas"
              label="Input Ekuitas"
              containerSx={{ flex: 1 }}
              currencyList={[
                { label: 'IDR', value: 'IDR' },
                { label: 'USD', value: 'USD' },
              ]}
              onChange={(val) => {
                onChange({
                  currency: val.currency,
                  value: formatNumber(val.value),
                });
              }}
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
      </Box>
    </SectionTitle>
  );
};

export default FinancialPerformanceSection;
