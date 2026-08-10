import { Box, Checkbox, Tooltip, useTheme } from '@mui/material';

import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import CurrencyCell from '../components/CurrencyCell/CurrencyCell';

import { additionalFormData } from './AlMusyarakahMutanaqisah.form';
import useAlMusyarakahMutanaqisah from './AlMusyarakahMutanaqisahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMusyarakahMutanaqisahForm = (props: SyariahFormsProps) => {

  const theme = useTheme();

  const {
    facilityData,
    financingFacilityData,
    additionalData,
    bottomSectionData,
    totalPartnership,
    currencyDropdownList,
  } = useAlMusyarakahMutanaqisah(props);

  const {
    total_partnership,
    currency_total_partnership,
    total_partnership_idr,
  } = totalPartnership;

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING' || financingFacilityData?.orderType === 'New From Existing';

  return (
    <>
      <ColumnWrapper>
        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ py: theme.spacing(1) }}
        >
          Informasi Fasilitas:
        </TextStyle>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {facilityData.map((item, index) =>
            <Cell key={index} title={item.label} value={item.value} />,
          )}
        </Box>
      </ColumnWrapper>
      <Box border="1px solid #D3D3D3" borderRadius="10px" padding={theme.spacing(3)}>
        <ColumnWrapper>
          {financingFacilityData?.currency_partnership_smi_facility === 'USD' && (
            <Box
              sx={{
                marginBottom: '10px',
              }}
            >
              <Cell
                title="Konversi Mata Uang"
                value={financingFacilityData?.currencyOrderValueAfterExchangeRate !== null ?
                  financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_global')?.attributeValue : '-'}
              />
            </Box>
          )}
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Cell
              titleNode={
                <>
                  <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                    Syirkah SMI/Nilai Fasilitas Pembiayaan
                  </TextStyle>
                  <TextStyle variant="body4" weight={600} color={theme.palette.error.main} sx={{ ml: 0.5 }}>
                    *
                  </TextStyle>
                  {showTooltips && (
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
                          // Get existing values from API attributes - use existing_core values for detail view
                          const existingPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_smi_facility')?.attributeValue || '0';
                          const existingCurrencyPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_smi_facility')?.attributeValue || 'IDR';

                          // Get exchange rate from data or fallback to API
                          const exchangeRateAttr = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_global')?.attributeValue;
                          const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                          const exchangeRateFromApi = (exchangeRateAttr && exchangeRateAttr !== '0') ?
                            parseFloat(exchangeRateAttr.toString().replace(/,/g, '')) :
                            (usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000);

                          // Current form values
                          const currentPartnershipSmiFacility = financingFacilityData?.partnership_smi_facility ? parseFloat(financingFacilityData.partnership_smi_facility.toString().replace(/,/g, '')) : 0;
                          const currentCurrencySmiFacility = financingFacilityData?.currency_partnership_smi_facility || 'IDR';

                          // Parse existing values
                          const existingValue = existingPartnershipSmiFacility ? parseFloat(existingPartnershipSmiFacility.toString().replace(/,/g, '')) : 0;

                          let existingUsdValue = 0;
                          let existingIdrValue = 0;
                          let currentUsdValue = 0;
                          let currentIdrValue = 0;
                          let usdDifference = 0;
                          let idrDifference = 0;

                          const isExisting = financingFacilityData && existingPartnershipSmiFacility;

                          if (isExisting) {
                            // Calculate existing values based on currency using current exchange rate
                            if (existingCurrencyPartnershipSmiFacility === 'USD') {
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
                            if (currentCurrencySmiFacility === 'USD') {
                              currentUsdValue = currentPartnershipSmiFacility;
                              currentIdrValue = exchangeRateFromApi > 0 ?
                                currentPartnershipSmiFacility * exchangeRateFromApi : 0;
                            } else {
                              currentIdrValue = currentPartnershipSmiFacility;
                              currentUsdValue = exchangeRateFromApi > 0 ?
                                currentPartnershipSmiFacility / exchangeRateFromApi : 0;
                            }

                            // Calculate differences using exchange rate
                            if (currentCurrencySmiFacility === 'USD') {
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

                              {currentCurrencySmiFacility === 'USD' && (
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

                              {currentCurrencySmiFacility === 'USD' && (
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
                        <Icon
                          iconName="new-info"
                          sx={{
                            '& path': { fill: '#D07C1B' },
                          }}
                        />
                      </Box>
                    </Tooltip>
                  )}
                </>
              }
              value={
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  {showTooltips && (
                    <Checkbox
                      checked={
                        (() => {
                          const existingPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_smi_facility')?.attributeValue;
                          const existingCurrencySmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_smi_facility')?.attributeValue;
                          const currentPartnershipSmiFacility = financingFacilityData?.partnership_smi_facility;
                          const currentCurrencySmiFacility = financingFacilityData?.currency_partnership_smi_facility;

                          if (existingPartnershipSmiFacility && currentPartnershipSmiFacility) {
                            const existingValue = parseFloat(existingPartnershipSmiFacility.toString().replace(/,/g, ''));
                            const currentValue = parseFloat(currentPartnershipSmiFacility.toString().replace(/,/g, ''));
                            const isValueSame = existingValue === currentValue;
                            const isCurrencySame = existingCurrencySmiFacility === currentCurrencySmiFacility;
                            return !isValueSame || !isCurrencySame;
                          }
                          return false;
                        })()
                      }
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
                  <span>{financingFacilityData?.currency_partnership_smi_facility + ' ' + financingFacilityData.partnership_smi_facility}</span>
                </Box>
              }
            />
            {financingFacilityData?.currency_partnership_smi_facility !== 'IDR' && (
              <Cell
                title="Syirkah SMI/Nilai Fasilitas Pembiayaan (Dalam Rp)"
                value={'IDR' + ' ' + financingFacilityData?.partnership_smi_facility_idr}
              />
            )}
            <Cell
              titleNode={
                <>
                  <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                    Syirkah Nasabah / Mitra Syarik SMI
                  </TextStyle>
                  <TextStyle variant="body4" weight={600} color={theme.palette.error.main} sx={{ ml: 0.5 }}>
                    *
                  </TextStyle>
                  {showTooltips && (
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
                          // Get existing values from API attributes - use existing_core values for detail view
                          const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue || '0';
                          const existingCurrencyPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_customer')?.attributeValue || 'IDR';

                          // Get exchange rate from data or fallback to API
                          const exchangeRateAttr = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_global')?.attributeValue;
                          const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                          const exchangeRateFromApi = (exchangeRateAttr && exchangeRateAttr !== '0') ?
                            parseFloat(exchangeRateAttr.toString().replace(/,/g, '')) :
                            (usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000);

                          // Current form values
                          const currentPartnershipCustomer = financingFacilityData?.partnership_customer ? parseFloat(financingFacilityData.partnership_customer.toString().replace(/,/g, '')) : 0;
                          const currentCurrencyCustomer = financingFacilityData?.currency_partnership_customer || 'IDR';

                          // Parse existing values
                          const existingValue = existingPartnershipCustomer ? parseFloat(existingPartnershipCustomer.toString().replace(/,/g, '')) : 0;

                          let existingUsdValue = 0;
                          let existingIdrValue = 0;
                          let currentUsdValue = 0;
                          let currentIdrValue = 0;
                          let usdDifference = 0;
                          let idrDifference = 0;

                          const isExisting = financingFacilityData && existingPartnershipCustomer;

                          if (isExisting) {
                            // Calculate existing values based on currency using current exchange rate
                            if (existingCurrencyPartnershipCustomer === 'USD') {
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
                            if (currentCurrencyCustomer === 'USD') {
                              currentUsdValue = currentPartnershipCustomer;
                              currentIdrValue = exchangeRateFromApi > 0
                                ? currentPartnershipCustomer * exchangeRateFromApi
                                : 0;
                            } else {
                              currentIdrValue = currentPartnershipCustomer;
                              currentUsdValue = exchangeRateFromApi > 0
                                ? currentPartnershipCustomer / exchangeRateFromApi
                                : 0;
                            }

                            // Calculate differences using exchange rate
                            if (currentCurrencyCustomer === 'USD') {
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

                              {currentCurrencyCustomer === 'USD' && (
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

                              {currentCurrencyCustomer === 'USD' && (
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
                        <Icon
                          iconName="new-info"
                          sx={{
                            '& path': { fill: '#D07C1B' },
                          }}
                        />
                      </Box>
                    </Tooltip>
                  )}
                </>
              }
              value={
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  {showTooltips && (
                    <Checkbox
                      checked={
                        (() => {
                          const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue;
                          const existingCurrencyCustomer = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_customer')?.attributeValue;
                          const currentPartnershipCustomer = financingFacilityData?.partnership_customer;
                          const currentCurrencyCustomer = financingFacilityData?.currency_partnership_customer;

                          if (existingPartnershipCustomer && currentPartnershipCustomer) {
                            const existingValue = parseFloat(existingPartnershipCustomer.toString().replace(/,/g, ''));
                            const currentValue = parseFloat(currentPartnershipCustomer.toString().replace(/,/g, ''));
                            const isValueSame = existingValue === currentValue;
                            const isCurrencySame = existingCurrencyCustomer === currentCurrencyCustomer;
                            return !isValueSame || !isCurrencySame;
                          }
                          return false;
                        })()
                      }
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
                  <span>{financingFacilityData?.currency_partnership_customer + ' ' + financingFacilityData.partnership_customer}</span>
                </Box>
              }
            />
            {financingFacilityData?.currency_partnership_customer !== 'IDR' && (
              <Cell
                title="Syirkah Nasabah/Mitra Syarik SMI (Dalam Rp)"
                value={'IDR' + ' ' + financingFacilityData?.partnership_customer_idr}
              />
            )}
            <Cell
              titleNode={
                <>
                  <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                    Total Syirkah
                  </TextStyle>
                  {showTooltips && (
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
                          // Get existing values from API attributes - use existing_core values for detail view
                          const existingPartnershipSmiFacility = financingFacilityData?.attributes?.find((attr) =>
                            attr.attributeKey === 'existing_core_partnership_smi_facility')?.attributeValue || '0';
                          const existingPartnershipCustomer = financingFacilityData?.attributes?.find((attr) =>
                            attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue || '0';
                          const existingCurrencyPartnershipSmiFacility =
                           financingFacilityData?.attributes?.find((attr) => {
                             return attr.attributeKey === 'existing_core_currency_partnership_smi_facility' || 'IDR';
                           })?.attributeValue;
                          const existingCurrencyPartnershipCustomer =
                            financingFacilityData?.attributes?.find((attr) => {
                              return attr.attributeKey === 'existing_core_currency_partnership_customer' || 'IDR';
                            })?.attributeValue;

                          // Get exchange rate from data or fallback to API
                          const exchangeRateAttr = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_global')?.attributeValue;
                          const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                          const exchangeRateFromApi = (exchangeRateAttr && exchangeRateAttr !== '0') ?
                            parseFloat(exchangeRateAttr.toString().replace(/,/g, '')) :
                            (usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000);

                          // Current form values - use individual values like other tooltips
                          const currentPartnershipSmiFacility = financingFacilityData?.partnership_smi_facility ?
                            parseFloat(financingFacilityData.partnership_smi_facility.toString().replace(/,/g, '')) : 0;
                          const currentPartnershipCustomer = financingFacilityData?.partnership_customer ?
                            parseFloat(financingFacilityData.partnership_customer.toString().replace(/,/g, '')) : 0;
                          const currentCurrencySmiFacility = financingFacilityData?.currency_partnership_smi_facility || 'IDR';
                          const currentCurrencyCustomer = financingFacilityData?.currency_partnership_customer || 'IDR';

                          let existingUsdValue = 0;
                          let existingIdrValue = 0;
                          let currentUsdValue = 0;
                          let currentIdrValue = 0;
                          let usdDifference = 0;
                          let idrDifference = 0;

                          const isExisting = financingFacilityData &&
                            (existingPartnershipSmiFacility || existingPartnershipCustomer);

                          if (isExisting) {
                            // Parse existing values
                            const existingSmiValue = existingPartnershipSmiFacility ? parseFloat(existingPartnershipSmiFacility.toString().replace(/,/g, '')) : 0;
                            const existingCustomerValue = existingPartnershipCustomer ? parseFloat(existingPartnershipCustomer.toString().replace(/,/g, '')) : 0;

                            // Convert existing to IDR using current exchange rate
                            let existingSmiIdr = 0;
                            let existingCustomerIdr = 0;

                            if (existingCurrencyPartnershipSmiFacility === 'USD') {
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

                            let currentTotalUsd = 0;
                            let currentTotalIdr = 0;

                            // Calculate SMI contribution using current exchange rate
                            if (currentCurrencySmiFacility === 'USD') {
                              currentTotalUsd += currentPartnershipSmiFacility;
                              currentTotalIdr += currentPartnershipSmiFacility * exchangeRateFromApi;
                            } else {
                              currentTotalIdr += currentPartnershipSmiFacility;
                              currentTotalUsd += exchangeRateFromApi > 0 ?
                                currentPartnershipSmiFacility / exchangeRateFromApi : 0;
                            }

                            // Calculate Customer contribution using current exchange rate
                            if (currentCurrencyCustomer === 'USD') {
                              currentTotalUsd += currentPartnershipCustomer;
                              currentTotalIdr += currentPartnershipCustomer * exchangeRateFromApi;
                            } else {
                              currentTotalIdr += currentPartnershipCustomer;
                              currentTotalUsd += exchangeRateFromApi > 0 ?
                                currentPartnershipCustomer / exchangeRateFromApi : 0;
                            }

                            // Set current values for difference calculation
                            currentUsdValue = currentTotalUsd;
                            currentIdrValue = currentTotalIdr;

                            // Calculate differences
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

                              {(currentCurrencySmiFacility === 'USD' || currentCurrencyCustomer === 'USD') && (
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

                              {(currentCurrencySmiFacility === 'USD' || currentCurrencyCustomer === 'USD') && (
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
                        <Icon
                          iconName="new-info"
                          sx={{
                            '& path': { fill: '#D07C1B' },
                          }}
                        />
                      </Box>
                    </Tooltip>
                  )}
                </>
              }
              value={currency_total_partnership + ' ' + total_partnership}
            />
            {currency_total_partnership !== 'IDR' && (
              <Cell
                title="Total Syirkah (Dalam Rp)"
                value={'IDR' + ' ' + total_partnership_idr}
              />
            )}

          </Box>
        </ColumnWrapper>

        {/* Legend for Checkboxes */}
        {showTooltips && (
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
              <Icon
                iconName="new-info"
                sx={{
                  '& path': { fill: '#D07C1B' },
                }}
              />
              <TextStyle variant="body4" color={theme.palette.text.secondary} sx={{ lineHeight: 1.5 }}>
                {(() => {
                  const existingSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_smi_facility')?.attributeValue;
                  const existingCurrSmiFacility = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_smi_facility')?.attributeValue;
                  const currentSmiFacility = financingFacilityData?.partnership_smi_facility;
                  const currentCurrSmiFacility = financingFacilityData?.currency_partnership_smi_facility;

                  const existingCust = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_partnership_customer')?.attributeValue;
                  const existingCurrCust = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_partnership_customer')?.attributeValue;
                  const currentCust = financingFacilityData?.partnership_customer;
                  const currentCurrCust = financingFacilityData?.currency_partnership_customer;

                  let anyChecked = false;
                  if (existingSmiFacility && currentSmiFacility) {
                    const exVal = parseFloat(existingSmiFacility.toString().replace(/,/g, ''));
                    const curVal = parseFloat(currentSmiFacility.toString().replace(/,/g, ''));
                    if (exVal !== curVal || existingCurrSmiFacility !== currentCurrSmiFacility) anyChecked = true;
                  }
                  if (!anyChecked && existingCust && currentCust) {
                    const exVal = parseFloat(existingCust.toString().replace(/,/g, ''));
                    const curVal = parseFloat(currentCust.toString().replace(/,/g, ''));
                    if (exVal !== curVal || existingCurrCust !== currentCurrCust) anyChecked = true;
                  }

                  return anyChecked
                    ? 'Checkbox pada Syirkah SMI dan Syirkah Nasabah aktif apabila terdapat perubahan nominal dari nilai existing'
                    : 'Checkbox pada Syirkah SMI dan Syirkah Nasabah tidak aktif tanpa perubahan nominal dari nilai existing';
                })()}
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
          isOpen
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
            {additionalData.map((item, index) => {
              return (
                <>
                  {
                    item.type !== 'currency' ?
                      <>
                        <Cell key={index} title={item.label} value={item.value} />
                        {(item.key === 'profit_share_review' && item.value === 'OTHER') &&
                          <Cell title="Other Review Nisbah Bagi Hasil" value={financingFacilityData.otherNisbahProfitSharingReview} />}
                      </>
                      :
                      <>
                        {item.key === 'hishshah_value' &&
                          <>
                            <CurrencyCell
                              value={financingFacilityData.hishshah_value}
                              currency={financingFacilityData?.currency_hishshah_value}
                              idrValue={financingFacilityData?.hishshah_value_idr}
                              valueTitle="Nilai Hishshah"
                              totalTitle="Nilai Hishshah (Dalam Rp)"
                            />
                          </>
                        }
                        {item.key === 'ujroh_value' && financingFacilityData?.currency_ujroh_value === 'IDR' &&
                          <CurrencyCell
                            value={financingFacilityData.ujroh_value}
                            currency={financingFacilityData?.currency_ujroh_value}
                            idrValue={financingFacilityData?.ujroh_value_idr}
                            valueTitle="Nilai Ujroh / Sewa"
                            totalTitle="Nilai Ujroh / Sewa (Dalam Rp)"
                          />
                        }
                      </>
                  }
                </>
              );
            }
            )}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              padding: theme.spacing(3),
            }}
          >
            {additionalData.map((item) => {
              if (item.key === 'ujroh_value' && financingFacilityData?.currency_ujroh_value === 'USD') {
                return (
                  <>
                    <CurrencyCell
                      value={financingFacilityData.ujroh_value}
                      currency={financingFacilityData?.currency_ujroh_value}
                      idrValue={financingFacilityData?.ujroh_value_idr}
                      valueTitle="Nilai Ujroh / Sewa"
                      totalTitle="Nilai Ujroh / Sewa (Dalam Rp)"
                    />

                    <Box
                      sx={{
                        marginBottom: '10px',
                      }}
                    >
                      <Cell
                        title="Konversi Mata Uang"
                        value={financingFacilityData?.currencyOrderValueAfterExchangeRate !== null ?
                          financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_ujroh')?.attributeValue : '-'}
                      />
                    </Box>
                  </>
                );
              }
              return null;
            })}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              padding: theme.spacing(3),
            }}
          >
            {additionalFormData.slice(8).map((item, index) => {
              if (financingFacilityData?.currency_ujroh_value === 'USD') {
                return (
                  <>
                    <Cell key={index} title={item.label} value={financingFacilityData[item.value]} />
                  </>
                );
              }
              return null;
            })}
          </Box>
        </SectionTitle >
      </Box >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
          padding: theme.spacing(3),
        }}
      >
        {bottomSectionData.map((item, index) =>
          <Cell key={index} title={item.label} value={item.value} />,
        )}
      </Box>
    </>
  );
};

export default AlMusyarakahMutanaqisahForm;
