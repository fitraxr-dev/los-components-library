import { Box, useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlMusyarakahMutanaqisah from './AlMusyarakahMutanaqisahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakahMutanaqisahForm = (props: SyariahFormsProps) => {
  const { existing, syariahComponentConfig } = props;
  const theme = useTheme();

  const {
    governmentMandateList,
    masintonChange,
    masintonForm,
    currencyDropdownList,
    Dprofit_share_type,
    Dprofit_share_review,
    Dujroh_review_type,
    Dujroh_payment_period,
    masintonMultiChange,
    Dujroh_review_period,
  } = useAlMusyarakahMutanaqisah(props);

  // Helper function to get dynamic label from API config
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attribute = syariahComponentConfig.attributes.find(
      (attr) => attr.attributeKey === attributeKey
    );
    return attribute?.attributeLabel || defaultLabel;
  };

  const {
    mmq_object,
    profit_share_smi,
    profit_share_customer,
    expected_profit,
    government_mandate,
    remarks,
    partnership_smi_facility,
    currency_partnership_smi_facility,
    exchange_rate_partnership_smi_facility,
    partnership_smi_facility_idr,
    partnership_customer,
    currency_partnership_customer,
    exchange_rate_partnership_customer,
    partnership_customer_idr,
    profit_share_review,
    profit_share_type,
    financing_period,
    ujroh_payment_period,
    ujroh_review_type,
    ujroh_review_period,
    hishshah_value,
    currency_hishshah_value,
    exchange_rate_hishshah,
    hishshah_value_idr,
    ujroh_value,
    currency_ujroh_value,
    exchange_rate_ujroh,
    ujroh_value_idr,
    total_partnership,
  } = masintonForm;

  return (
    <>
      <Input
        label={getLabel('mmq_object', 'Objek MMQ')}
        type="text"
        placeholder={getLabel('mmq_object', 'Input Objek MMQ')}
        containerSx={{ flex: 1 }}
        value={mmq_object.value}
        onChange={(val) => masintonChange('mmq_object', val)}
        disabled={existing}
        error={mmq_object.error}
        helperText={mmq_object.error && mmq_object.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('expected_profit', 'Ekspektasi Imbal Hasil')}
        type="text"
        placeholder={getLabel('expected_profit', 'Input Ekspektasi Imbal Hasil')}
        containerSx={{ flex: 1 }}
        value={expected_profit.value}
        onChange={(val) => masintonChange('expected_profit', val)}
        error={expected_profit.error}
        helperText={expected_profit.error && expected_profit.errorMessage}
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
        label={getLabel('ujroh_payment_period', 'Periode Pembayaran Ujroh / Sewa')}
        type="dropdown"
        placeholder={getLabel('ujroh_payment_period', 'Choose Periode Pembayaran Ujroh / Sewa')}
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_payment_period}
        value={ujroh_payment_period.value}
        onChange={(val) => masintonChange('ujroh_payment_period', val)}
        error={ujroh_payment_period.error}
        helperText={ujroh_payment_period.error && ujroh_payment_period.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('ujroh_review_type', 'Jenis Review Ujroh / Sewa')}
        type="dropdown"
        placeholder={getLabel('ujroh_review_type', 'Choose Jenis Review Ujroh / Sewa')}
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_review_type}
        value={ujroh_review_type.value}
        onChange={(val) => masintonChange('ujroh_review_type', val)}
        error={ujroh_review_type.error}
        helperText={ujroh_review_type.error && ujroh_review_type.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('ujroh_review_period', 'Masa Review Ujroh / Sewa')}
        type="dropdown"
        placeholder={getLabel('ujroh_review_period', 'Choose Masa Review Ujroh / Sewa')}
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_review_period}
        value={ujroh_review_period.value}
        onChange={(val) => masintonChange('ujroh_review_period', val)}
        error={ujroh_review_period.error}
        helperText={ujroh_review_period.error && ujroh_review_period.errorMessage}
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
        label={getLabel('partnership_smi_facility', 'Syirkah SMI / Nilai Fasilitas Pembiayaan')}
        placeholder={getLabel('partnership_smi_facility', 'Syirkah SMI / Nilai Fasilitas Pembiayaan')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_partnership_smi_facility.value, value: partnership_smi_facility.value }}
        onChange={(val) => masintonChange('partnership_smi_facility', val.value)}
        onCurrencyChange={(val) => {
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
          label={getLabel('partnership_smi_facility_idr', 'Syirkah SMI / Nilai Fasilitas Pembiayaan (dalam Rp)')}
          placeholder={getLabel('partnership_smi_facility_idr', 'Syirkah SMI / Nilai Fasilitas Pembiayaan (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: partnership_smi_facility_idr.value }}
          onChange={(val) => masintonChange('partnership_smi_facility_idr', val?.value)}
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
        label={getLabel('hishshah_value', 'Nilai Hishshah')}
        placeholder={getLabel('hishshah_value', 'Nilai Hishshah')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_hishshah_value.value, value: hishshah_value.value }}
        onChange={(val) => masintonChange('hishshah_value', val.value)}
        onCurrencyChange={(val) => {
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
        label={getLabel('ujroh_value', 'Nilai Ujroh / Sewa')}
        placeholder={getLabel('ujroh_value', 'Nilai Ujroh / Sewa')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_ujroh_value.value, value: ujroh_value.value }}
        onChange={(val) => masintonChange('ujroh_value', val.value)}
        onCurrencyChange={(val) => {
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
          label={getLabel('hishshah_value_idr', 'Nilai Hishshah (dalam Rp)')}
          placeholder={getLabel('hishshah_value_idr', 'Nilai Hishshah (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: hishshah_value_idr.value }}
          onChange={(val) => masintonChange('hishshah_value_idr', val?.value)}
          disabled
        />
      }

      {
        currency_ujroh_value.value === 'USD' &&
        <Currency
          label={getLabel('ujroh_value_idr', 'Nilai Ujroh / Sewa (dalam Rp)')}
          placeholder={getLabel('ujroh_value_idr', 'Nilai Ujroh / Sewa (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: ujroh_value_idr.value }}
          onChange={(val) => masintonChange('ujroh_value_idr', val?.value)}
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

export default AlMusyarakahMutanaqisahForm;
