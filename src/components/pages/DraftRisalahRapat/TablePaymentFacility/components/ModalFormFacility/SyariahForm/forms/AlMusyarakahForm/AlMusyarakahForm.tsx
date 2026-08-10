import { Box, useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlMusyarakah from './AlMusyarakah.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakah = (props: SyariahFormsProps) => {
  const theme = useTheme();
  const { syariahComponentConfig } = props;

  const {
    masintonChange,
    masintonForm,
    masintonMultiChange,
    Dprofit_share_type,
    Dprofit_share_review,
    currencyDropdownList,
    governmentMandateList,
    Dfund_usage_purpose,
  } = useAlMusyarakah(props);

  // Helper function to get dynamic label from API config
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attr = syariahComponentConfig.attributes.find((a) => a.attributeKey === attributeKey);
    return attr?.attributeLabel || defaultLabel;
  };

  const {
    financing_period,
    government_mandate,
    fund_usage_purpose,
    profit_share_customer,
    profit_share_review,
    profit_share_smi,
    profit_share_type,
    expected_profit,
    remarks,
    currency_partnership_customer,
    partnership_customer_idr,
    exchange_rate_partnership_customer,
    partnership_customer,
    currency_partnership_smi,
    partnership_smi_idr,
    exchange_rate_partnership_smi,
    partnership_smi,
    total_partnership,
  } = masintonForm;

  return (
    <>
      <Input
        label={getLabel('expected_profit', 'Ekspektasi Imbal Hasil')}
        type="text"
        placeholder={getLabel('expected_profit', 'Input Ekspektasi Imbal Hasil')}
        containerSx={{ flex: 1 }}
        value={expected_profit?.value}
        onChange={(val) => masintonChange('expected_profit', val)}
        error={expected_profit?.error}
        helperText={expected_profit?.error && expected_profit?.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('profit_share_smi', 'Nisbah Bagi Hasil SMI (%)')}
        type="text"
        placeholder={getLabel('profit_share_smi', 'Input Nisbah Bagi Hasil SMI (%)')}
        containerSx={{ flex: 1 }}
        value={profit_share_smi.value}
        onChange={(val) => {
          if (/^\d*\.?\d*$/.test(val)) {
            masintonChange('profit_share_smi', val);
          }
        }}
        error={profit_share_smi.error}
        helperText={profit_share_smi.error && profit_share_smi.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('profit_share_customer', 'Nisbah Bagi Hasil Nasabah (%)')}
        type="text"
        placeholder={getLabel('profit_share_customer', 'Nisbah Bagi Hasil Nasabah (%)')}
        containerSx={{ flex: 1 }}
        value={profit_share_customer.value}
        onChange={(val) => {
          if (/^\d*\.?\d*$/.test(val)) {
            masintonChange('profit_share_customer', val);
          }
        }}
        error={profit_share_customer.error}
        helperText={profit_share_customer.error && profit_share_customer.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('profit_share_type', 'Jenis Nisbah Bagi Hasil')}
        type="dropdown"
        placeholder={getLabel('profit_share_type', 'Choose Jenis Nisbah Bagi Hasil')}
        containerSx={{ flex: 1 }}
        dropdownList={Dprofit_share_type}
        value={profit_share_type.value}
        onChange={(val) => masintonChange('profit_share_type', val)}
        error={profit_share_type.error}
        helperText={profit_share_type.error && profit_share_type.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('profit_share_review', 'Review Nisbah Bagi Hasil')}
        type="dropdown"
        placeholder={getLabel('profit_share_review', 'Choose Review Nisbah Bagi Hasil')}
        containerSx={{ flex: 1 }}
        dropdownList={Dprofit_share_review}
        value={profit_share_review.value}
        onChange={(val) => masintonChange('profit_share_review', val)}
        error={profit_share_review.error}
        helperText={profit_share_review.error && profit_share_review.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('financing_period', 'Jangka Waktu Pembiayaan')}
        type="text"
        placeholder={getLabel('financing_period', 'Input Jangka Waktu Pembiayaan')}
        containerSx={{ flex: 1 }}
        value={financing_period.value}
        onChange={(val) => masintonChange('financing_period', val)}
        error={financing_period.error}
        helperText={financing_period.error && financing_period.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('fund_usage_purpose', 'Tujuan Penggunaan Dana Musyarokah')}
        type="dropdown"
        placeholder={getLabel('fund_usage_purpose', 'Choose Tujuan Penggunaan Dana Musyarokah')}
        containerSx={{ flex: 1 }}
        dropdownList={Dfund_usage_purpose}
        value={fund_usage_purpose.value}
        onChange={(val) => masintonChange('fund_usage_purpose', val)}
        error={fund_usage_purpose.error}
        helperText={fund_usage_purpose.error && fund_usage_purpose.errorMessage}
        regex={null}
      />


      <Input
        label="Jaminan/Penugasan pemerintah"
        placeholder="Input Jaminan/Penugasan pemerintah"
        type="dropdown"
        containerSx={{ flex: 1 }}
        dropdownList={governmentMandateList}
        value={government_mandate.value}
        onChange={(val) => masintonChange('government_mandate', val)}
        error={government_mandate.error}
        helperText={government_mandate.error && government_mandate.errorMessage}
      />

      <Input
        type="area"
        label="Keterangan"
        placeholder="Input Keterangan"
        containerSx={{ flex: 1 }}
        rows={4}
        multiline
        value={remarks.value}
        onChange={(val) => masintonChange('remarks', val)}
      />

      <Box
        sx={{
          gridColumn: 'span 2',
        }}
      >
        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ py: theme.spacing(1) }}
        >
          Nominal Pembiayaan:
        </TextStyle>
      </Box>

      <Currency
        label={getLabel('partnership_smi', 'Syirkah SMI')}
        placeholder={getLabel('partnership_smi', 'Syirkah SMI')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_partnership_smi.value, value: partnership_smi.value }}
        onChange={(val) => masintonChange('partnership_smi', val.value)}
        onCurrencyChange={(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_partnership_smi: val,
              exchange_rate_partnership_smi: '1',
              partnership_smi_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_partnership_smi: val,
              exchange_rate_partnership_smi: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={partnership_smi.error}
        helperText={partnership_smi.error && partnership_smi.errorMessage}
      />

      <Currency
        label={getLabel('partnership_customer', 'Syirkah Nasabah / Mitra Syarik SMI')}
        placeholder={getLabel('partnership_customer', 'Syirkah Nasabah / Mitra Syarik SMI')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_partnership_customer.value, value: partnership_customer.value }}
        onChange={(val) => masintonChange('partnership_customer', val.value)}
        onCurrencyChange={(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_partnership_customer: val,
              exchange_rate_partnership_customer: '1',
              partnership_customer_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_partnership_customer: val,
              exchange_rate_partnership_customer: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={partnership_customer.error}
        helperText={partnership_customer.error && partnership_customer.errorMessage}
      />

      {
        currency_partnership_smi.value === 'USD' &&
        <Currency
          label="Kurs Syirkah SMI"
          placeholder="Kurs Syirkah SMI"
          value={{ currency: 'IDR', value: exchange_rate_partnership_smi.value }}
          onChange={(val) => masintonChange('exchange_rate_partnership_smi', val.value)}
          error={exchange_rate_partnership_smi.error}
          helperText={exchange_rate_partnership_smi.error && exchange_rate_partnership_smi.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_partnership_customer.value === 'USD' &&
        <Currency
          label="Kurs Syirkah Nasabah"
          placeholder="Kurs Syirkah Nasabah"
          value={{ currency: 'IDR', value: exchange_rate_partnership_customer.value }}
          onChange={(val) => masintonChange('exchange_rate_partnership_customer', val.value)}
          error={exchange_rate_partnership_customer.error}
          helperText={exchange_rate_partnership_customer.error && exchange_rate_partnership_customer.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_partnership_smi.value === 'USD' &&
        <Currency
          label={getLabel('partnership_smi_idr', 'Syirkah SMI (dalam Rp)')}
          placeholder={getLabel('partnership_smi_idr', 'Syirkah SMI (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: partnership_smi_idr.value }}
          onChange={(val) => masintonChange('partnership_smi_idr', val?.value)}
          disabled
        />
      }

      {
        currency_partnership_customer.value === 'USD' &&
        <Currency
          label={getLabel('partnership_customer_idr', 'Syirkah Nasabah / Mitra Syarik SMI (dalam Rp)')}
          placeholder={getLabel('partnership_customer_idr', 'Syirkah Nasabah / Mitra Syarik SMI (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: partnership_customer_idr.value }}
          onChange={(val) => masintonChange('partnership_customer_idr', val?.value)}
          disabled
        />
      }

      <Currency
        label={getLabel('total_partnership', 'Total Syirkah')}
        placeholder={getLabel('total_partnership', 'Total Syirkah')}
        containerSx={{ flex: 1 }}
        value={{ currency: 'IDR', value: total_partnership.value }}
        onChange={(val) => masintonChange('total_partnership', val?.value)}
        disabled
      />
    </>
  );
};

export default AlMusyarakah;
