import { Box, Checkbox, Tooltip, useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlMusyarakah from './AlMusyarakah.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakah = (props: SyariahFormsProps) => {
  const theme = useTheme();
  const { existing } = props;

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

  const {
    expected_profit_share,
    financing_period,
    fund_usage_purpose,
    profit_share_customer,
    profit_share_review,
    profit_share_smi,
    profit_share_type,
    currency_partnership_customer,
    government_mandate,
    remarks,
    partnership_customer_idr,
    partnership_customer,
    exchange_rate_partnership_customer,
    currency_partnership_smi,
    partnership_smi_idr,
    partnership_smi,
    exchange_rate_partnership_smi,
    total_partnership,
  } = masintonForm;

  return (
    <>
      <Input
        label="Ekspektasi Imbal Hasil"
        type="text"
        placeholder="Input Ekspektasi Imbal Hasil"
        containerSx={{ flex: 1 }}
        value={expected_profit_share.value}
        onChange={(val) => masintonChange('expected_profit_share', val)}
        error={expected_profit_share.error}
        helperText={expected_profit_share.error && expected_profit_share.errorMessage}
        regex={null}
      />

      <Input
        label="Nisbah Bagi Hasil SMI (%)"
        type="text"
        placeholder="Input Nisbah Bagi Hasil SMI (%)"
        containerSx={{ flex: 1 }}
        value={profit_share_smi.value}
        onChange={(val) => masintonChange('profit_share_smi', val)}
        error={profit_share_smi.error}
        helperText={profit_share_smi.error && profit_share_smi.errorMessage}
        regex={null}
      />

      <Input
        label="Nisbah Bagi Hasil Nasabah (%)"
        type="text"
        placeholder="Nisbah Bagi Hasil Nasabah"
        containerSx={{ flex: 1 }}
        value={profit_share_customer.value}
        onChange={(val) => masintonChange('profit_share_customer', val)}
        error={profit_share_customer.error}
        helperText={profit_share_customer.error && profit_share_customer.errorMessage}
        regex={null}
      />

      <Input
        label="Jenis Nisbah Bagi Hasil"
        type="dropdown"
        placeholder="Choose Jenis Nisbah Bagi Hasi"
        containerSx={{ flex: 1 }}
        dropdownList={Dprofit_share_type}
        value={profit_share_type.value}
        onChange={(val) => masintonChange('profit_share_type', val)}
        error={profit_share_type.error}
        helperText={profit_share_type.error && profit_share_type.errorMessage}
        regex={null}
      />

      <Input
        label="Review Nisbah Bagi Hasil"
        type="dropdown"
        placeholder="Choose Review Nisbah Bagi Hasil"
        containerSx={{ flex: 1 }}
        dropdownList={Dprofit_share_review}
        value={profit_share_review.value}
        onChange={(val) => masintonChange('profit_share_review', val)}
        error={profit_share_review.error}
        helperText={profit_share_review.error && profit_share_review.errorMessage}
        regex={null}
      />

      <Input
        label="Jangka Waktu Pembiayaan"
        type="text"
        placeholder="Input Jangka Waktu Pembiayaan"
        containerSx={{ flex: 1 }}
        value={financing_period.value}
        onChange={(val) => masintonChange('financing_period', val)}
        error={financing_period.error}
        helperText={financing_period.error && financing_period.errorMessage}
        regex={null}
      />

      <Input
        label="Tujuan Penggunaan Dana Musyarakah"
        type="dropdown"
        placeholder="Choose Tujuan Penggunaan Dana Musyarakah"
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

      <TextStyle
        variant="body3"
        weight={600}
        color={theme.palette.primary.main}
        sx={{ py: theme.spacing(1) }}
      >
        Nominal Pembiayaan:
      </TextStyle>

      <TextStyle
        variant="body3"
        weight={600}
        color={theme.palette.primary.main}
        sx={{ py: theme.spacing(1) }}
      >

      </TextStyle>

      <Currency
        label="Syirkah SMI"
        placeholder="Syirkah SMI"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_partnership_smi.value, value: partnership_smi.value }}
        onChange={(val) => masintonChange('partnership_smi', val.value)}
        onCurrencyChange= {(val) => {
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
        label="Syirkah Nasabah"
        placeholder="Syirkah Nasabah"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_partnership_customer.value, value: partnership_customer.value }}
        onChange= {(val) => masintonChange('partnership_customer', val.value)}
        onCurrencyChange= {(val) => {
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
          label="Syirkah SMI (dalam Rp)"
          placeholder="Syirkah SMI (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: partnership_smi_idr.value }}
          onChange={(val) => masintonChange('partnership_smi_idr', val?.value)}
          disabled
        />
      }

      {
        currency_partnership_customer.value === 'USD' &&
        <Currency
          label="Syirkah Nasabah (dalam Rp)"
          placeholder="Syirkah Nasabah (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: partnership_customer_idr.value }}
          onChange={(val) => masintonChange('partnership_customer_idr', val?.value)}
          disabled
        />
      }

      <Currency
        label="Total Syirkah"
        placeholder="Total Syirkah"
        containerSx={{ flex: 1 }}
        value={{ currency: 'IDR', value: total_partnership.value }}
        onChange={(val) => masintonChange('total_partnership', val?.value)}
        disabled
      />
    </>
  );
};

export default AlMusyarakah;
