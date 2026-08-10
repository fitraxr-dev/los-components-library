import { Box, useTheme } from '@mui/material';


import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import TextStyle from '@/components/shared/TextStyle';

import useAlMudharabah from './AlMudharabahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMudharabahForm = (props: SyariahFormsProps) => {
  const { syariahComponentConfig } = props;

  const {
    Dmudharabah_fund_usage_purpose,
    Dprofit_share_type,
    Dprofit_share_review,
    masintonMultiChange,
    governmentMandateList,
    masintonChange,
    masintonForm,
    currencyDropdownList,
  } = useAlMudharabah(props);

  // Helper function to get dynamic label from API config
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attribute = syariahComponentConfig.attributes.find(
      (attr) => attr.attributeKey === attributeKey
    );
    return attribute?.attributeLabel || defaultLabel;
  };

  const theme = useTheme();
  const {
    expected_profit,
    government_mandate,
    remarks,
    exchange_rate_mudharabah_fund,
    mudharabah_fund,
    currency_mudharabah_fund,
    mudharabah_fund_idr,
    profit_share_smi,
    profit_share_customer,
    profit_share_type,
    profit_share_review,
    financing_period,
    mudharabah_fund_usage_purpose,
  } = masintonForm;

  return (
    <>
      <Input
        label={getLabel('expected_profit', 'Ekspektasi Imbal Hasil')}
        type="text"
        placeholder="Input Ekspektasi Imbal Hasil"
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
        placeholder="Input Nisbah Bagi Hasil SMI (%)"
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
        placeholder="Nisbah Bagi Hasil Nasabah"
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
        label={getLabel('profit_share_review', 'Review Nisbah Bagi Hasil')}
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
        label={getLabel('financing_period', 'Jangka Waktu Pembiayaan')}
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
        label={getLabel('mudharabah_fund_usage_purpose', 'Tujuan Penggunaan Dana Mudharabah')}
        type="dropdown"
        placeholder="Choose Tujuan Penggunaan Dana Mudharabah"
        containerSx={{ flex: 1 }}
        dropdownList={Dmudharabah_fund_usage_purpose}
        value={mudharabah_fund_usage_purpose.value}
        onChange={(val) => masintonChange('mudharabah_fund_usage_purpose', val)}
        error={mudharabah_fund_usage_purpose.error}
        helperText={mudharabah_fund_usage_purpose.error && mudharabah_fund_usage_purpose.errorMessage}
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
        label={getLabel('mudharabah_fund', 'Total Dana Mudharabah')}
        placeholder={getLabel('mudharabah_fund', 'Total Dana Mudharabah')}
        containerSx={{ flex: 1 }}
        value={{ currency: currency_mudharabah_fund.value, value: mudharabah_fund.value }}
        onChange={(val) => masintonChange('mudharabah_fund', val.value)}
        onCurrencyChange={(val) => {
          if (val.currency === 'IDR') {
            masintonMultiChange({
              currency_mudharabah_fund: val,
              exchange_rate_mudharabah_fund: '1',
              mudharabah_fund_idr: '',
            });
          } else {
            masintonMultiChange({
              currency_mudharabah_fund: val,
              exchange_rate_mudharabah_fund: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
            });
          }
        }}
        error={mudharabah_fund.error}
        helperText={mudharabah_fund.error && mudharabah_fund.errorMessage}
      />

      {
        currency_mudharabah_fund.value === 'USD' &&
        <Currency
          label="Kurs Total Dana Mudharabah"
          placeholder="Kurs Total Dana Mudharabah"
          value={{ currency: 'IDR', value: exchange_rate_mudharabah_fund.value }}
          onChange={(val) => masintonChange('exchange_rate_mudharabah_fund', val.value)}
          error={exchange_rate_mudharabah_fund.error}
          helperText={exchange_rate_mudharabah_fund.error && exchange_rate_mudharabah_fund.errorMessage}
          disabledCurrency
        />
      }

      {
        currency_mudharabah_fund.value === 'USD' &&
        <Currency
          label={getLabel('mudharabah_fund_idr', 'Total Dana Mudharabah (dalam Rp)')}
          placeholder={getLabel('mudharabah_fund_idr', 'Total Dana Mudharabah (dalam Rp)')}
          containerSx={{ flex: 1 }}
          value={{ currency: 'IDR', value: mudharabah_fund_idr.value }}
          onChange={(val) => masintonChange('mudharabah_fund_idr', val?.value)}
          disabled
        />
      }
    </>
  );
};

export default AlMudharabahForm;
