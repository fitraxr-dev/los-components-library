import { Box, Tooltip, useTheme, Checkbox } from '@mui/material';


import Currency from '@/components/shared/Currency';
import CurrencyForm from '@/components/shared/CurrencyForm';
import CurrencyFormWithoutKurs from '@/components/shared/CurrencyForm/CurrencyFormWithoutKurs';
import KonversiMataUangForm from '@/components/shared/CurrencyForm/KonversiMataUangForm';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Dropdown from '@/components/shared/Input/components/DropdownV2';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useAlMudharabah from './AlMudharabahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMudharabahForm = (props: SyariahFormsProps) => {
  const { financingFacilityData, syariahComponentConfig, disabled } = props;

  const {
    Dmudharabah_fund_usage_purpose,
    Dprofit_share_type,
    Dprofit_share_review,
    masintonMultiChange,
    governmentMandateList,
    masintonChange,
    masintonForm,
    currencyDropdownList,
    isMudharabahFundUnchanged,
  } = useAlMudharabah(props);

  // Helper function to get dynamic label from API config
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attribute = syariahComponentConfig.attributes.find(
      (attr) => attr.attributeKey === attributeKey
    );
    return attribute?.attributeLabel || defaultLabel;
  };

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING' || financingFacilityData?.orderType === 'New From Existing';

  const theme = useTheme();
  const { existing, facilityId } = props;
  const {
    debtorName,
    expected_profit,
    government_guarantee,
    remarks,
    exchange_rate_mudharabah_fund,
    mudharabah_fund,
    currency_mudharabah_fund,
    mudharabah_fund_idr,
    profit_share_smi,
    profit_share_customer,
    profit_share_type,
    profit_share_review,
    other_profit_share_review,
    financing_period,
    mudharabah_fund_usage_purpose,
  } = masintonForm;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Input
          label={getLabel('mudharib_name', 'Mudharib / Nasabah')}
          type="text"
          placeholder={getLabel('mudharib_name', 'Mudharib / Nasabah')}
          containerSx={{ flex: 1 }}
          value={debtorName.value}
          disabled
        />
      </Box>
      <Box
        border="1px solid #D3D3D3"
        borderRadius="10px"
        padding={theme.spacing(3)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        {currency_mudharabah_fund?.value === 'USD' &&
          <Box
            sx={{
              borderBottom: '1px solid #D3D3D3',
              marginBottom: theme.spacing(3),
              paddingBottom: theme.spacing(3),
            }}
          >
            <KonversiMataUangForm
              kursProps={{
                error: exchange_rate_mudharabah_fund.error,
                errorMessage: exchange_rate_mudharabah_fund.errorMessage,
                isMandatory: !true,
                onChange: (val) => masintonChange('exchange_rate_mudharabah_fund', val.value),
                value: exchange_rate_mudharabah_fund.value,
              }}
              disabled={disabled}
            />
          </Box>
        }
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: currency_mudharabah_fund?.value === 'USD' ? '1fr 1fr' : '1fr',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                {getLabel('mudharabah_fund', 'Total Dana Mudharabah/Plafon Pembiayaan')}
              </TextStyle>
              <TextStyle variant="body4" weight={600} color={theme.palette.error.main}>
                *
              </TextStyle>
              {(existing || facilityId) && financingFacilityData && showTooltips && (
                <Tooltip
                  slotProps={{
                    tooltip: {
                      sx: {
                        '& .MuiTooltip-arrow': {
                          color: '#284A63',
                        },
                        backgroundColor: '#284A63',
                        borderRadius: '10px',
                        gap: '8px',
                        height: 'auto',
                        maxWidth: '300px',
                        minHeight: '80px',
                        opacity: 1,
                        overflow: 'hidden',
                        padding: '12px',
                        width: '300px',
                        wordWrap: 'break-word',
                      },
                    },
                  }}
                  title={
                    (() => {
                      // Get existing values from API attributes - use existing_core values with fallback
                      const existingMudharabahFund = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_mudharabah_fund')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'mudharabah_fund')?.attributeValue || '0';
                      const existingCurrencyMudharabahFund = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_mudharabah_fund')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_mudharabah_fund')?.attributeValue || 'IDR';

                      // Get exchange rate from input or fallback to API
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = (exchange_rate_mudharabah_fund.value && exchange_rate_mudharabah_fund.value !== '0') ?
                        parseFloat(exchange_rate_mudharabah_fund.value.toString().replace(/,/g, '')) :
                        (usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000);

                      // Current form values
                      const currentMudharabahFund = mudharabah_fund.value ? parseFloat(mudharabah_fund.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencyMudharabahFund = currency_mudharabah_fund?.value || 'IDR';

                      // Parse existing values
                      const existingValue = existingMudharabahFund ? parseFloat(existingMudharabahFund.toString().replace(/,/g, '')) : 0;

                      let existingUsdValue = 0;
                      let existingIdrValue = 0;
                      let currentUsdValue = 0;
                      let currentIdrValue = 0;
                      let usdDifference = 0;
                      let idrDifference = 0;

                      const isExisting = financingFacilityData && existingMudharabahFund;

                      if (isExisting) {
                        // Calculate existing values based on currency using current exchange rate
                        if (existingCurrencyMudharabahFund === 'USD') {
                          // Use existing value directly
                          existingUsdValue = existingValue;
                          // Existing IDR = USD * exchange rate
                          existingIdrValue = existingUsdValue * exchangeRateFromApi;
                        } else {
                          // Use existing value directly
                          existingIdrValue = existingValue;
                          // Existing USD = IDR / exchange rate
                          existingUsdValue = exchangeRateFromApi > 0 ? existingIdrValue / exchangeRateFromApi : 0;
                        }

                        // Calculate current values
                        if (currentCurrencyMudharabahFund === 'USD') {
                          currentUsdValue = currentMudharabahFund;
                          currentIdrValue = exchangeRateFromApi > 0 ? currentMudharabahFund * exchangeRateFromApi : 0;
                        } else {
                          currentIdrValue = currentMudharabahFund;
                          currentUsdValue = exchangeRateFromApi > 0 ? currentMudharabahFund / exchangeRateFromApi : 0;
                        }

                        // Calculate differences using exchange rate
                        if (currentCurrencyMudharabahFund === 'USD') {
                          // If current currency is USD, difference USD = current - existing USD
                          usdDifference = currentUsdValue - existingUsdValue;
                          // Difference IDR = difference USD * exchange rate
                          idrDifference = usdDifference * exchangeRateFromApi;
                        } else {
                          // If current currency is IDR, difference IDR = current - existing IDR
                          idrDifference = currentIdrValue - existingIdrValue;
                          // Difference USD = difference IDR / exchange rate
                          usdDifference = exchangeRateFromApi > 0 ? idrDifference / exchangeRateFromApi : 0;
                        }
                      }

                      const formatCurrency = (value: number) => {
                        if (isNaN(value) || !isFinite(value)) return '0';
                        return Math.round(value).toLocaleString('id-ID');
                      };

                      const getDifferenceSymbol = (diff: number) => {
                        if (diff > 0) return <span style={{ color: '#4CAF50', fontSize: '14px' }}>▲</span>;
                        if (diff < 0) return <span style={{ color: '#FF0000', fontSize: '14px' }}>▼</span>;
                        return <span style={{ color: 'white', fontSize: '14px' }}>-</span>;
                      };

                      return (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'white' }}>Existing</span>
                          </Box>

                          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'white' }}>IDR</span>
                            <span style={{ color: 'white' }}>
                              {isExisting ? formatCurrency(existingIdrValue) : '-'}
                            </span>
                          </Box>

                          {currency_mudharabah_fund?.value === 'USD' && (
                            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'white' }}>USD</span>
                              <span style={{ color: 'white' }}>
                                {isExisting ? formatCurrency(existingUsdValue) : '-'}
                              </span>
                            </Box>
                          )}

                          <Box
                            sx={{
                              backgroundColor: '#666',
                              height: '1px',
                              my: 1,
                              width: '100%',
                            }}
                          />

                          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'white' }}>Selisih</span>
                          </Box>

                          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                              {isExisting && getDifferenceSymbol(idrDifference)}
                              <span style={{ color: 'white' }}>IDR</span>
                            </Box>
                            <span style={{ color: 'white' }}>
                              {isExisting ? formatCurrency(Math.abs(idrDifference)) : '-'}
                            </span>
                          </Box>

                          {currency_mudharabah_fund?.value === 'USD' && (
                            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                              <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                                {isExisting && getDifferenceSymbol(usdDifference)}
                                <span style={{ color: 'white' }}>USD</span>
                              </Box>
                              <span style={{ color: 'white' }}>
                                {isExisting ? formatCurrency(Math.abs(usdDifference)) : '-'}
                              </span>
                            </Box>
                          )}
                        </Box>
                      );
                    })()
                  }
                  placement="right"
                >
                  <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                    <Icon iconName="new-info" sx={{ '& path': { fill: '#D07C1B' } }} />
                  </Box>
                </Tooltip>
              )}
            </Box>
            <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
              {(existing || facilityId) && financingFacilityData && showTooltips && (
                <Checkbox
                  checked={!isMudharabahFundUnchanged}
                  disabled
                  sx={{
                    '&.Mui-checked.Mui-disabled': {
                      color: '#D07C1B',
                    },
                    '&.Mui-disabled': {
                      color: '#D07C1B',
                    },
                  }}
                />
              )}
              <Currency
                currencyList={currencyDropdownList}
                label=""
                placeholder={`Input ${getLabel('mudharabah_fund', 'Total Dana Mudharabah/Plafon Pembiayaan')}`}
                containerSx={{ flex: 1 }}
                value={{ currency: currency_mudharabah_fund.value, value: mudharabah_fund.value }}
                onCurrencyChange={(val) => {
                  if (val === 'IDR') {
                    masintonMultiChange({
                      currency_mudharabah_fund: val,
                      exchange_rate_mudharabah_fund: '1',
                      mudharabah_fund_idr: '',
                    });
                  } else {
                    const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;

                    masintonMultiChange({
                      currency_mudharabah_fund: val,
                      exchange_rate_mudharabah_fund: fallbackRate || '1',
                    });
                  }
                }}
                onChange={(val) => {
                  masintonChange('mudharabah_fund', val.value);
                }}
                error={mudharabah_fund.error}
                helperText={mudharabah_fund.error && mudharabah_fund.errorMessage}
                disabled={disabled}
              />
            </RowWrapper>
          </Box>

          {currency_mudharabah_fund?.value === 'USD' && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                <TextStyle variant="body4" weight={600} color={theme.palette.grey[400]}>
                  {getLabel('mudharabah_fund_idr', 'Total Dana Mudharabah/Plafon Pembiayaan (dalam Rp)')}
                </TextStyle>
              </Box>
              <Currency
                currencyList={currencyDropdownList}
                label=""
                placeholder={getLabel('mudharabah_fund_idr', 'Total Dana Mudharabah/Plafon Pembiayaan (dalam Rp)')}
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: mudharabah_fund_idr.value }}
                disabled
              />
            </Box>
          )}
        </Box>

        {/* Legend for Checkboxes */}
        {(existing || facilityId) && financingFacilityData && showTooltips && (
          <Box
            sx={{
              backgroundColor: '#FFF8F0',
              border: `1px solid ${'#FFF8F0'}`,
              borderRadius: 1,
              mt: 2,
              p: 2,
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <Icon iconName="new-info" sx={{ '& path': { fill: '#D07C1B' } }} />
              <TextStyle variant="body4" color="#D07C1B" sx={{ lineHeight: 1.5 }}>
                {!isMudharabahFundUnchanged
                  ? 'Checkbox pada Total Dana Mudharabah/Plafon Pembiayaan aktif apabila terdapat perubahan nominal dari nilai existing'
                  : 'Checkbox pada Total Dana Mudharabah/Plafon Pembiayaan tidak aktif tanpa perubahan nominal dari nilai existing'}
              </TextStyle>
            </Box>
          </Box>
        )}
      </Box>
      <Box border="1px solid #D3D3D3" borderRadius="10px">
        <SectionTitle
          title="More Fields"
          sx={{
            border: 0,
            color: '#34282C !important',
            fontSize: '0.9375vw',
            'span': {
              color: theme.palette.primary.main,
              fontSize: '1.04166666667vw',
              fontWeight: 600,
              lineHeight: 1.2,
              py: theme.spacing(1),
            },
          }}
        >
          <Box
            sx={{
              borderTop: '1px solid #D3D3D3',
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              padding: theme.spacing(3),
            }}
          >
            <Input
              label={getLabel('profit_share_smi', 'Nisbah Bagi Hasil SMI (%)')}
              type="text"
              placeholder={getLabel('profit_share_smi', 'Nisbah Bagi Hasil SMI (%)')}
              containerSx={{ flex: 1 }}
              value={profit_share_smi.value}
              onChange={(val) => {
                if (/^\d*\.?\d*$/.test(val)) {
                  masintonChange('profit_share_smi', val);
                }
              }}
              error={profit_share_smi.error}
              helperText={profit_share_smi.error && profit_share_smi.errorMessage}
              disabled={disabled}
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
              disabled={disabled}
            />

            <Dropdown
              label={getLabel('profit_share_review', 'Review Nisbah Bagi Hasil')}
              containerSx={{ flex: 1 }}
              placeholder={getLabel('profit_share_review', 'Review Nisbah Bagi Hasil')}
              dropdownList={Dprofit_share_review}
              value={{ dropdown: profit_share_review.value, value: other_profit_share_review.value }}
              onChange={(val) => masintonMultiChange({
                other_profit_share_review: val.value,
                profit_share_review: Dprofit_share_review.find((dt) => dt.value === val.dropdown)?.value,
                profit_share_review_label: Dprofit_share_review.find((dt) => dt.value === val.dropdown)?.label,
              })}
              disabled={disabled}
            />

            <Input
              label={getLabel('profit_share_type', 'Jenis Nisbah Bagi Hasil')}
              type="dropdown"
              dropdownList={Dprofit_share_type}
              placeholder={getLabel('profit_share_type', 'Jenis Nisbah Bagi Hasil')}
              containerSx={{ flex: 1 }}
              value={profit_share_type.value}
              onChange={(val) => masintonMultiChange({
                profit_share_type: Dprofit_share_type.find((dt) => dt.value === val)?.value,
                profit_share_type_label: Dprofit_share_type.find((dt) => dt.value === val)?.label,
              })}
              error={profit_share_type.error}
              helperText={profit_share_type.error && profit_share_type.errorMessage}
              disabled={disabled}
            />

            <Input
              label={getLabel('mudharabah_fund_usage_purpose', 'Tujuan Penggunaan Dana Mudharabah')}
              type="dropdown"
              placeholder={getLabel('mudharabah_fund_usage_purpose', 'Tujuan Penggunaan Dana Mudharabah')}
              dropdownList={Dmudharabah_fund_usage_purpose}
              containerSx={{ flex: 1 }}
              value={mudharabah_fund_usage_purpose.value}
              onChange={(val) => masintonMultiChange({
                mudharabah_fund_usage_purpose:
                  Dmudharabah_fund_usage_purpose.find((dt) => dt.value === val)?.value,
                mudharabah_fund_usage_purpose_label:
                  Dmudharabah_fund_usage_purpose.find((dt) => dt.value === val)?.label,
              })}
              error={mudharabah_fund_usage_purpose.error}
              helperText={mudharabah_fund_usage_purpose.error && mudharabah_fund_usage_purpose.errorMessage}
              disabled={disabled}
            />

            <Input
              label={getLabel('financing_period', 'Jangka Waktu Pembiayaan')}
              type="text"
              placeholder={getLabel('financing_period', 'Jangka Waktu Pembiayaan')}
              containerSx={{ flex: 1 }}
              value={financing_period.value}
              onChange={(val) => masintonChange('financing_period', val)}
              error={financing_period.error}
              helperText={financing_period.error && financing_period.errorMessage}
              disabled={disabled}
            />

            <Input
              label={getLabel('expected_profit', 'Ekspektasi Imbal Hasil Setara Dengan')}
              type="text"
              placeholder={getLabel('expected_profit', 'Ekspektasi Imbal Hasil Setara Dengan')}
              containerSx={{ flex: 1 }}
              value={expected_profit.value}
              onChange={(val) => masintonChange('expected_profit', val)}
              error={expected_profit.error}
              helperText={expected_profit.error && expected_profit.errorMessage}
              disabled={disabled}
            />
          </Box>
        </SectionTitle>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Input
          label="Jaminan / Penugasan Pemerintah"
          type="dropdown"
          dropdownList={governmentMandateList}
          placeholder="Jaminan / Penugasan Pemerintah"
          containerSx={{ flex: 1 }}
          value={government_guarantee.value}
          onChange={(val) => masintonMultiChange({
            government_guarantee: governmentMandateList.find((dt) => dt.value === val)?.value,
            government_guarantee_label: governmentMandateList.find((dt) => dt.value === val)?.label,
          })}
          error={government_guarantee.error}
          helperText={government_guarantee.error && government_guarantee.errorMessage}
          disabled={disabled}
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
          disabled={disabled}
        />
      </Box>
    </>
  );
};

export default AlMudharabahForm;
