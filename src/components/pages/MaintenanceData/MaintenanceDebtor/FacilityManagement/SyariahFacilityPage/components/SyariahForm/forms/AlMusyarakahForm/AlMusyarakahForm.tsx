import { Box, Checkbox, Tooltip, useTheme } from '@mui/material';
import { d } from '@tanstack/react-query-devtools/build/legacy/devtools-ZdlRR-0P';

import Currency from '@/components/shared/Currency';
import CurrencyForm from '@/components/shared/CurrencyForm';
import CurrencyFormWithoutKurs from '@/components/shared/CurrencyForm/CurrencyFormWithoutKurs';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Dropdown from '@/components/shared/Input/components/DropdownV2';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useAlMusyarakah from './AlMusyarakah.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakah = (props: SyariahFormsProps) => {
  const theme = useTheme();
  const { existing, facilityId, disabled } = props;

  const {
    masintonChange,
    masintonForm,
    masintonMultiChange,
    Dprofit_share_type,
    Dprofit_share_review,
    Dfund_usage_purpose,
    financingFacilityData,
    governmentMandateList,
    currencyDropdownList,
    isPartnershipSmiUnchanged,
    isPartnershipCustomerUnchanged,
  } = useAlMusyarakah(props);

  const {
    debtorName,
    financing_period,
    government_guarantee,
    fund_usage_purpose,
    profit_share_customer,
    profit_share_review,
    profit_share_smi,
    profit_share_type,
    other_profit_share_review,
    expected_profit,
    remarks,
    currency_partnership_customer,
    partnership_customer_idr,
    exchange_rate_partnership_customer,
    partnership_customer,
    currency_partnership_smi,
    partnership_smi_idr,
    exchange_rate_partnership_smi,
    partnership_smi,
    currency_total_partnership,
    total_partnership_idr,
    total_partnership,
    exchange_rate_global,
  } = masintonForm;

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING';

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
          label="Mitra Syarik SMI"
          type="text"
          placeholder="Mitra Syarik SMI"
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
        {(currency_partnership_smi?.value === 'USD' || currency_partnership_customer?.value === 'USD') &&
          <Currency
            isMandatory={true}
            currencyList={currencyDropdownList}
            label="Konversi Mata Uang"
            disabledCurrency
            placeholder="Konversi Mata Uang"
            containerSx={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: theme.spacing(3) }}
            value={{
              currency: 'IDR',
              value: financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_global')?.attributeValue || 1,
            }}
            onChange={(val) => {
              masintonChange('exchange_rate_global', val.value);
            }}
            error={exchange_rate_global.error}
            helperText={exchange_rate_global.error && exchange_rate_global.errorMessage}
            disabled={disabled}
          />
        }

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >

          <Box sx={{ position: 'relative' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                Syirkah SMI
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
                      // Get existing values from API attributes
                      // Always try to get existing_partnership_smi first, fallback to partnership_smi
                      const existingPartnershipSmi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_smi')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_smi')?.attributeValue;
                      // Always use existing_currency_smi for tooltip, fallback to currency_partnership_smi
                      const existingCurrencyPartnershipSmi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_smi')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_smi')?.attributeValue;
                      const existingPlafondDifferenceSmi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'plafond_difference_partnership_smi')?.attributeValue;

                      // Get exchange rate from API get-list-by-module
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 1;

                      // Current form values
                      const currentPartnershipSmi = partnership_smi.value ? parseFloat(partnership_smi.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencySmi = currency_partnership_smi?.value;

                      // Parse existing values
                      const existingValue = existingPartnershipSmi ? parseFloat(existingPartnershipSmi.toString().replace(/,/g, '')) : 0;
                      const existingPlafondDifference = existingPlafondDifferenceSmi ? parseFloat(existingPlafondDifferenceSmi.toString().replace(/,/g, '')) : 0;

                      let existingUsdValue = 0;
                      let existingIdrValue = 0;
                      let currentUsdValue = 0;
                      let currentIdrValue = 0;
                      let usdDifference = 0;
                      let idrDifference = 0;

                      const isExisting = financingFacilityData && existingPartnershipSmi;

                      if (isExisting) {
                        // Calculate existing values based on currency
                        if (existingCurrencyPartnershipSmi === 'USD') {
                          // Use existing value directly (no plafond_difference calculation)
                          existingUsdValue = existingValue;
                          // Existing IDR = USD * exchange rate from API
                          existingIdrValue = existingUsdValue * exchangeRateFromApi;
                        } else {
                          // Use existing value directly (no plafond_difference calculation)
                          existingIdrValue = existingValue;
                          // Existing USD = IDR / exchange rate from API
                          existingUsdValue = exchangeRateFromApi > 0 ? existingIdrValue / exchangeRateFromApi : 0;
                        }

                        // Calculate current input values in both currencies using exchange rate from API
                        if (currentCurrencySmi === 'USD') {
                          currentUsdValue = currentPartnershipSmi;
                          // Current IDR = USD * exchange rate from API (not input exchange rate)
                          currentIdrValue = exchangeRateFromApi > 0 ? currentPartnershipSmi * exchangeRateFromApi : 0;
                        } else {
                          currentIdrValue = currentPartnershipSmi;
                          // Current USD = IDR / exchange rate from API (not input exchange rate)
                          currentUsdValue = exchangeRateFromApi > 0 ? currentPartnershipSmi / exchangeRateFromApi : 0;
                        }

                        // Calculate differences using exchange rate from API
                        if (currentCurrencySmi === 'USD') {
                          // If current currency is USD, difference USD = current - existing USD
                          usdDifference = currentUsdValue - existingUsdValue;
                          // Difference IDR = difference USD * exchange rate from API
                          idrDifference = usdDifference * exchangeRateFromApi;
                        } else {
                          // If current currency is IDR, difference IDR = current - existing IDR
                          idrDifference = currentIdrValue - existingIdrValue;
                          // Difference USD = difference IDR / exchange rate from API
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

                          {currency_partnership_smi?.value === 'USD' && (
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

                          {currency_partnership_smi?.value === 'USD' && (
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
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              )}
            </Box>
            <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
              {(existing || facilityId) && financingFacilityData && showTooltips && (
                <Checkbox
                  checked={isPartnershipSmiUnchanged}
                  disabled
                  sx={{
                    '&.Mui-checked.Mui-disabled': {
                      color: theme.palette.grey[400],
                    },
                    '&.Mui-disabled': {
                      color: theme.palette.grey[400],
                    },
                  }}
                />
              )}
              <Currency
                currencyList={currencyDropdownList}
                isMandatory={false}
                label=""
                placeholder="Input Syirkah SMI"
                containerSx={{ flex: 1 }}
                value={{ currency: currency_partnership_smi?.value, value: partnership_smi.value }}
                onCurrencyChange={(val) => {
                  if (val === 'IDR') {
                    masintonMultiChange({
                      currency_partnership_smi: val,
                      exchange_rate_global: '',
                      exchange_rate_partnership_smi: '',
                      partnership_smi_idr: '',
                    });
                  } else {
                    const exchangeRateFromInput = exchange_rate_global.value;
                    const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;
                    const finalRate = exchangeRateFromInput || fallbackRate;

                    masintonMultiChange({
                      currency_partnership_smi: val,
                      exchange_rate_global: finalRate,
                      exchange_rate_partnership_smi: finalRate,
                    });
                  }
                }}
                onChange={(val) => {
                  masintonChange('partnership_smi', val.value);
                }}
                error={partnership_smi.error}
                helperText={partnership_smi.error && partnership_smi.errorMessage}
                disabled={disabled}
                disabledCurrency={disabled}
              />
            </RowWrapper>
            {currency_partnership_smi?.value === 'USD' && (
              <Currency
                currencyList={currencyDropdownList}
                label="Syirkah SMI (dalam Rp)"
                placeholder="Syirkah SMI (dalam Rp)"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: partnership_smi_idr.value }}
                disabled
                disabledCurrency={disabled}
              />
            )}
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                Syirkah Nasabah / Mitra Syarik SMI
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
                      // Get existing values from API attributes
                      // Always try to get existing_partnership_customer first, fallback to partnership_customer
                      const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_customer')?.attributeValue;
                      // Always use existing_currency_customer for tooltip, fallback to currency_partnership_customer
                      const existingCurrencyPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_customer')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_customer')?.attributeValue;
                      const existingPlafondDifferenceCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'plafond_difference_partnership_customer')?.attributeValue;

                      // Get exchange rate from API get-list-by-module
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 1;

                      // Current form values
                      const currentPartnershipCustomer = partnership_customer.value ? parseFloat(partnership_customer.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencyCustomer = currency_partnership_customer?.value;

                      // Parse existing values
                      const existingValue = existingPartnershipCustomer ? parseFloat(existingPartnershipCustomer.toString().replace(/,/g, '')) : 0;
                      const existingPlafondDifference = existingPlafondDifferenceCustomer ? parseFloat(existingPlafondDifferenceCustomer.toString().replace(/,/g, '')) : 0;

                      let existingUsdValue = 0;
                      let existingIdrValue = 0;
                      let currentUsdValue = 0;
                      let currentIdrValue = 0;
                      let usdDifference = 0;
                      let idrDifference = 0;

                      const isExisting = financingFacilityData && existingPartnershipCustomer;

                      if (isExisting) {
                        // Calculate existing values based on currency
                        if (existingCurrencyPartnershipCustomer === 'USD') {
                          // Use existing value directly (no plafond_difference calculation)
                          existingUsdValue = existingValue;
                          // Existing IDR = USD * exchange rate from API
                          existingIdrValue = existingUsdValue * exchangeRateFromApi;
                        } else {
                          // Use existing value directly (no plafond_difference calculation)
                          existingIdrValue = existingValue;
                          // Existing USD = IDR / exchange rate from API
                          existingUsdValue = exchangeRateFromApi > 0 ? existingIdrValue / exchangeRateFromApi : 0;
                        }

                        // Calculate current input values in both currencies using exchange rate from API
                        if (currentCurrencyCustomer === 'USD') {
                          currentUsdValue = currentPartnershipCustomer;
                          // Current IDR = USD * exchange rate from API (not input exchange rate)
                          currentIdrValue = exchangeRateFromApi > 0
                            ? currentPartnershipCustomer * exchangeRateFromApi
                            : 0;
                        } else {
                          currentIdrValue = currentPartnershipCustomer;
                          // Current USD = IDR / exchange rate from API (not input exchange rate)
                          currentUsdValue = exchangeRateFromApi > 0
                            ? currentPartnershipCustomer / exchangeRateFromApi
                            : 0;
                        }

                        // Calculate differences using exchange rate from API
                        if (currentCurrencyCustomer === 'USD') {
                          // If current currency is USD, difference USD = current - existing USD
                          usdDifference = currentUsdValue - existingUsdValue;
                          // Difference IDR = difference USD * exchange rate from API
                          idrDifference = usdDifference * exchangeRateFromApi;
                        } else {
                          // If current currency is IDR, difference IDR = current - existing IDR
                          idrDifference = currentIdrValue - existingIdrValue;
                          // Difference USD = difference IDR / exchange rate from API
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

                          {(currency_partnership_smi?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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

                          {(currency_partnership_smi?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              )}
            </Box>
            <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
              {(existing || facilityId) && financingFacilityData && showTooltips && (
                <Checkbox
                  checked={isPartnershipCustomerUnchanged}
                  disabled
                  sx={{
                    '&.Mui-checked.Mui-disabled': {
                      color: theme.palette.grey[400],
                    },
                    '&.Mui-disabled': {
                      color: theme.palette.grey[400],
                    },
                  }}
                />
              )}
              <Currency
                currencyList={currencyDropdownList}
                isMandatory={false}
                label=""
                placeholder="Input Syirkah Nasabah / Mitra Syarik SMI"
                containerSx={{ flex: 1 }}
                value={{ currency: currency_partnership_customer?.value, value: partnership_customer.value }}
                onCurrencyChange={(val) => {
                  if (val === 'IDR') {
                    masintonMultiChange({
                      currency_partnership_customer: val,
                      exchange_rate_global: '',
                      exchange_rate_partnership_customer: '',
                      partnership_customer_idr: '',
                    });
                  } else {
                    const exchangeRateFromInput = exchange_rate_global.value;
                    const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;
                    const finalRate = exchangeRateFromInput || fallbackRate;

                    masintonMultiChange({
                      currency_partnership_customer: val,
                      exchange_rate_global: finalRate,
                      exchange_rate_partnership_customer: finalRate,
                    });
                  }
                }}
                onChange={(val) => {
                  masintonChange('partnership_customer', val.value);
                }}
                error={partnership_customer.error}
                helperText={partnership_customer.error && partnership_customer.errorMessage}
                disabled={disabled}
                disabledCurrency={disabled}
              />
            </RowWrapper>
            {currency_partnership_customer?.value === 'USD' && (
              <Currency
                currencyList={currencyDropdownList}
                label="Syirkah Nasabah (dalam Rp)"
                placeholder="Syirkah Nasabah (dalam Rp)"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: partnership_customer_idr.value }}
                disabled
                disabledCurrency={disabled}
              />
            )}
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                Total Syirkah
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
                      // Get existing values from API attributes
                      const existingTotalPartnership = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'total_partnership')?.attributeValue;
                      const existingCurrencyTotalPartnership = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_total_partnership')?.attributeValue;

                      // Get exchange rate from API get-list-by-module - ALWAYS use fixed rate for tooltip
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 1;

                      // Current form values - use individual values like other tooltips to avoid exchange rate changes
                      const currentPartnershipSmi = partnership_smi.value ? parseFloat(partnership_smi.value.toString().replace(/,/g, '')) : 0;
                      const currentPartnershipCustomer = partnership_customer.value ? parseFloat(partnership_customer.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencySmi = currency_partnership_smi?.value;
                      const currentCurrencyCustomer = currency_partnership_customer?.value;

                      // Parse existing values
                      const existingValue = existingTotalPartnership ? parseFloat(existingTotalPartnership.toString().replace(/,/g, '')) : 0;

                      let existingUsdValue = 0;
                      let existingIdrValue = 0;
                      let currentUsdValue = 0;
                      let currentIdrValue = 0;
                      let usdDifference = 0;
                      let idrDifference = 0;

                      const isExisting = financingFacilityData && existingTotalPartnership;

                      if (isExisting) {
                        const existingPartnershipSmi = financingFacilityData?.attributes?.find((attr) =>
                          attr.attributeKey === 'existing_core_partnership_smi')?.attributeValue ||
                          financingFacilityData?.attributes?.find((attr) =>
                            attr.attributeKey === 'partnership_smi')?.attributeValue;
                        const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) =>
                          attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue ||
                          financingFacilityData?.attributes?.find((attr) =>
                            attr.attributeKey === 'partnership_customer')?.attributeValue;
                        const existingCurrencyPartnershipSmi = financingFacilityData?.attributes?.find((attr) => {
                          return attr.attributeKey === 'existing_core_currency_smi';
                        })?.attributeValue || financingFacilityData?.attributes?.find((attr) => {
                          return attr.attributeKey === 'currency_partnership_smi';
                        })?.attributeValue;
                        const existingCurrencyPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => {
                          return attr.attributeKey === 'existing_core_currency_customer';
                        })?.attributeValue || financingFacilityData?.attributes?.find((attr) => {
                          return attr.attributeKey === 'currency_partnership_customer';
                        })?.attributeValue;

                        // Parse existing values
                        const existingSmiValue = existingPartnershipSmi ? parseFloat(existingPartnershipSmi.toString().replace(/,/g, '')) : 0;
                        const existingCustomerValue = existingPartnershipCustomer ? parseFloat(existingPartnershipCustomer.toString().replace(/,/g, '')) : 0;

                        // Convert to IDR for calculation using API exchange rate
                        let existingSmiIdr = 0;
                        let existingCustomerIdr = 0;

                        if (existingCurrencyPartnershipSmi === 'USD') {
                          existingSmiIdr = existingSmiValue * exchangeRateFromApi;
                        } else {
                          existingSmiIdr = existingSmiValue;
                        }

                        if (existingCurrencyPartnershipCustomer === 'USD') {
                          existingCustomerIdr = existingCustomerValue * exchangeRateFromApi;
                        } else {
                          existingCustomerIdr = existingCustomerValue;
                        }

                        // Total existing IDR
                        existingIdrValue = existingSmiIdr + existingCustomerIdr;
                        // Total existing USD
                        existingUsdValue = exchangeRateFromApi > 0 ? existingIdrValue / exchangeRateFromApi : 0;

                        // DEBUG: Log existing value calculations


                        // Calculate current input values - calculate total from indiviadual values like other tooltips
                        let currentTotalUsd = 0;
                        let currentTotalIdr = 0;

                        // Calculate SMI contribution
                        if (currentCurrencySmi === 'USD') {
                          currentTotalUsd += currentPartnershipSmi;
                          currentTotalIdr += currentPartnershipSmi * exchangeRateFromApi;
                        } else {
                          currentTotalIdr += currentPartnershipSmi;
                          currentTotalUsd += currentPartnershipSmi / exchangeRateFromApi;
                        }

                        // Calculate Customer contribution
                        if (currentCurrencyCustomer === 'USD') {
                          currentTotalUsd += currentPartnershipCustomer;
                          currentTotalIdr += currentPartnershipCustomer * exchangeRateFromApi;
                        } else {
                          currentTotalIdr += currentPartnershipCustomer;
                          currentTotalUsd += currentPartnershipCustomer / exchangeRateFromApi;
                        }

                        // Set current values for difference calculation
                        currentUsdValue = currentTotalUsd;
                        currentIdrValue = currentTotalIdr;

                        usdDifference = currentUsdValue - existingUsdValue;
                        idrDifference = currentIdrValue - existingIdrValue;
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

                          {(currency_partnership_smi?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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

                          {(currency_partnership_smi?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              )}
            </Box>
            <Currency
              currencyList={currencyDropdownList}
              label=""
              disabled
              placeholder="Total Syirkah"
              value={{
                currency: (currency_partnership_smi?.value === 'USD' || currency_partnership_customer?.value === 'USD') ? 'USD' : 'IDR',
                value: total_partnership.value,
              }}
              disabledCurrency={disabled}
            />
          </Box>

          {(currency_partnership_smi?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.grey[400]}>
                  Total Syirkah (dalam Rp)
                </TextStyle>
              </Box>
              <Currency
                currencyList={currencyDropdownList}
                label=""
                placeholder="Total Syirkah (dalam Rp)"
                value={{ currency: 'IDR', value: total_partnership_idr.value }}
                disabled
                disabledCurrency={disabled}
              />
            </Box>
          )}
        </Box>

        {/* Legend for Checkboxes */}
        {(existing || facilityId) && financingFacilityData && showTooltips && (
          <Box
            sx={{
              backgroundColor: theme.palette.grey[50],
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 1,
              mt: 2,
              p: 2,
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <Icon iconName="information-shape" />
              <TextStyle variant="body4" color={theme.palette.text.secondary} sx={{ lineHeight: 1.5 }}>
                Checkbox pada Syirkah SMI dan Syirkah Nasabah akan aktif
                apabila tidak ada perubahan nominal dari nilai existing.
              </TextStyle>
            </Box>
          </Box>
        )}
      </Box >

      <Box border="1px solid #D3D3D3" borderRadius="10px">
        <SectionTitle
          title={
            <TextStyle
              variant="body3"
              weight={600}
              color={theme.palette.primary.main}
              sx={{ py: theme.spacing(1) }}
            >
              More Fields:
            </TextStyle>
          }
          sx={{
            border: 0,
            color: '#34282C !important',
            fontSize: '0.9375vw',
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
              label="Nisbah Bagi Hasil SMI (%)"
              type="text"
              placeholder="Input Nisbah Bagi Hasil SMI (%)"
              containerSx={{ flex: 1 }}
              value={profit_share_smi.value}
              onChange={(val) => masintonChange('profit_share_smi', val)}
              error={profit_share_smi.error}
              helperText={profit_share_smi.error && profit_share_smi.errorMessage}
              disabled={disabled}
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
              disabled={disabled}
            />

            <Dropdown
              label="Review Nisbah Bagi Hasil"
              containerSx={{ flex: 1 }}
              placeholder="Review Nisbah Bagi Hasil"
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
              label="Jenis Nisbah Bagi Hasil"
              type="dropdown"
              dropdownList={Dprofit_share_type}
              placeholder="Jenis Nisbah Bagi Hasil"
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
              label="Tujuan Penggunaan Dana Musyarakah"
              type="dropdown"
              dropdownList={Dfund_usage_purpose}
              placeholder="Tujuan Penggunaan Dana Musyarakah"
              containerSx={{ flex: 1 }}
              value={fund_usage_purpose.value}
              onChange={(val) => masintonMultiChange({
                fund_usage_purpose: Dfund_usage_purpose.find((dt) => dt.value === val)?.value,
                fund_usage_purpose_label: Dfund_usage_purpose.find((dt) => dt.value === val)?.label,
              })}
              error={fund_usage_purpose.error}
              helperText={fund_usage_purpose.error && fund_usage_purpose.errorMessage}
              disabled={disabled}
            />

            <Input
              label="Jangka Waktu Pembiayaan"
              placeholder="Jangka Waktu Pembiayaan"
              containerSx={{ flex: 1 }}
              value={financing_period.value}
              onChange={(val) => masintonChange('financing_period', val)}
              error={financing_period.error}
              helperText={financing_period.error && financing_period.errorMessage}
              disabled={disabled}
            />

            <Input
              label="Ekspektasi Imbal Hasil Setara Dengan"
              type="text"
              placeholder="Input Ekspektasi Imbal Hasil Setara Dengan"
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
          disabled={disabled}
          error={government_guarantee.error}
          helperText={government_guarantee.error && government_guarantee.errorMessage}
        />

        <Input
          label="Keterangan"
          type="area"
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

export default AlMusyarakah;
