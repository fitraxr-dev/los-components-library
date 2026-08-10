import { Box, useTheme } from '@mui/material';


import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlIstishna from './AlIstishnaForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlIstishna = (props: SyariahFormsProps) => {
  const theme = useTheme();
  const { existing, syariahComponentConfig } = props;

  const {
    masintonChange,
    masintonForm,
    masintonMultiChange,
    governmentMandateList,
    Dselling_price_payment_method,
    currencyDropdownList,
  } = useAlIstishna(props);

  // Helper: pakai label dari API jika ada, fallback ke default
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attr = syariahComponentConfig.attributes.find((a) => a.attributeKey === attributeKey);
    return attr?.attributeLabel || defaultLabel;
  };

  const {
    expected_profit,
    selling_price,
    currency_selling_price,
    selling_price_idr,
    exchange_rate_selling_price,
    istishna_object,
    government_mandate,
    remarks,
    purchase_price,
    currency_purchase_price,
    exchange_rate_purchase_price,
    purchase_price_idr,
    selling_price_payment_method,
    istishna_object_delivery_period,
    financing_period,
    down_payment,
    currency_down_payment,
    exchange_rate_down_payment,
    down_payment_idr,
    istishna_margin,
    currency_istishna_margin,
    exchange_rate_istishna_margin,
    istishna_margin_idr,
    istishna_installment,
    currency_istishna_installment,
    exchange_rate_istishna_installment,
    istishna_installment_idr,
  } = masintonForm;

  return (
    <>
      <Input
        label={getLabel('istishna_object', 'Object Istishna')}
        type="text"
        placeholder={getLabel('istishna_object', 'Input Object Istishna')}
        containerSx={{ flex: 1 }}
        value={istishna_object.value}
        onChange={(val) => masintonChange('istishna_object', val)}
        disabled={existing}
        error={istishna_object.error}
        helperText={istishna_object.error && istishna_object.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('selling_price_payment_method', 'Metode Pembayaran Harga Jual')}
        type="dropdown"
        placeholder={getLabel('selling_price_payment_method', 'Input Metode Pembayaran Harga Jual')}
        containerSx={{ flex: 1 }}
        dropdownList={Dselling_price_payment_method}
        value={selling_price_payment_method.value}
        onChange={(val) => masintonChange('selling_price_payment_method', val)}
        error={selling_price_payment_method.error}
        helperText={selling_price_payment_method.error && selling_price_payment_method.errorMessage}
        regex={null}
      />

      <Input
        label={getLabel('istishna_object_delivery_period', 'Masa Penyediaan Objek Istishna')}
        type="text"
        placeholder={getLabel('istishna_object_delivery_period', 'Input Masa Penyediaan Objek Istishna')}
        containerSx={{ flex: 1 }}
        value={istishna_object_delivery_period.value}
        onChange={(val) => masintonChange('istishna_object_delivery_period', val)}
        error={istishna_object_delivery_period.error}
        helperText={istishna_object_delivery_period.error && istishna_object_delivery_period.errorMessage}
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
        label={getLabel('purchase_price', 'Harga Beli / Plafond Pembiayaan')}
        placeholder={getLabel('purchase_price', 'Harga Beli / Plafond Pembiayaan')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_purchase_price.value, value: purchase_price.value }}
        onChange={(val) => masintonChange('purchase_price', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_purchase_price: val,
              exchange_rate_purchase_price: '1',
              purchase_price_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_purchase_price: val,
              exchange_rate_purchase_price: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={purchase_price.error}
        helperText={purchase_price.error && purchase_price.errorMessage}
      />

      <Currency
        label={getLabel('down_payment', 'Uang Muka (Urbun)')}
        placeholder={getLabel('down_payment', 'Uang Muka (Urbun)')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_down_payment.value, value: down_payment.value }}
        onChange={(val) => masintonChange('down_payment', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_down_payment: val,
              down_payment_idr: '',
              exchange_rate_down_payment: '1',
            });
          } else {
            masintonMultiChange({
              currency_down_payment: val,
              exchange_rate_down_payment: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={down_payment.error}
        helperText={down_payment.error && down_payment.errorMessage}
      />

      {
        currency_purchase_price.value === 'USD' &&
        <Currency
          label="Kurs Harga Beli/Plafond Pembiayaan"
          placeholder="Kurs Harga Beli/Plafond Pembiayaan"
          value={{ currency: 'IDR', value: exchange_rate_purchase_price.value }}
          onChange={(val) => masintonChange('exchange_rate_purchase_price', val.value)}
          error={exchange_rate_purchase_price.error}
          helperText={exchange_rate_purchase_price.error && exchange_rate_purchase_price.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_down_payment.value === 'USD' &&
        <Currency
          label="Kurs Uang Muka (Urbun)"
          placeholder="Kurs Uang Muka (Urbun)"
          value={{ currency: 'IDR', value: exchange_rate_down_payment.value }}
          onChange={(val) => masintonChange('exchange_rate_down_payment', val.value)}
          error={exchange_rate_down_payment.error}
          helperText={exchange_rate_down_payment.error && exchange_rate_down_payment.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_purchase_price.value === 'USD' &&
        <Currency
          label={getLabel('purchase_price_idr', 'Harga Beli / Plafond Pembiayaan (dalam Rp)')}
          placeholder={getLabel('purchase_price_idr', 'Harga Beli / Plafond Pembiayaan (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: purchase_price_idr.value }}
          onChange={(val) => masintonChange('purchase_price_idr', val?.value)}
          disabled
        />
      }

      {
        currency_down_payment.value === 'USD' &&
        <Currency
          label={getLabel('down_payment_idr', 'Uang Muka (Urbun) (dalam Rp)')}
          placeholder={getLabel('down_payment_idr', 'Uang Muka (Urbun) (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: down_payment_idr.value }}
          onChange={(val) => masintonChange('down_payment_idr', val?.value)}
          disabled
        />
      }

      <Currency
        label={getLabel('istishna_margin', 'Margin Istishna')}
        placeholder={getLabel('istishna_margin', 'Margin Istishna')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_istishna_margin.value, value: istishna_margin.value }}
        onChange={(val) => masintonChange('istishna_margin', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_istishna_margin: val,
              exchange_rate_istishna_margin: '1',
              istishna_margin_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_istishna_margin: val,
              exchange_rate_istishna_margin: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={istishna_margin.error}
        helperText={istishna_margin.error && istishna_margin.errorMessage}
      />

      <Currency
        label={getLabel('selling_price', 'Harga Jual')}
        placeholder={getLabel('selling_price', 'Harga Jual')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_selling_price.value, value: selling_price.value }}
        onChange={(val) => masintonChange('selling_price', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_selling_price: val,
              exchange_rate_selling_price: '1',
              selling_price_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_selling_price: val,
              exchange_rate_selling_price: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={selling_price.error}
        helperText={selling_price.error && selling_price.errorMessage}
      />

      {
        currency_istishna_margin.value === 'USD' &&
        <Currency
          label="Kurs Margin Istishna"
          placeholder="Kurs Margin Istishna"
          value={{ currency: 'IDR', value: exchange_rate_istishna_margin.value }}
          onChange={(val) => masintonChange('exchange_rate_istishna_margin', val.value)}
          error={exchange_rate_istishna_margin.error}
          helperText={exchange_rate_istishna_margin.error && exchange_rate_istishna_margin.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_selling_price.value === 'USD' &&
        <Currency
          label="Kurs Harga Jual"
          placeholder="Kurs Harga Jual"
          value={{ currency: 'IDR', value: exchange_rate_selling_price.value }}
          onChange={(val) => masintonChange('exchange_rate_selling_price', val.value)}
          error={exchange_rate_selling_price.error}
          helperText={exchange_rate_selling_price.error && exchange_rate_selling_price.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_istishna_margin.value === 'USD' &&
        <Currency
          label={getLabel('istishna_margin_idr', 'Margin Istishna (dalam Rp)')}
          placeholder={getLabel('istishna_margin_idr', 'Margin Istishna (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: istishna_margin_idr.value }}
          onChange={(val) => masintonChange('istishna_margin_idr', val?.value)}
          disabled
        />
      }

      {
        currency_selling_price.value === 'USD' &&
        <Currency
          label={getLabel('selling_price_idr', 'Harga Jual (dalam Rp)')}
          placeholder={getLabel('selling_price_idr', 'Harga Jual (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: selling_price_idr.value }}
          onChange={(val) => masintonChange('selling_price_idr', val?.value)}
          disabled
        />
      }

      <Currency
        label={getLabel('istishna_installment', 'Nilai Angsuran Istishna')}
        placeholder={getLabel('istishna_installment', 'Nilai Angsuran Istishna')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_istishna_installment.value, value: istishna_installment.value }}
        onChange={(val) => masintonChange('istishna_installment', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_istishna_installment: val,
              exchange_rate_istishna_installment: '1',
              istishna_installment_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_istishna_installment: val,
              exchange_rate_istishna_installment: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={istishna_installment.error}
        helperText={istishna_installment.error && istishna_installment.errorMessage}
      />


      {
        currency_istishna_installment.value === 'USD' &&
        <Currency
          label="Kurs Nilai Angsuran Istishna"
          placeholder="Kurs Nilai Angsuran Istishna"
          value={{ currency: 'IDR', value: exchange_rate_istishna_installment.value }}
          onChange={(val) => masintonChange('exchange_rate_istishna_installment', val.value)}
          error={exchange_rate_istishna_installment.error}
          helperText={exchange_rate_istishna_installment.error && exchange_rate_istishna_installment.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_istishna_installment.value === 'USD' &&
        <Currency
          label={getLabel('istishna_installment_idr', 'Nilai Angsuran Istishna (dalam Rp)')}
          placeholder={getLabel('istishna_installment_idr', 'Nilai Angsuran Istishna (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: istishna_installment_idr.value }}
          onChange={(val) => masintonChange('istishna_installment_idr', val?.value)}
          disabled
        />
      }
    </>
  );
};

export default AlIstishna;
