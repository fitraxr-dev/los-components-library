import { Box, Tooltip, useTheme, Checkbox } from '@mui/material';

import Currency from '@/components/shared/Currency';
import CurrencyForm from '@/components/shared/CurrencyForm';
import CurrencyFormWithoutKurs from '@/components/shared/CurrencyForm/CurrencyFormWithoutKurs';
import KonversiMataUangForm from '@/components/shared/CurrencyForm/KonversiMataUangForm';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import useAlMurabahah from './AlMurabahahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlMurabahahForm = (props: SyariahFormsProps) => {
  const { financingFacilityData, syariahComponentConfig } = props;
  const theme = useTheme();
  const { existing, facilityId } = props;

  const {
    governmentMandateList,
    masintonChange,
    masintonForm,
    currencyDropdownList,
    masintonMultiChange,
    isPurchasePriceUnchanged,
  } = useAlMurabahah(props);

  // Helper function to get dynamic label from API config
  const getLabel = (attributeKey: string, defaultLabel: string): string => {
    if (!syariahComponentConfig?.attributes) return defaultLabel;
    const attribute = syariahComponentConfig.attributes.find(
      (attr) => attr.attributeKey === attributeKey
    );
    return attribute?.attributeLabel || defaultLabel;
  };

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING' || financingFacilityData?.orderType === 'New From Existing';

  const {
    debtorName,
    murabahah_object,
    government_guarantee,
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
    discount,
    selling_price,
    selling_price_idr,
    currency_selling_price,
  } = masintonForm;

  function renderFormMarginMurabahah() {
    return (
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
          <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
            {getLabel('murabahah_margin', 'Margin Murabahah')}
          </TextStyle>
        </Box>
        <CurrencyForm
          initialProps={{
            currency: currency_murabahah_margin?.value || 'IDR',
            error: murabahah_margin.error,
            errorMessage: murabahah_margin.error && murabahah_margin.errorMessage,
            label: '',
            onChange: (val) => {
              masintonChange('murabahah_margin', val.value);
            },
            onCurrencyChange: (val) => {
              if (val.currency === 'IDR') {
                masintonMultiChange({
                  currency_murabahah_margin: val,
                  exchange_rate_murabahah_margin: '',
                  murabahah_margin_idr: '',
                });
              } else {
                masintonMultiChange({
                  currency_murabahah_margin: val,
                  exchange_rate_murabahah_margin: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
                });
              }
            },
            placeholder: getLabel('murabahah_margin', 'Margin Murabahah'),
            value: murabahah_margin.value,
          }}
          kursProps={{
            error: exchange_rate_murabahah_margin.error,
            errorMessage: exchange_rate_murabahah_margin.error && exchange_rate_murabahah_margin.errorMessage,
            onChange: (val) => {
              masintonChange('exchange_rate_murabahah_margin', val.value);
            },
            value: exchange_rate_murabahah_margin.value,
          }}
          idrProps={{
            error: murabahah_margin_idr.error,
            errorMessage: murabahah_margin_idr.error && murabahah_margin_idr.errorMessage,
            value: murabahah_margin_idr.value,
          }}
        />
      </Box>
    );
  }

  function renderFormDiskon() {
    return (
      <Input
        label={getLabel('discount', 'Diskon (%)')}
        type="text"
        placeholder={getLabel('discount', 'Diskon (%)')}
        containerSx={{ flex: 1 }}
        value={discount.value}
        onChange={(val) => masintonChange('discount', val)}
        error={discount.error}
        helperText={discount.error && discount.errorMessage}
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
          label={getLabel('debtor_name', 'Nasabah')}
          type="text"
          placeholder={getLabel('debtor_name', 'Nasabah')}
          containerSx={{ flex: 1 }}
          value={debtorName.value}
          disabled
        />

        <Input
          isMandatory={!showTooltips}
          label={getLabel('murabahah_object', 'Objek Murabahah')}
          type="text"
          placeholder={getLabel('murabahah_object', 'Objek Murabahah')}
          containerSx={{ flex: 1 }}
          value={murabahah_object.value}
          onChange={(val) => masintonChange('murabahah_object', val)}
          error={murabahah_object.error}
          helperText={murabahah_object.error && murabahah_object.errorMessage}
        />

      </Box>
      <Box
        border="1px solid #D3D3D3"
        borderRadius="10px"
        padding={theme.spacing(3)}

      >
        {currency_purchase_price?.value === 'USD' &&
          <Box
            sx={{
              borderBottom: '1px solid #D3D3D3',
              marginBottom: theme.spacing(3),
              paddingBottom: theme.spacing(3),
            }}
          >
            <KonversiMataUangForm
              kursProps={{
                error: exchange_rate_purchase_price.error,
                errorMessage: exchange_rate_purchase_price.errorMessage,
                isMandatory: !showTooltips,
                onChange: (val) => masintonChange('exchange_rate_purchase_price', val.value),
                value: exchange_rate_purchase_price.value,
              }}
            />
          </Box>
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
              <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                {getLabel('purchase_price', 'Harga Beli / Plafond Pembiayaan')}
              </TextStyle>
              <TextStyle variant="body4" weight={600} color={theme.palette.error.main}>
                *
              </TextStyle>
              {(existing || facilityId) && showTooltips && (
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
                      // Always try to get existing_purchase_price first, fallback to purchase_price
                      const existingPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_purchase_price')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'purchase_price')?.attributeValue || '0';
                      // Always use existing_currency_purchase_price for tooltip, fallback to currency_purchase_price
                      const existingCurrencyPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_purchase_price')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_purchase_price')?.attributeValue || 'IDR';

                      // Get exchange rate from API get-list-by-module
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000;

                      // Current form values
                      const currentPurchasePrice = purchase_price.value ? parseFloat(purchase_price.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencyPurchasePrice = currency_purchase_price?.value || 'IDR';

                      // Parse existing values
                      const existingValue = existingPurchasePrice ? parseFloat(existingPurchasePrice.toString().replace(/,/g, '')) : 0;

                      let existingUsdValue = 0;
                      let existingIdrValue = 0;
                      let currentUsdValue = 0;
                      let currentIdrValue = 0;
                      let usdDifference = 0;
                      let idrDifference = 0;

                      const isExisting = financingFacilityData && existingPurchasePrice;

                      if (isExisting) {
                        // Calculate existing values based on currency
                        if (existingCurrencyPurchasePrice === 'USD') {
                          // Use existing value directly
                          existingUsdValue = existingValue;
                          // Existing IDR = USD * exchange rate from API
                          existingIdrValue = existingUsdValue * exchangeRateFromApi;
                        } else {
                          // Use existing value directly
                          existingIdrValue = existingValue;
                          // Existing USD = IDR / exchange rate from API
                          existingUsdValue = exchangeRateFromApi > 0 ? existingIdrValue / exchangeRateFromApi : 0;
                        }

                        // Calculate current input values in both currencies using exchange rate from API
                        if (currentCurrencyPurchasePrice === 'USD') {
                          currentUsdValue = currentPurchasePrice;
                          // Current IDR = USD * exchange rate from API (not input exchange rate)
                          currentIdrValue = exchangeRateFromApi > 0 ? currentPurchasePrice * exchangeRateFromApi : 0;
                        } else {
                          currentIdrValue = currentPurchasePrice;
                          // Current USD = IDR / exchange rate from API (not input exchange rate)
                          currentUsdValue = exchangeRateFromApi > 0 ? currentPurchasePrice / exchangeRateFromApi : 0;
                        }

                        // Calculate differences using exchange rate from API
                        if (currentCurrencyPurchasePrice === 'USD') {
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

                          {currency_purchase_price?.value === 'USD' && (
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

                          {currency_purchase_price?.value === 'USD' && (
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
              {(existing || facilityId) && showTooltips && (
                <Checkbox
                  checked={!isPurchasePriceUnchanged}
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
                placeholder={`Input ${getLabel('purchase_price', 'Harga Beli / Plafond Pembiayaan')}`}
                containerSx={{ flex: 1 }}
                value={{ currency: currency_purchase_price.value, value: purchase_price.value }}
                onCurrencyChange={(val) => {
                  if (val === 'IDR') {
                    masintonMultiChange({
                      currency_purchase_price: val,
                      exchange_rate_purchase_price: '',
                      purchase_price_idr: '',
                    });
                  } else {
                    // Use exchange rate from API attribute instead of parameter list
                    const exchangeRateFromApi = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_purchase_price')?.attributeValue;
                    const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;
                    const finalRate = exchangeRateFromApi || fallbackRate;

                    masintonMultiChange({
                      currency_purchase_price: val,
                      exchange_rate_purchase_price: finalRate,
                    });
                  }
                }}
                onChange={(val) => {
                  masintonChange('purchase_price', val.value);
                }}
                error={purchase_price.error}
                helperText={purchase_price.error && purchase_price.errorMessage}
              />
            </RowWrapper>
          </Box>

          {currency_purchase_price?.value === 'USD' && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1.125 }}>
                <TextStyle variant="body4" weight={600} color={theme.palette.grey[400]}>
                  {getLabel('purchase_price_idr', 'Harga Beli/Plafond Pembiayaan (dalam Rp)')}
                </TextStyle>
              </Box>
              <Currency
                currencyList={currencyDropdownList}
                label=""
                placeholder={getLabel('purchase_price_idr', 'Harga Beli (dalam Rp)')}
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: purchase_price_idr.value }}
                disabled
              />
            </Box>
          )}
        </Box>

        {/* Legend for Checkbox */}
        {(existing || facilityId) && showTooltips && (
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
                {!isPurchasePriceUnchanged
                  ? 'Checkbox pada Harga Beli / Plafond Pembiayaan aktif apabila terdapat perubahan nominal dari nilai existing'
                  : 'Checkbox pada Harga Beli / Plafond Pembiayaan tidak aktif tanpa perubahan nominal dari nilai existing'}
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
            display="flex"
            flexDirection="column"
            gap={theme.spacing(3)}
            sx={{
              borderTop: '1px solid #D3D3D3',
              padding: theme.spacing(3),
            }}
          >
            <Box
              sx={{
                borderBottom: '1px solid #D3D3D3',
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                paddingBottom: theme.spacing(3),
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                  <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                    {getLabel('down_payment', 'Uang Muka (Urbun)')}
                  </TextStyle>
                </Box>
                <CurrencyForm
                  initialProps={{
                    currency: currency_down_payment?.value || 'IDR',
                    error: down_payment.error,
                    errorMessage: down_payment.error && down_payment.errorMessage,
                    label: '',
                    onChange: (val) => {
                      masintonChange('down_payment', val.value);
                    },
                    onCurrencyChange: (val) => {
                      if (val.currency === 'IDR') {
                        masintonMultiChange({
                          currency_down_payment: val,
                          down_payment_idr: '',
                          exchange_rate_down_payment: '',
                        });
                      } else {
                        masintonMultiChange({
                          currency_down_payment: val,
                          exchange_rate_down_payment: currencyDropdownList.find((dt) => dt.value === val)?.rate,
                        });
                      }
                    },
                    placeholder: getLabel('down_payment', 'Uang Muka (Urbun)'),
                    value: down_payment.value,
                  }}
                  kursProps={{
                    error: exchange_rate_down_payment.error,
                    errorMessage: exchange_rate_down_payment.error && exchange_rate_down_payment.errorMessage,
                    onChange: (val) => {
                      masintonChange('exchange_rate_down_payment', val.value);
                    },
                    value: exchange_rate_down_payment.value,
                  }}
                  idrProps={{
                    error: down_payment_idr.error,
                    errorMessage: down_payment_idr.error && down_payment_idr.errorMessage,
                    value: down_payment_idr.value,
                  }}
                />
              </Box>

              {(currency_down_payment?.value !== 'USD' && currency_murabahah_margin?.value !== 'USD') && renderFormMarginMurabahah()}
              {(currency_down_payment?.value !== 'USD' && currency_murabahah_margin?.value !== 'USD') && renderFormDiskon()}

              {(selling_price.value !== null) && (
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                    <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                      {getLabel('selling_price', 'Harga Jual')}
                    </TextStyle>
                  </Box>
                  <Currency
                    currencyList={currencyDropdownList}
                    disabled
                    label=""
                    placeholder={getLabel('selling_price', 'Harga Jual')}
                    containerSx={{ flex: 1 }}
                    value={{ currency: currency_selling_price.value, value: selling_price.value }}
                  />
                </Box>
              )}

              {
                (currency_selling_price.value !== 'IDR' && currency_down_payment?.value !== 'USD' && currency_murabahah_margin?.value !== 'USD') && (
                  <Currency
                    currencyList={currencyDropdownList}
                    label={getLabel('selling_price_idr', 'Harga Jual (dalam Rp)')}
                    placeholder={getLabel('selling_price_idr', 'Harga Jual (dalam Rp)')}
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: selling_price_idr.value }}
                    disabled
                  />
                )}

            </Box>
            {(currency_down_payment?.value === 'USD' || currency_murabahah_margin?.value === 'USD') &&
              <>
                <Box
                  sx={{
                    borderBottom: '1px solid #D3D3D3',
                    display: 'grid',
                    gridGap: theme.spacing(3),
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    paddingBottom: theme.spacing(3),
                  }}
                >
                  {renderFormMarginMurabahah()}
                </Box>

                <Box
                  sx={{
                    borderBottom: '1px solid #D3D3D3',
                    display: 'grid',
                    gridGap: theme.spacing(3),
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    paddingBottom: theme.spacing(3),
                  }}
                >
                  {renderFormDiskon()}
                </Box>

                <Box
                  sx={{
                    borderBottom: '1px solid #D3D3D3',
                    display: 'grid',
                    gridGap: theme.spacing(3),
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    paddingBottom: theme.spacing(3),
                  }}
                >
                  <Currency
                    currencyList={currencyDropdownList}
                    disabled
                    label={getLabel('selling_price', 'Harga Jual')}
                    placeholder={getLabel('selling_price', 'Harga Jual')}
                    containerSx={{ flex: 1 }}
                    value={{ currency: currency_selling_price.value, value: selling_price.value }}
                  />
                  <Currency
                    currencyList={currencyDropdownList}
                    label={getLabel('selling_price_idr', 'Harga Jual (dalam Rp)')}
                    placeholder={getLabel('selling_price_idr', 'Harga Jual (dalam Rp)')}
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: selling_price_idr.value }}
                    disabled
                  />
                </Box>
              </>
            }
            <Box
              sx={{
                borderBottom: '1px solid #D3D3D3',
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                paddingBottom: theme.spacing(3),
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                  <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                    {getLabel('murabahah_installment', 'Nilai Angsuran Murabahah')}
                  </TextStyle>
                </Box>
                <CurrencyForm
                  initialProps={{
                    currency: currency_murabahah_installment.value,
                    error: murabahah_installment.error,
                    errorMessage: murabahah_installment.errorMessage,
                    label: '',
                    onChange: (val) => {
                      masintonChange('murabahah_installment', val.value);
                    },
                    onCurrencyChange: (val) => {
                      if (val.currency === 'IDR') {
                        masintonMultiChange({
                          currency_murabahah_installment: val,
                          exchange_rate_murabahah_installment: '',
                          murabahah_installment_idr: '',
                        });
                      } else {
                        masintonMultiChange({
                          currency_murabahah_installment: val,
                          exchange_rate_murabahah_installment: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
                        });
                      }
                    },
                    placeholder: getLabel('murabahah_installment', 'Nilai Angsuran Murabahah'),
                    value: murabahah_installment.value,
                  }}
                  kursProps={{
                    error: exchange_rate_murabahah_installment.error,
                    errorMessage: exchange_rate_murabahah_installment.errorMessage,
                    onChange: (val) => masintonChange('exchange_rate_murabahah_installment', val.value),
                    value: exchange_rate_murabahah_installment.value,
                  }}
                  idrProps={{
                    error: murabahah_installment_idr.error,
                    errorMessage: murabahah_installment_idr.errorMessage,
                    value: murabahah_installment_idr.value,
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                label={getLabel('expected_profit', 'Ekspektasi Imbal Hasil')}
                type="text"
                placeholder={getLabel('expected_profit', 'Ekspektasi Imbal Hasil')}
                containerSx={{ flex: 1 }}
                value={expected_profit.value}
                onChange={(val) => masintonChange('expected_profit', val)}
                error={expected_profit.error}
                helperText={expected_profit.error && expected_profit.errorMessage}
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
              />
            </Box>
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
      </Box>
    </>
  );
};

export default AlMurabahahForm;
