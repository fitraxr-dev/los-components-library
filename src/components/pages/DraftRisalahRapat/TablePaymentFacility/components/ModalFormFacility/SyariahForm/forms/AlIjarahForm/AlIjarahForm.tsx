import { Box, useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlIjarah from './AlIjarahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlIjarahForm = (props: SyariahFormsProps) => {
  const theme = useTheme();
  const { existing, syariahComponentConfig } = props;

  const {
    masintonChange,
    masintonForm,
    currencyDropdownList,
    governmentMandateList,
    masintonMultiChange,
    Dujroh_review_type,
    Dujroh_review_period,
    Dujroh_payment_period,
  } = useAlIjarah(props);

  // Helper function to get dynamic label from API config
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attribute = syariahComponentConfig.attributes.find(
      (attr) => attr.attributeKey === attributeKey
    );
    return attribute?.attributeLabel || defaultLabel;
  };

  const {
    ijarah_object,
    financing_period,
    expected_profit,
    government_mandate,
    remarks,
    facility_value,
    currency_facility_value,
    exchange_rate_facility_value,
    facility_value_idr,
    ujroh_payment_period,
    ujroh_review_type,
    ujroh_review_period,
    ujroh_value,
    currency_ujroh_value,
    exchange_rate_ujroh,
    ujroh_value_idr,
  } = masintonForm;

  return (
    <>
      <Input
        label={getLabel('ijarah_object', 'Object Ijarah')}
        type="text"
        placeholder={getLabel('ijarah_object', 'Input Object Ijarah')}
        containerSx={{ flex: 1 }}
        value={ijarah_object.value}
        onChange={(val) => masintonChange('ijarah_object', val)}
        disabled={existing}
        error={ijarah_object.error}
        helperText={ijarah_object.error && ijarah_object.errorMessage}
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
        label={getLabel('ujroh_payment_period', 'Periode Pembayaran Ujroh/Sewa')}
        type="dropdown"
        placeholder={getLabel('ujroh_payment_period', 'Choose Periode Pembayaran Ujroh/Sewa')}
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_payment_period}
        value={ujroh_payment_period.value}
        onChange={(val) => masintonChange('ujroh_payment_period', val)}
        error={ujroh_payment_period.error}
        helperText={ujroh_payment_period.error && ujroh_payment_period.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('ujroh_review_type', 'Jenis Review Ujroh/Sewa')}
        type="dropdown"
        placeholder={getLabel('ujroh_review_type', 'Choose Jenis Review Ujroh/Sewa')}
        containerSx={{ flex: 1 }}
        dropdownList={Dujroh_review_type}
        value={ujroh_review_type.value}
        onChange={(val) => masintonChange('ujroh_review_type', val)}
        error={ujroh_review_type.error}
        helperText={ujroh_review_type.error && ujroh_review_type.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('ujroh_review_period', 'Masa Review Ujroh/Sewa')}
        type="dropdown"
        placeholder={getLabel('ujroh_review_period', 'Choose Masa Review Ujroh/Sewa')}
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
        label={getLabel('facility_value', 'Nilai Fasilitas Pembiayaan')}
        placeholder={getLabel('facility_value', 'Nilai Fasilitas Pembiayaan')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_facility_value.value, value: facility_value.value }}
        onChange={(val) => masintonChange('facility_value', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_facility_value: val,
              exchange_rate_facility_value: '1',
              facility_value_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_facility_value: val,
              exchange_rate_facility_value: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={facility_value.error}
        helperText={facility_value.error && facility_value.errorMessage}
      />

      <Currency
        label={getLabel('ujroh_value', 'Nilai Ujroh/Sewa')}
        placeholder={getLabel('ujroh_value', 'Nilai Ujroh/Sewa')}
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
        currency_facility_value.value === 'USD' &&
        <Currency
          label="Kurs Fasilitas Pembiayaan"
          placeholder="Kurs Fasilitas Pembiayaan"
          value={{ currency: 'IDR', value: exchange_rate_facility_value.value }}
          onChange={(val) => masintonChange('exchange_rate_facility_value', val.value)}
          error={exchange_rate_facility_value.error}
          helperText={exchange_rate_facility_value.error && exchange_rate_facility_value.errorMessage}
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
        currency_facility_value.value === 'USD' &&
        <Currency
          label={getLabel('facility_value_idr', 'Nilai Fasilitas Pembiayaan (dalam Rp)')}
          placeholder={getLabel('facility_value_idr', 'Nilai Fasilitas Pembiayaan (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: facility_value_idr.value }}
          onChange={(val) => masintonChange('facility_value_idr', val?.value)}
          disabled
        />
      }

      {
        currency_ujroh_value.value === 'USD' &&
        <Currency
          label={getLabel('ujroh_value_idr', 'Nilai Ujroh/Sewa (dalam Rp)')}
          placeholder={getLabel('ujroh_value_idr', 'Nilai Ujroh/Sewa (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: ujroh_value_idr.value }}
          onChange={(val) => masintonChange('ujroh_value_idr', val?.value)}
          disabled
        />
      }
    </>
  );
};

export default AlIjarahForm;
