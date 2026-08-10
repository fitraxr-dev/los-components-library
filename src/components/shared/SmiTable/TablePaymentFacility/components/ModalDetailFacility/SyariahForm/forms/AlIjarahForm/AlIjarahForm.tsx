import { Box, Checkbox, Tooltip, useTheme } from '@mui/material';

import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import CurrencyCell from '../components/CurrencyCell/CurrencyCell';

import useAlIjarah from './AlIjarahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlIjarahForm = (props: SyariahFormsProps) => {
  const theme = useTheme();

  const {
    facilityData,
    financingFacilityData,
    additionalData,
    bottomSectionData,
    currencyDropdownList,
  } = useAlIjarah(props);

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
          {financingFacilityData?.currency_facility_value === 'USD' && (
            <Cell
              title="Konversi Mata Uang"
              value={financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_facility_value')?.attributeValue || '1'}
            />
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
                    Nilai Fasilitas Pembiayaan
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
                          // Get existing values from API attributes - use existing_core values with fallback
                          const existingFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_facility_value')?.attributeValue ||
                            financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'facility_value')?.attributeValue || '0';
                          const existingCurrencyFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_facility_value')?.attributeValue ||
                            financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_facility_value')?.attributeValue || 'IDR';

                          // Get exchange rate from data or fallback to API
                          const exchangeRateAttr = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_facility_value')?.attributeValue;
                          const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                          const exchangeRateFromApi = (exchangeRateAttr && exchangeRateAttr !== '0') ?
                            parseFloat(exchangeRateAttr.toString().replace(/,/g, '')) :
                            (usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000);

                          // Current form values
                          const currentFacilityValue = financingFacilityData?.facility_value ? parseFloat(financingFacilityData.facility_value.toString().replace(/,/g, '')) : 0;
                          const currentCurrencyFacilityValue = financingFacilityData?.currency_facility_value || 'IDR';

                          // Parse existing values
                          const existingValue = existingFacilityValue ? parseFloat(existingFacilityValue.toString().replace(/,/g, '')) : 0;

                          let existingUsdValue = 0;
                          let existingIdrValue = 0;
                          let currentUsdValue = 0;
                          let currentIdrValue = 0;
                          let usdDifference = 0;
                          let idrDifference = 0;

                          const isExisting = financingFacilityData && existingFacilityValue;

                          if (isExisting) {
                            // Calculate existing values based on currency using current exchange rate
                            if (existingCurrencyFacilityValue === 'USD') {
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
                            if (currentCurrencyFacilityValue === 'USD') {
                              currentUsdValue = currentFacilityValue;
                              currentIdrValue = exchangeRateFromApi > 0 ?
                                currentFacilityValue * exchangeRateFromApi : 0;
                            } else {
                              currentIdrValue = currentFacilityValue;
                              currentUsdValue = exchangeRateFromApi > 0 ?
                                currentFacilityValue / exchangeRateFromApi : 0;
                            }

                            // Calculate differences using exchange rate
                            if (currentCurrencyFacilityValue === 'USD') {
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

                              {currentCurrencyFacilityValue === 'USD' && (
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

                              {currentCurrencyFacilityValue === 'USD' && (
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
                          const existingFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_facility_value')?.attributeValue ||
                            financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'facility_value')?.attributeValue;
                          const existingCurrencyFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_facility_value')?.attributeValue ||
                            financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_facility_value')?.attributeValue;
                          const currentFacilityValue = financingFacilityData?.facility_value;
                          const currentCurrencyFacilityValue = financingFacilityData?.currency_facility_value;

                          if (existingFacilityValue && currentFacilityValue) {
                            const existingValue = parseFloat(existingFacilityValue.toString().replace(/,/g, ''));
                            const currentValue = parseFloat(currentFacilityValue.toString().replace(/,/g, ''));
                            const isValueSame = existingValue === currentValue;
                            const isCurrencySame = existingCurrencyFacilityValue === currentCurrencyFacilityValue;
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
                  <span>{financingFacilityData?.currency_facility_value + ' ' + financingFacilityData.facility_value}</span>
                </Box>
              }
            />
            {financingFacilityData?.currency_facility_value !== 'IDR' && (
              <Cell
                title="Nilai Fasilitas Pembiayaan (Dalam Rp)"
                value={'IDR' + ' ' + financingFacilityData?.facility_value_idr}
              />
            )}
          </Box>

          {/* Legend for Checkboxes */}
          {showTooltips && (
            <Box
              sx={{
                backgroundColor: '#FFF8F0',
                border: `1px solid ${theme.palette.grey[200]}`,
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
                <TextStyle variant="body4" color="#D07C1B" sx={{ lineHeight: 1.5 }}>
                  {(() => {
                    const existingFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_facility_value')?.attributeValue ||
                      financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'facility_value')?.attributeValue;
                    const existingCurrencyFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_facility_value')?.attributeValue ||
                      financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_facility_value')?.attributeValue;
                    const currentFacilityValue = financingFacilityData?.facility_value;
                    const currentCurrencyFacilityValue = financingFacilityData?.currency_facility_value;

                    if (existingFacilityValue && currentFacilityValue) {
                      const existingValue = parseFloat(existingFacilityValue.toString().replace(/,/g, ''));
                      const currentValue = parseFloat(currentFacilityValue.toString().replace(/,/g, ''));
                      const isValueSame = existingValue === currentValue;
                      const isCurrencySame = existingCurrencyFacilityValue === currentCurrencyFacilityValue;
                      const anyChecked = !isValueSame || !isCurrencySame;
                      return anyChecked
                        ? 'Checkbox pada Nilai Fasilitas Pembiayaan aktif apabila terdapat perubahan nominal dari nilai existing'
                        : 'Checkbox pada Nilai Fasilitas Pembiayaan tidak aktif tanpa perubahan nominal dari nilai existing';
                    }
                    return 'Checkbox pada Nilai Fasilitas Pembiayaan tidak aktif tanpa perubahan nominal dari nilai existing';
                  })()}
                </TextStyle>
              </Box>
            </Box>
          )}
        </ColumnWrapper>
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
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(3),
              padding: theme.spacing(3),
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >

              {additionalData?.splice(0, 3).map((item, index) => {
                return (
                  <>
                    {
                      item.type !== 'currency' &&
                      <>
                        <Cell key={index} title={item.label} value={item.value} />
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
              }}
            >
              <CurrencyCell
                value={financingFacilityData.ujroh_value}
                currency={financingFacilityData?.currency_ujroh_value}
                rate={financingFacilityData?.exchange_rate_ujroh}
                idrValue={financingFacilityData?.ujroh_value_idr}
                valueTitle="Nilai Ujroh / Sewa"
                rateTitle="Konversi Mata Uang"
                totalTitle="Nilai Ujroh / Sewa (Dalam Rp)"
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >

              {additionalData?.map((item, index) => {
                return (
                  <>
                    {
                      item.type !== 'currency' &&
                      <>
                        <Cell key={index} title={item.label} value={item.value} />
                      </>
                    }
                  </>
                );
              }
              )}
            </Box>
          </Box>
        </SectionTitle>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(2),
          gridTemplateColumns: 'repeat(2, 1fr)',
          paddingX: theme.spacing(3),
        }}
      >
        {bottomSectionData.map((item, index) => {
          return (
            <Cell key={index} title={item.label} value={item.value} />
          );
        }
        )}
      </Box>
    </>
  );
};

export default AlIjarahForm;
