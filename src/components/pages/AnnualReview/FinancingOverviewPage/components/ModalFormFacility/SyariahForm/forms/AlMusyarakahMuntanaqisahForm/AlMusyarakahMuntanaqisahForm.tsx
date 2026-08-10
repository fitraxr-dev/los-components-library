import { Box, Checkbox, Tooltip, useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlMusyarakah from './AlMusyarakahMuntanaqisah.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakahMuntanaqisah = (props: SyariahFormsProps) => {
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
    Dujroh_payment_period,
    Dujroh_review_period,
    Dujroh_review_type,
  } = useAlMusyarakah(props);

  const {
    expected_profit_share,
    currency_hishshah_value,
    currency_partnership_customer,
    currency_partnership_smi_facility,
    currency_ujroh_value,
    exchange_rate_hishshah,
    exchange_rate_partnership_customer,
    exchange_rate_partnership_smi_facility,
    exchange_rate_ujroh,
    financing_period,
    government_mandate,
    hishshah_value,
    hishshah_value_idr,
    mmq_object,
    partnership_customer,
    partnership_customer_idr,
    partnership_smi_facility,
    partnership_smi_facility_idr,
    profit_share_customer,
    profit_share_review,
    profit_share_smi,
    profit_share_type,
    remarks,
    total_partnership,
    ujroh_payment_period,
    ujroh_review_type,
    ujroh_review_periods,
    ujroh_value,
    ujroh_value_idr,
  } = masintonForm;

  return (
    <>
      <Input
        label="Object MMQ"
        type="text"
        placeholder="Input Object MMQ"
        containerSx={{ flex: 1 }}
        value={mmq_object.value}
        onChange={(val) => masintonChange('mmq_object', val)}
        disabled={existing}
        error={mmq_object.error}
        helperText={mmq_object.error && mmq_object.errorMessage}
        regex={null}
      />

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
        label="Periode Pembayaran Ujroh/Sewa"
        type="dropdown"
        placeholder="Choose Periode Pembayaran Ujroh/Sewa"
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_payment_period}
        value={ujroh_payment_period.value}
        onChange={(val) => masintonChange('ujroh_payment_period', val)}
        error={ujroh_payment_period.error}
        helperText={ujroh_payment_period.error && ujroh_payment_period.errorMessage}
        regex={null}
      />

      <Input
        label="Jenis Review Ujroh/Sewa"
        type="dropdown"
        placeholder="Choose Jenis Review Ujroh/Sewa"
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_review_type}
        value={ujroh_review_type.value}
        onChange={(val) => masintonChange('ujroh_review_type', val)}
        error={ujroh_review_type.error}
        helperText={ujroh_review_type.error && ujroh_review_type.errorMessage}
        regex={null}
      />

      <Input
        label="Masa Review Ujroh/Sewa"
        type="dropdown"
        placeholder="Choose Masa Review Ujroh/Sewa"
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_review_period}
        value={ujroh_review_periods.value}
        onChange={(val) => masintonChange('ujroh_review_periods', val)}
        error={ujroh_review_periods.error}
        helperText={ujroh_review_periods.error && ujroh_review_periods.errorMessage}
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

      </TextStyle>

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
        value={{ currency: currency_partnership_smi_facility.value, value: partnership_smi_facility.value }}
        onChange={(val) => masintonChange('partnership_smi_facility', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_partnership_smi_facility: val,
              exchange_rate_partnership_smi_facility: '1',
              partnership_smi_facility_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_partnership_smi_facility: val,
              exchange_rate_partnership_smi_facility: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={partnership_smi_facility.error}
        helperText={partnership_smi_facility.error && partnership_smi_facility.errorMessage}
      />

      <Currency
        label="Syirkah Nasabah"
        placeholder="Syirkah Nasabah"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_partnership_customer.value, value: partnership_customer.value }}
        onChange={(val) => masintonChange('partnership_customer', val.value)}
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
        currency_partnership_smi_facility.value === 'USD' &&
        <Currency
          label="Kurs Syirkah SMI"
          placeholder="Kurs Syirkah SMI"
          value={{ currency: 'IDR', value: exchange_rate_partnership_smi_facility.value }}
          onChange={(val) => masintonChange('exchange_rate_partnership_smi_facility', val.value)}
          error={exchange_rate_partnership_smi_facility.error}
          helperText=
            {exchange_rate_partnership_smi_facility.error && exchange_rate_partnership_smi_facility.errorMessage}
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
        currency_partnership_smi_facility.value === 'USD' &&
        <Currency
          label="Syirkah SMI (dalam Rp)"
          placeholder="Syirkah SMI (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: partnership_smi_facility_idr.value }}
          onChange={(val) => masintonChange('partnership_smi_facility_idr', val?.value)}
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
        label="Nilai Hishshah"
        placeholder="Nilai Hishshah"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_hishshah_value.value, value: hishshah_value.value }}
        onChange={(val) => masintonChange('hishshah_value', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_hishshah_value: val,
              exchange_rate_hishshah: '1',
              hishshah_value_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_hishshah_value: val,
              exchange_rate_hishshah: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={hishshah_value.error}
        helperText={hishshah_value.error && hishshah_value.errorMessage}
      />

      <Currency
        label="Nilai Ujroh/Sewa"
        placeholder="Nilai Ujroh/Sewa"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_ujroh_value.value, value: ujroh_value.value }}
        onChange={(val) => masintonChange('ujroh_value', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_ujroh_value: val,
              exchange_rate_ujroh: '1',
              ujroh_value_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_ujroh_value: val,
              exchange_rate_ujroh: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={ujroh_value.error}
        helperText={ujroh_value.error && ujroh_value.errorMessage}
      />

      {
        currency_hishshah_value.value === 'USD' &&
        <Currency
          label="Kurs Hishshah"
          placeholder="Kurs Hishshah"
          value={{ currency: 'IDR', value: exchange_rate_hishshah.value }}
          onChange={(val) => masintonChange('exchange_rate_hishshah', val.value)}
          error={exchange_rate_hishshah.error}
          helperText={exchange_rate_hishshah.error && exchange_rate_hishshah.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_ujroh_value.value === 'USD' &&
        <Currency
          label="Kurs Ujroh/Sewa"
          placeholder="Kurs Ujroh/Sewa"
          value={{ currency: 'IDR', value: exchange_rate_ujroh.value }}
          onChange={(val) => masintonChange('exchange_rate_ujroh', val.value)}
          error={exchange_rate_ujroh.error}
          helperText={exchange_rate_ujroh.error && exchange_rate_ujroh.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_hishshah_value.value === 'USD' &&
        <Currency
          label="Nilai Hishshah (dalam Rp)"
          placeholder="Nilai Hishshah (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: hishshah_value_idr.value }}
          onChange={(val) => masintonChange('hishshah_value_idr', val?.value)}
          disabled
        />
      }

      {
        currency_ujroh_value.value === 'USD' &&
        <Currency
          label="Nilai Ujroh/Sewa (dalam Rp)"
          placeholder="Nilai Ujroh/Sewa (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: ujroh_value_idr.value }}
          onChange={(val) => masintonChange('ujroh_value_idr', val?.value)}
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

export default AlMusyarakahMuntanaqisah;
