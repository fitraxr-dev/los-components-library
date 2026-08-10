import { useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlQardh from './AlQardh.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlQardh = (props: SyariahFormsProps) => {
  const { financingFacilityData } = props;
  const theme = useTheme();
  const { existing, facilityId } = props;

  const {
    masintonChange,
    masintonForm,
    governmentMandateList,
    currencyDropdownList,
    masintonMultiChange,
    Dloan_payment_method,
  } = useAlQardh(props);

  const {
    government_mandate,
    remarks,
    al_qardh_loan_amount,
    currency_al_qardh_loan_amount,
    exchange_rate_al_qardh_loan,
    al_qardh_loan_amount_idr,
    financing_period,
    loan_payment_method,
    administration_fee,
    currency_administration_fee,
    exchange_rate_administration_fee,
    administration_fee_idr,
    installment_value,
    currency_installment_value,
    exchange_rate_installment_value,
    installment_value_idr,
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
        label="Cara Bayar Pinjaman"
        type="dropdown"
        placeholder="Input Cara Bayar Pinjaman"
        containerSx={{ flex: 1 }}
        dropdownList={Dloan_payment_method}
        value={loan_payment_method.value}
        onChange={(val) => masintonChange('loan_payment_method', val)}
        error={loan_payment_method.error}
        helperText={loan_payment_method.error && loan_payment_method.errorMessage}
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
        label="Jumlah/Nilai Pinjaman Al Qardh"
        placeholder="Jumlah/Nilai Pinjaman Al Qardh"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_al_qardh_loan_amount.value, value: al_qardh_loan_amount.value }}
        onChange={(val) => masintonChange('al_qardh_loan_amount', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              al_qardh_loan_amount_idr: '',
              currency_al_qardh_loan_amount: val,
              exchange_rate_al_qardh_loan: '1',
            });
          } else {
            masintonMultiChange({
              currency_al_qardh_loan_amount: val,
              exchange_rate_al_qardh_loan: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={al_qardh_loan_amount.error}
        helperText={al_qardh_loan_amount.error && al_qardh_loan_amount.errorMessage}
      />

      <Currency
        label="Biaya Administrasi"
        placeholder="Biaya Administrasi"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_administration_fee.value, value: administration_fee.value }}
        onChange={(val) => masintonChange('administration_fee', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              administration_fee_idr: '',
              currency_administration_fee: val,
              exchange_rate_administration_fee: '1',
            });
          } else {
            masintonMultiChange({
              currency_administration_fee: val,
              exchange_rate_administration_fee: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={administration_fee.error}
        helperText={administration_fee.error && administration_fee.errorMessage}
      />

      {
        currency_al_qardh_loan_amount.value === 'USD' &&
        <Currency
          label="Kurs Jumlah/Nilai Pinjaman Al Qardh"
          placeholder="Kurs Jumlah/Nilai Pinjaman Al Qardh"
          value={{ currency: 'IDR', value: exchange_rate_al_qardh_loan.value }}
          onChange={(val) => masintonChange('exchange_rate_al_qardh_loan', val.value)}
          error={exchange_rate_al_qardh_loan.error}
          helperText={exchange_rate_al_qardh_loan.error && exchange_rate_al_qardh_loan.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_administration_fee.value === 'USD' &&
        <Currency
          label="Kurs Biaya Administrasi"
          placeholder="Kurs Biaya Administrasi"
          value={{ currency: 'IDR', value: exchange_rate_administration_fee.value }}
          onChange={(val) => masintonChange('exchange_rate_administration_fee', val.value)}
          error={exchange_rate_administration_fee.error}
          helperText={exchange_rate_administration_fee.error && exchange_rate_administration_fee.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_al_qardh_loan_amount.value === 'USD' &&
        <Currency
          label="Jumlah/Nilai Pinjaman Al Qardh (dalam Rp)"
          placeholder="Jumlah/Nilai Pinjaman Al Qardh (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: al_qardh_loan_amount_idr.value }}
          onChange={(val) => masintonChange('al_qardh_loan_amount_idr', val?.value)}
          disabled
        />
      }

      {
        currency_administration_fee.value === 'USD' &&
        <Currency
          label="Biaya Administrasi (dalam Rp)"
          placeholder="Biaya Administrasi (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: administration_fee_idr.value }}
          onChange={(val) => masintonChange('administration_fee_idr', val?.value)}
          disabled
        />
      }

      <Currency
        label="Nilai Angsuran"
        placeholder="Nilai Angsuran"
        containerSx={{ flex: 1 }}
        value={{ currency: currency_installment_value.value, value: installment_value.value }}
        onChange={(val) => masintonChange('installment_value', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_installment_value: val,
              exchange_rate_installment_value: '1',
              installment_value_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_installment_value: val,
              exchange_rate_installment_value: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={installment_value.error}
        helperText={installment_value.error && installment_value.errorMessage}
      />


      {
        currency_installment_value.value === 'USD' &&
        <Currency
          label="Kurs Nilai Angsuran"
          placeholder="Kurs Nilai Angsuran"
          value={{ currency: 'IDR', value: exchange_rate_installment_value.value }}
          onChange={(val) => masintonChange('exchange_rate_installment_value', val.value)}
          error={exchange_rate_installment_value.error}
          helperText={exchange_rate_installment_value.error && exchange_rate_installment_value.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_installment_value.value === 'USD' &&
        <Currency
          label="Nilai Angsuran (dalam Rp)"
          placeholder="Nilai Angsuran (dalam Rp)"
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: installment_value_idr.value }}
          onChange={(val) => masintonChange('installment_value_idr', val?.value)}
          disabled
        />
      }
    </>
  );
};

export default AlQardh;
