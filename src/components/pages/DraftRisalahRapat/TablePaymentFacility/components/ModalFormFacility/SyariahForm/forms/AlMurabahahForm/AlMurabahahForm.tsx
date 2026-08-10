import { Box, useTheme } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlMurabahah from './AlMurabahahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMurabahahForm = (props: SyariahFormsProps) => {
  const { existing, syariahComponentConfig } = props;
  const theme = useTheme();

  const {
    governmentMandateList,
    masintonChange,
    masintonForm,
    currencyDropdownList,
    masintonMultiChange,
  } = useAlMurabahah(props);

  // Helper function to get dynamic label from API config
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attribute = syariahComponentConfig.attributes.find(
      (attr) => attr.attributeKey === attributeKey
    );
    return attribute?.attributeLabel || defaultLabel;
  };

  const {
    murabahah_object,
    government_mandate,
    remarks,
    purchase_price,
    currency_purchase_price,
    exchange_rate_purchase_price,
    purchase_price_idr,
    expected_profit,
    financing_period,
    down_payment,
    currency_down_payment,
    exchange_rate_down_payment,
    down_payment_idr,
    murabahah_margin,
    currency_murabahah_margin,
    exchange_rate_murabahah_margin,
    murabahah_margin_idr,
    murabahah_installment,
    currency_murabahah_installment,
    exchange_rate_murabahah_installment,
    murabahah_installment_idr,
    exchange_rate_selling_price,
    selling_price,
    selling_price_idr,
    currency_selling_price,
  } = masintonForm;

  return (
    <>
      <Input
        label={getLabel('murabahah_object', 'Objek Murabahah')}
        type="text"
        placeholder={getLabel('murabahah_object', 'Input Objek Murabahah')}
        containerSx={{ flex: 1 }}
        value={murabahah_object.value}
        onChange={(val) => masintonChange('murabahah_object', val)}
        disabled={existing}
        error={murabahah_object.error}
        helperText={murabahah_object.error && murabahah_object.errorMessage}
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
        label={getLabel('murabahah_margin', 'Margin Murabahah')}
        placeholder={getLabel('murabahah_margin', 'Margin Murabahah')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_murabahah_margin.value, value: murabahah_margin.value }}
        onChange={(val) => masintonChange('murabahah_margin', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_murabahah_margin: val,
              exchange_rate_murabahah_margin: '1',
              murabahah_margin_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_murabahah_margin: val,
              exchange_rate_murabahah_margin: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={murabahah_margin.error}
        helperText={murabahah_margin.error && murabahah_margin.errorMessage}
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
        currency_murabahah_margin.value === 'USD' &&
        <Currency
          label="Kurs Margin Murabahah"
          placeholder="Kurs Margin Murabahah"
          value={{ currency: 'IDR', value: exchange_rate_murabahah_margin.value }}
          onChange={(val) => masintonChange('exchange_rate_murabahah_margin', val.value)}
          error={exchange_rate_murabahah_margin.error}
          helperText={exchange_rate_murabahah_margin.error && exchange_rate_murabahah_margin.errorMessage}
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
        currency_murabahah_margin.value === 'USD' &&
        <Currency
          label={getLabel('murabahah_margin_idr', 'Margin Murabahah (dalam Rp)')}
          placeholder={getLabel('murabahah_margin_idr', 'Margin Murabahah (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: murabahah_margin_idr.value }}
          onChange={(val) => masintonChange('murabahah_margin_idr', val?.value)}
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
        label={getLabel('murabahah_installment', 'Nilai Angsuran Murabahah')}
        placeholder={getLabel('murabahah_installment', 'Nilai Angsuran Murabahah')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_murabahah_installment.value, value: murabahah_installment.value }}
        onChange={(val) => masintonChange('murabahah_installment', val.value)}
        onCurrencyChange= {(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_murabahah_installment: val,
              exchange_rate_murabahah_installment: '1',
              murabahah_installment_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_murabahah_installment: val,
              exchange_rate_murabahah_installment: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={murabahah_installment.error}
        helperText={murabahah_installment.error && murabahah_installment.errorMessage}
      />


      {
        currency_murabahah_installment.value === 'USD' &&
        <Currency
          label="Kurs Nilai Angsuran Murabahah"
          placeholder="Kurs Nilai Angsuran Murabahah"
          value={{ currency: 'IDR', value: exchange_rate_murabahah_installment.value }}
          onChange={(val) => masintonChange('exchange_rate_murabahah_installment', val.value)}
          error={exchange_rate_murabahah_installment.error}
          helperText={exchange_rate_murabahah_installment.error && exchange_rate_murabahah_installment.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_murabahah_installment.value === 'USD' &&
        <Currency
          label={getLabel('murabahah_installment_idr', 'Nilai Angsuran Murabahah (dalam Rp)')}
          placeholder={getLabel('murabahah_installment_idr', 'Nilai Angsuran Murabahah (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: murabahah_installment_idr.value }}
          onChange={(val) => masintonChange('murabahah_installment_idr', val?.value)}
          disabled
        />
      }
    </>
  );
};

export default AlMurabahahForm;
