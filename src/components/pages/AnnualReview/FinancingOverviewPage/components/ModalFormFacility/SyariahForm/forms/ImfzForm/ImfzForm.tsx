import { useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useImfz from './ImfzForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const ImfzForm = (props: SyariahFormsProps) => {
  const theme = useTheme();
  const { existing } = props;

  const {
    Dujroh_payment_period,
    Dujroh_review_period,
    Dujroh_review_type,
    governmentMandateList,
    currencyDropdownList,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  } = useImfz(props);

  const {
    ijarah_object_delivery_period,
    financing_period,
    expected_profit_share,
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
        value={ujroh_review_period.value}
        onChange={(val) => masintonChange('ujroh_review_period', val)}
        error={ujroh_review_period.error}
        helperText={ujroh_review_period.error && ujroh_review_period.errorMessage}
        regex={null}
      />

      <Input
        label="Masa Penyediaan Objek Ijarah/Sewa"
        type="text"
        placeholder="Choose Masa Penyediaan Objek Ijarah/Sewa"
        containerSx={{ flex: 1 }}
        value={ijarah_object_delivery_period.value}
        onChange={(val) => masintonChange('ijarah_object_delivery_period', val)}
        error={ijarah_object_delivery_period.error}
        helperText={ijarah_object_delivery_period.error && ijarah_object_delivery_period.errorMessage}
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
        label="Nilai Fasilitas Pembiayaan"
        placeholder="Nilai Fasilitas Pembiayaan"
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
          label="Nilai Fasilitas Pembiayaan (dalam Rp)"
          placeholder="Nilai Fasilitas Pembiayaan (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: facility_value_idr.value }}
          onChange={(val) => masintonChange('facility_value_idr', val?.value)}
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
    </>
  );
};

export default ImfzForm;
