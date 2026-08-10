import { useEffect } from 'react';

import { Box, Tooltip, useTheme, Checkbox } from '@mui/material';

import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Dropdown from '@/components/shared/Input/components/DropdownV2';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import CurrencyForm from '../../components/CurrencyForm';

import useAlMusyarakahMutanaqisah from './AlMusyarakahMutanaqisahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakahMutanaqisahForm = (props: SyariahFormsProps) => {
  const { onChangeSyariahForm, financingFacilityData } = props;
  const theme = useTheme();
  const { existing, facilityId, disabled } = props;

  const {
    governmentMandateList,
    masintonChange,
    masintonForm,
    masintonReplace,
    currencyDropdownList,
    masintonReset,
    Dprofit_share_type,
    Dprofit_share_review,
    Dujroh_review_type,
    Dujroh_payment_period,
    masintonMultiChange,
    Dujroh_review_period,
    isPartnershipSmiFacilityUnchanged,
    isPartnershipCustomerUnchanged,
  } = useAlMusyarakahMutanaqisah(props);

  const {
    debtorName,
    other_ujroh_review_period,
    other_ujroh_payment_period,
    mmq_object,
    profit_share_smi,
    profit_share_customer,
    expected_profit,
    government_guarantee,
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
    other_profit_share_review,
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
    currency_total_partnership,
    total_partnership_idr,
    total_partnership,
    exchange_rate_global,
  } = masintonForm;

  useEffect(() => {
    onChangeSyariahForm(
      {
        masintonChange: masintonChange,
        masintonForm: masintonForm,
        masintonReplace: masintonReplace,
      });
  }, [masintonForm]);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  function renderFormSyirkahSMI() {
    return (
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
          <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
            Syirkah SMI/Nilai Fasilitas Pembiayaan
          </TextStyle>
          {(existing || facilityId) && (
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
                  // Always try to get existing_partnership_smi_facility first, fallback to partnership_smi_facility
                  const existingPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_smi_facility')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'partnership_smi_facility')?.attributeValue;
                  const existingCurrencyPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_smi_facility')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_partnership_smi_facility')?.attributeValue;
                  const existingPlafondDifferenceSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'plafond_difference_partnership_smi_facility')?.attributeValue;

                  // Get exchange rate from API get-list-by-module
                  const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                  const exchangeRateFromApi = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 1;

                  // Current form values
                  const currentPartnershipSmiFacility = partnership_smi_facility.value ? parseFloat(partnership_smi_facility.value.toString().replace(/,/g, '')) : 0;
                  const currentCurrencySmiFacility = currency_partnership_smi_facility?.value;

                  // Parse existing values
                  const existingValue = existingPartnershipSmiFacility ? parseFloat(existingPartnershipSmiFacility.toString().replace(/,/g, '')) : 0;
                  const existingPlafondDifference = existingPlafondDifferenceSmiFacility ? parseFloat(existingPlafondDifferenceSmiFacility.toString().replace(/,/g, '')) : 0;

                  let existingUsdValue = 0;
                  let existingIdrValue = 0;
                  let currentUsdValue = 0;
                  let currentIdrValue = 0;
                  let usdDifference = 0;
                  let idrDifference = 0;

                  const isExisting = financingFacilityData && existingPartnershipSmiFacility;

                  if (isExisting) {
                    // Calculate existing values based on currency
                    if (existingCurrencyPartnershipSmiFacility === 'USD') {
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
                    if (currentCurrencySmiFacility === 'USD') {
                      currentUsdValue = currentPartnershipSmiFacility;
                      // Current IDR = USD * exchange rate from API (not input exchange rate)
                      currentIdrValue = exchangeRateFromApi > 0 ?
                        currentPartnershipSmiFacility * exchangeRateFromApi : 0;
                    } else {
                      currentIdrValue = currentPartnershipSmiFacility;
                      // Current USD = IDR / exchange rate from API (not input exchange rate)
                      currentUsdValue = exchangeRateFromApi > 0 ?
                        currentPartnershipSmiFacility / exchangeRateFromApi : 0;
                    }

                    // Calculate differences using exchange rate from API
                    if (currentCurrencySmiFacility === 'USD') {
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

                      {currency_partnership_smi_facility?.value === 'USD' && (
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

                      {currency_partnership_smi_facility?.value === 'USD' && (
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
          {(existing || facilityId) && (
            <Checkbox
              checked={isPartnershipSmiFacilityUnchanged}
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
            placeholder="Input Syirkah SMI/Nilai Fasilitas Pembiayaan"
            containerSx={{ flex: 1 }}
            value={{ currency: currency_partnership_smi_facility?.value, value: partnership_smi_facility.value }}
            onCurrencyChange={(val) => {
              if (val === 'IDR') {
                masintonMultiChange({
                  currency_partnership_smi_facility: val,
                  exchange_rate_global: '',
                  exchange_rate_partnership_smi_facility: '',
                  partnership_smi_facility_idr: '',
                });
              } else {
                const exchangeRateFromInput = exchange_rate_global.value;
                const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;
                const finalRate = exchangeRateFromInput || fallbackRate;

                masintonMultiChange({
                  currency_partnership_smi_facility: val,
                  exchange_rate_global: finalRate,
                  exchange_rate_partnership_smi_facility: finalRate,
                });
              }
            }}
            onChange={(val) => {
              masintonChange('partnership_smi_facility', val.value);
            }}
            error={partnership_smi_facility.error}
            helperText={partnership_smi_facility.error && partnership_smi_facility.errorMessage}
            disabled={disabled}
            disabledCurrency={disabled}
          />
        </RowWrapper>
        {currency_partnership_smi_facility?.value === 'USD' && (
          <Currency
            currencyList={currencyDropdownList}
            label="Syirkah SMI (dalam Rp)"
            placeholder="Syirkah SMI/Nilai Fasilitas Pembiayaan (dalam Rp)"
            containerSx={{ flex: 1 }}
            value={{ currency: 'IDR', value: partnership_smi_facility_idr.value }}
            disabled
            disabledCurrency={disabled}
          />
        )}
      </Box>
    );
  }

  function renderFormSyirkahNasabah() {
    return (
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
          <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
            Syirkah Nasabah/Mitra Syarik SMI
          </TextStyle>
          {(existing || facilityId) && (
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

                      {(currency_partnership_smi_facility?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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

                      {(currency_partnership_smi_facility?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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
          {(existing || facilityId) && (
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
            placeholder="Input Syirkah Nasabah/Mitra Syarik SMI"
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
            containerSx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, flex: 1 }}
            value={{ currency: 'IDR', value: partnership_customer_idr.value }}
            disabled
            disabledCurrency={disabled}
          />
        )}
      </Box>
    );
  }

  function renderFormNilaiHishah() {
    return (
      <CurrencyForm
        initialProps={{
          currency: currency_hishshah_value?.value || 'IDR',
          disabled: disabled,
          error: hishshah_value.error,
          errorMessage: hishshah_value.error && hishshah_value.errorMessage,
          label: 'Nilai Hishshah',
          onChange: (val) => {
            masintonChange('hishshah_value', val.value);
          },
          onCurrencyChange: (val) => {
            if (val.currency === 'IDR') {
              masintonMultiChange({
                currency_hishshah_value: val,
                exchange_rate_hishshah: '',
                hishshah_value_idr: '',
              });
            } else {
              masintonMultiChange({
                currency_hishshah_value: val,
                exchange_rate_hishshah:
                  currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
              });
            }
          },
          placeholder: 'Input Nilai Hishshah',
          value: hishshah_value.value || 'IDR',
        }}
        kursProps={{
          disabled: disabled,
          error: exchange_rate_hishshah.error,
          errorMessage: exchange_rate_hishshah.error && exchange_rate_hishshah.errorMessage,
          isMandatory: true,
          onChange: (val) => {
            masintonReplace({
              ...masintonForm,
              exchange_rate_hishshah: {
                error: false,
                errorMessage: '',
                value: val.value,
              },
            });
          },
          value: exchange_rate_hishshah.value,
        }}
        idrProps={{
          disabled: disabled,
          error: hishshah_value_idr.error,
          errorMessage: hishshah_value_idr.error && hishshah_value_idr.errorMessage,
          value: hishshah_value_idr.value,
        }}
      />
    );
  }

  function renderFormNilaiUjroh() {
    return (
      <CurrencyForm
        initialProps={{
          currency: currency_ujroh_value?.value || 'IDR',
          disabled: disabled,
          error: ujroh_value.error,
          errorMessage: ujroh_value.error && ujroh_value.errorMessage,
          label: 'Nilai Ujroh/Sewa',
          onChange: (val) => {
            masintonChange('ujroh_value', val.value);
          },
          onCurrencyChange: (val) => {
            if (val.currency === 'IDR') {
              masintonMultiChange({
                currency_ujroh_value: val,
                exchange_rate_ujroh: '',
                ujroh_value_idr: '',
              });
            } else {
              masintonMultiChange({
                currency_ujroh_value: val,
                exchange_rate_ujroh:
                  currencyDropdownList.find((dt) => dt.value === val)?.rate,
              });
            }
          },
          placeholder: 'Input Nilai Ujroh/Sewa',
          value: ujroh_value.value || 'IDR',
        }}
        kursProps={{
          disabled: disabled,
          error: exchange_rate_ujroh.error,
          errorMessage: exchange_rate_ujroh.error && exchange_rate_ujroh.errorMessage,
          isMandatory: true,
          onChange: (val) => {
            masintonReplace({
              ...masintonForm,
              exchange_rate_ujroh: {
                error: false,
                errorMessage: '',
                value: val.value,
              },
            });
          },
          value: exchange_rate_ujroh.value,
        }}
        idrProps={{
          disabled: disabled,
          error: ujroh_value_idr.error,
          errorMessage: ujroh_value_idr.error && ujroh_value_idr.errorMessage,
          value: ujroh_value_idr.value,
        }}
      />
    );
  }

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

        <Input
          isMandatory
          label="Objek MMQ"
          type="text"
          placeholder="Objek MMQ"
          containerSx={{ flex: 1 }}
          value={mmq_object.value}
          onChange={(val) => masintonChange('mmq_object', val)}
          error={mmq_object.error}
          helperText={mmq_object.error && mmq_object.errorMessage}
          disabled={disabled}
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
        {(currency_partnership_smi_facility?.value === 'USD' || currency_partnership_customer?.value === 'USD') &&
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
          {renderFormSyirkahSMI()}
          {renderFormSyirkahNasabah()}
        </Box>

        <Box
          sx={{
            borderTop: currency_partnership_customer?.value === 'USD' || currency_partnership_smi_facility?.value === 'USD' ? '1px solid #D3D3D3' : '',
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            marginY: currency_partnership_customer?.value === 'USD' || currency_partnership_smi_facility?.value === 'USD' ? theme.spacing(3) : '',
            paddingTop: theme.spacing(3),
          }}
        >
          {
            total_partnership.value !== null &&
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                  Total Syirkah
                </TextStyle>
                {(existing || facilityId) && (
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

                        const currentPartnershipSmiFacility = partnership_smi_facility.value ? parseFloat(partnership_smi_facility.value.toString().replace(/,/g, '')) : 0;
                        const currentPartnershipCustomer = partnership_customer.value ? parseFloat(partnership_customer.value.toString().replace(/,/g, '')) : 0;
                        const currentCurrencySmiFacility = currency_partnership_smi_facility?.value;
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
                          const existingPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) =>
                            attr.attributeKey === 'existing_core_partnership_smi_facility')?.attributeValue ||
                            financingFacilityData?.attributes?.find((attr) =>
                              attr.attributeKey === 'partnership_smi_facility')?.attributeValue;
                          const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) =>
                            attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue ||
                            financingFacilityData?.attributes?.find((attr) =>
                              attr.attributeKey === 'partnership_customer')?.attributeValue;
                          const existingCurrencyPartnershipSmiFacility =
                           financingFacilityData?.attributes?.find((attr) => {
                             return attr.attributeKey === 'existing_core_currency_partnership_smi_facility';
                           })?.attributeValue || financingFacilityData?.attributes?.find((attr) => {
                             return attr.attributeKey === 'currency_partnership_smi_facility';
                           })?.attributeValue;
                          const existingCurrencyPartnershipCustomer =
                           financingFacilityData?.attributes?.find((attr) => {
                             return attr.attributeKey === 'existing_core_currency_partnership_customer';
                           })?.attributeValue || financingFacilityData?.attributes?.find((attr) => {
                             return attr.attributeKey === 'currency_partnership_customer';
                           })?.attributeValue;

                          // Parse existing values
                          const existingSmiFacilityValue = existingPartnershipSmiFacility ? parseFloat(existingPartnershipSmiFacility.toString().replace(/,/g, '')) : 0;
                          const existingCustomerValue = existingPartnershipCustomer ? parseFloat(existingPartnershipCustomer.toString().replace(/,/g, '')) : 0;

                          // Convert to IDR for calculation using API exchange rate
                          let existingSmiFacilityIdr = 0;
                          let existingCustomerIdr = 0;

                          if (existingCurrencyPartnershipSmiFacility === 'USD') {
                            existingSmiFacilityIdr = existingSmiFacilityValue * exchangeRateFromApi;
                          } else {
                            existingSmiFacilityIdr = existingSmiFacilityValue;
                          }

                          if (existingCurrencyPartnershipCustomer === 'USD') {
                            existingCustomerIdr = existingCustomerValue * exchangeRateFromApi;
                          } else {
                            existingCustomerIdr = existingCustomerValue;
                          }

                          // Total existing IDR
                          existingIdrValue = existingSmiFacilityIdr + existingCustomerIdr;
                          // Total existing USD
                          existingUsdValue = exchangeRateFromApi > 0 ? existingIdrValue / exchangeRateFromApi : 0;

                          // Calculate current input values - calculate total from individual values like other tooltips
                          let currentTotalUsd = 0;
                          let currentTotalIdr = 0;

                          // Calculate SMI Facility contribution
                          if (currentCurrencySmiFacility === 'USD') {
                            currentTotalUsd += currentPartnershipSmiFacility;
                            currentTotalIdr += currentPartnershipSmiFacility * exchangeRateFromApi;
                          } else {
                            currentTotalIdr += currentPartnershipSmiFacility;
                            currentTotalUsd += currentPartnershipSmiFacility / exchangeRateFromApi;
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

                            {(currency_partnership_smi_facility?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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

                            {(currency_partnership_smi_facility?.value === 'USD' || currency_partnership_customer?.value === 'USD') && (
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
                value={{ currency: currency_total_partnership.value, value: total_partnership.value }}
                disabledCurrency={disabled}
              />
            </Box>
          }

          {
            currency_total_partnership.value !== 'IDR' &&
            <Currency
              currencyList={currencyDropdownList}
              label="Total Syirkah (dalam Rp)"
              placeholder="Total Syirkah (dalam Rp)"
              value={{ currency: 'IDR', value: total_partnership_idr.value }}
              disabled
              disabledCurrency={disabled}
            />
          }
        </Box>

        {/* Legend for Checkboxes */}
        {(existing || facilityId) && financingFacilityData && (
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
      </Box>

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
              placeholder="Nisbah Bagi Hasil SMI (%)"
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
              placeholder="Nisbah Bagi Hasil Nasabah (%)"
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
              label="Ekspektasi Imbal Hasil Setara Dengan"
              type="text"
              placeholder="Ekspektasi Imbal Hasil Setara Dengan"
              containerSx={{ flex: 1 }}
              value={expected_profit.value}
              onChange={(val) => masintonChange('expected_profit', val)}
              error={expected_profit.error}
              helperText={expected_profit.error && expected_profit.errorMessage}
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
          </Box>

          {currency_hishshah_value?.value !== 'IDR' || currency_ujroh_value?.value !== 'IDR' ?
            <>
              <Box
                sx={{
                  borderTop: '1px solid #D3D3D3',
                  display: 'grid',
                  gridGap: theme.spacing(3),
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  padding: theme.spacing(3),
                }}
              >
                {renderFormNilaiHishah()}
              </Box>
              <Box
                sx={{
                  borderTop: '1px solid #D3D3D3',
                  display: 'grid',
                  gridGap: theme.spacing(3),
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  padding: theme.spacing(3),
                }}
              >
                {renderFormNilaiUjroh()}
              </Box>
            </>
            :
            <Box
              sx={{
                borderTop: '1px solid #D3D3D3',
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                padding: theme.spacing(3),
              }}
            >
              {renderFormNilaiHishah()}
              {renderFormNilaiUjroh()}
            </Box>
          }

          <Box
            sx={{
              borderTop: '1px solid #D3D3D3',
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              padding: theme.spacing(3),
            }}
          >
            <Dropdown
              label="Periode Pembayaran Ujroh/Sewa"
              placeholder="Periode Pembayaran Ujroh/Sewa"
              type="dropdown"
              containerSx={{ flex: 1 }}
              dropdownList={Dujroh_payment_period}
              value={{ dropdown: ujroh_payment_period.value, value: other_ujroh_payment_period.value }}
              onChange={(val) => masintonMultiChange({
                other_ujroh_payment_period: val.value,
                ujroh_payment_period: Dujroh_payment_period.find((dt) => dt.value === val.dropdown)?.value,
                ujroh_payment_period_label: Dujroh_payment_period.find((dt) => dt.value === val.dropdown)?.label,
              })}
              disabled={disabled}
            />

            <Input
              label="Jenis Review Ujroh/Sewa"
              placeholder="Jenis Review Ujroh/Sewa"
              type="dropdown"
              dropdownList={Dujroh_review_type}
              containerSx={{ flex: 1 }}
              value={ujroh_review_type.value}
              onChange={(val) => masintonMultiChange({
                ujroh_review_type: Dujroh_review_type.find((dt) => dt.value === val)?.value,
                ujroh_review_type_label: Dujroh_review_type.find((dt) => dt.value === val)?.label,
              })}
              error={ujroh_review_type.error}
              helperText={ujroh_review_type.error && ujroh_review_type.errorMessage}
              disabled={disabled}
            />

            <Dropdown
              label="Masa Review Ujroh/Sewa"
              type="dropdown"
              dropdownList={Dujroh_review_period}
              placeholder="Masa Review Ujroh/Sewa"
              containerSx={{ flex: 1 }}
              value={{ dropdown: ujroh_review_period.value, value: other_ujroh_review_period.value }}
              onChange={(val) => masintonMultiChange({
                other_ujroh_review_period: val.value,
                ujroh_review_period: Dujroh_review_period.find((dt) => dt.value === val.dropdown)?.value,
                ujroh_review_period_label: Dujroh_review_period.find((dt) => dt.value === val.dropdown)?.label,
              })}
              error={ujroh_review_period.error}
              helperText={ujroh_review_period.error && ujroh_review_period.errorMessage}
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

export default AlMusyarakahMutanaqisahForm;
