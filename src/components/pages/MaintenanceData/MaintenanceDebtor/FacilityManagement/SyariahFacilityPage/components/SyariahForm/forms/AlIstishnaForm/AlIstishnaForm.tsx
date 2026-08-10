import { useMemo } from 'react';

import { Box, Tooltip, useTheme, Checkbox } from '@mui/material';


import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import CurrencyForm from '../../components/CurrencyForm';

import useAlIstishna from './AlIstishnaForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlIstishna = (props: SyariahFormsProps) => {
  const { financingFacilityData, disabled } = props;
  const theme = useTheme();
  const { existing, facilityId } = props;

  const {
    masintonChange,
    masintonForm,
    masintonMultiChange,
    governmentMandateList,
    Dselling_price_payment_method,
    currencyDropdownList,
    isPurchasePriceUnchanged,
  } = useAlIstishna(props);

  const {
    debtorName,
    selling_price,
    currency_selling_price,
    selling_price_idr,
    discount,
    istishna_object,
    government_guarantee,
    remarks,
    purchase_price,
    currency_purchase_price,
    exchange_rate_purchase_price,
    purchase_price_idr,
    selling_price_payment_method,
    istishna_object_delivery_period,
    expected_profit,
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

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING';

  function renderFormMarginIstishna() {
    return (
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
          <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
            Margin Istishna
          </TextStyle>
        </Box>
        <CurrencyForm
          initialProps={{
            currency: currency_istishna_margin.value,
            disabled: disabled,
            error: istishna_margin.error,
            errorMessage: istishna_margin.errorMessage,
            label: '',
            onChange: (val) => {
              masintonChange('istishna_margin', val.value);
            },
            onCurrencyChange: (val) => {
              if (val.currency === 'IDR') {
                masintonMultiChange({
                  currency_istishna_margin: val,
                  exchange_rate_istishna_margin: '',
                  istishna_margin_idr: '',
                });
              } else {
                masintonMultiChange({
                  currency_istishna_margin: val,
                  exchange_rate_istishna_margin: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
                });
              }
            },
            placeholder: 'Margin Istishna',
            value: istishna_margin.value,
          }}
          kursProps={{
            disabled: disabled,
            error: exchange_rate_istishna_margin.error,
            errorMessage: exchange_rate_istishna_margin.errorMessage,
            isMandatory: true,
            onChange: (val) => masintonChange('exchange_rate_istishna_margin', val.value),
            value: exchange_rate_istishna_margin.value,
          }}
          idrProps={{
            disabled: disabled,
            error: istishna_margin_idr.error,
            errorMessage: istishna_margin_idr.errorMessage,
            value: istishna_margin_idr.value,
          }}
        />
      </Box>
    );
  }

  function renderFormDiskon() {
    return (
      <Input
        label="Diskon (%)"
        type="text"
        placeholder="Diskon (%)"
        containerSx={{ flex: 1 }}
        value={discount.value}
        onChange={(val) => masintonChange('discount', val)}
        error={discount.error}
        helperText={discount.error && discount.errorMessage}
        disabled= {disabled}
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
          label="Nasabah"
          type="text"
          placeholder="Nasabah"
          containerSx={{ flex: 1 }}
          value={debtorName.value}
          disabled
        />

        <Input
          label="Objek Istishna"
          type="text"
          placeholder="Objek Istishna"
          containerSx={{ flex: 1 }}
          value={istishna_object.value}
          onChange={(val) => masintonChange('istishna_object', val)}
          error={istishna_object.error}
          helperText={istishna_object.error && istishna_object.errorMessage}
          disabled= {disabled}
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
        {currency_purchase_price?.value === 'USD' &&
          <Box
            sx={{
              borderBottom: '1px solid #D3D3D3',
              marginBottom: theme.spacing(3),
              paddingBottom: theme.spacing(3),
            }}
          >
            <Currency
              isMandatory={true}
              currencyList={currencyDropdownList}
              label="Konversi Mata Uang"
              disabledCurrency
              placeholder="Konversi Mata Uang"
              containerSx={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: theme.spacing(3) }}
              value={{
                currency: 'IDR',
                value: exchange_rate_purchase_price?.value || financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'exchange_rate_purchase_price')?.attributeValue || 1,
              }}
              onChange={(val) => {
                masintonChange('exchange_rate_purchase_price', val.value);
              }}
              error={exchange_rate_purchase_price?.error}
              helperText={exchange_rate_purchase_price?.error && exchange_rate_purchase_price?.errorMessage}
              disabled={disabled}
            />
          </Box>
        }

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: currency_purchase_price?.value === 'USD' ? '1fr 1fr' : '1fr',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                Harga Beli / Plafond Pembiayaan
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
                      // Always try to get existing_purchase_price first, fallback to purchase_price
                      const existingPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_purchase_price')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'purchase_price')?.attributeValue;
                      // Always use existing_currency_purchase_price for tooltip, fallback to currency_purchase_price
                      const existingCurrencyPurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_purchase_price')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_purchase_price')?.attributeValue;
                      const existingPlafondDifferencePurchasePrice = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'plafond_difference_purchase_price')?.attributeValue;

                      // Get exchange rate from API get-list-by-module
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 1;

                      // Current form values
                      const currentPurchasePrice = purchase_price.value ? parseFloat(purchase_price.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencyPurchasePrice = currency_purchase_price?.value;

                      // Parse existing values
                      const existingValue = existingPurchasePrice ? parseFloat(existingPurchasePrice.toString().replace(/,/g, '')) : 0;
                      const existingPlafondDifference = existingPlafondDifferencePurchasePrice ? parseFloat(existingPlafondDifferencePurchasePrice.toString().replace(/,/g, '')) : 0;

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
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              )}
            </Box>
            <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
              {(existing || facilityId) && financingFacilityData && showTooltips && (
                <Checkbox
                  checked={isPurchasePriceUnchanged}
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
                placeholder="Input Harga Beli / Plafond Pembiayaan"
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
                    const exchangeRateFromInput = exchange_rate_purchase_price?.value;
                    const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;
                    const finalRate = exchangeRateFromInput || fallbackRate;

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
                disabled={disabled}
                disabledCurrency={disabled}
              />
            </RowWrapper>
          </Box>

          {currency_purchase_price?.value === 'USD' && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1.175 }}>
                <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.grey[400]}>
                  Harga Beli / Plafond Pembiayaan (dalam Rp)
                </TextStyle>
              </Box>
              <Currency
                currencyList={currencyDropdownList}
                label=""
                placeholder="Harga Beli (dalam Rp)"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: purchase_price_idr.value }}
                disabled
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
                Checkbox pada Harga Beli / Plafond Pembiayaan akan aktif
                apabila tidak ada perubahan nominal dari nilai existing.
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
                  <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                    Uang Muka (Urbun)
                  </TextStyle>
                </Box>
                <CurrencyForm
                  initialProps={{
                    currency: currency_down_payment.value,
                    disabled: disabled,
                    error: down_payment.error,
                    errorMessage: down_payment.errorMessage,
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
                    placeholder: 'Uang Muka (Urbun)',
                    value: down_payment.value,
                  }}
                  kursProps={{
                    disabled: disabled,
                    error: exchange_rate_down_payment.error,
                    errorMessage: exchange_rate_down_payment.errorMessage,
                    isMandatory: true,
                    onChange: (val) => masintonChange('exchange_rate_down_payment', val.value),
                    value: exchange_rate_down_payment.value,
                  }}
                  idrProps={{
                    disabled: disabled,
                    error: down_payment_idr.error,
                    errorMessage: down_payment_idr.errorMessage,
                    value: down_payment_idr.value,
                  }}
                />
              </Box>

              {(currency_down_payment.value !== 'USD' && currency_istishna_margin.value !== 'USD') && (
                <>
                  {renderFormMarginIstishna()}
                  {renderFormDiskon()}
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                      <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                        Harga Jual
                      </TextStyle>
                    </Box>
                    <Currency
                      currencyList={currencyDropdownList}
                      disabled
                      label=""
                      placeholder="Harga Jual"
                      containerSx={{ flex: 1 }}
                      value={{ currency: currency_selling_price.value, value: selling_price.value }}
                    />
                  </Box>
                </>
              )}

            </Box>
            {(currency_down_payment.value === 'USD' || currency_istishna_margin.value === 'USD') &&
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
                  {renderFormMarginIstishna()}
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
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                      <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                        Harga Jual
                      </TextStyle>
                    </Box>
                    <Currency
                      currencyList={currencyDropdownList}
                      disabled
                      label=""
                      placeholder="Harga Jual"
                      containerSx={{ flex: 1 }}
                      value={{ currency: currency_selling_price.value, value: selling_price.value }}
                    />
                  </Box>
                  <Currency
                    currencyList={currencyDropdownList}
                    label="Harga Jual (dalam Rp)"
                    placeholder="Harga Jual (dalam Rp)"
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: selling_price_idr.value }}
                    disabled
                  />
                </Box>

              </>
            }
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                label="Metode Pembayaran Harga Jual"
                type="dropdown"
                placeholder="Metode Pembayaran Harga Jual"
                containerSx={{ flex: 1 }}
                dropdownList={Dselling_price_payment_method}
                value={selling_price_payment_method.value}
                onChange={(val) => masintonMultiChange({
                  selling_price_payment_method:
                    Dselling_price_payment_method.find((dt) => dt.value === val)?.value,
                  selling_price_payment_method_label:
                    Dselling_price_payment_method.find((dt) => dt.value === val)?.label,
                })}

                error={selling_price_payment_method.error}
                helperText={selling_price_payment_method.error && selling_price_payment_method.errorMessage}
                disabled={disabled}
              />

              <Input
                label="Masa Penyediaan Objek Istishna"
                type="text"
                placeholder="Masa Penyediaan Objek Istishna"
                containerSx={{ flex: 1 }}
                value={istishna_object_delivery_period.value}
                onChange={(val) => masintonChange('istishna_object_delivery_period', val)}
                error={istishna_object_delivery_period.error}
                helperText={istishna_object_delivery_period.error && istishna_object_delivery_period.errorMessage}
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
                type="text"
                placeholder="Jangka Waktu Pembiayaan"
                containerSx={{ flex: 1 }}
                value={financing_period.value}
                onChange={(val) => masintonChange('financing_period', val)}
                error={financing_period.error}
                helperText={financing_period.error && financing_period.errorMessage}
                disabled={disabled}
              />
            </Box>
            <Box
              sx={{
                borderTop: '1px solid #D3D3D3',
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                paddingTop: theme.spacing(3),
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                  <TextStyle variant="body4" weight={600} color={disabled ? theme.palette.custom.gray30 : theme.palette.custom.text}>
                    Nilai Angsuran Istishna
                  </TextStyle>
                </Box>
                <CurrencyForm
                  initialProps={{
                    currency: currency_istishna_installment.value,
                    disabled: disabled,
                    error: istishna_installment.error,
                    errorMessage: istishna_installment.errorMessage,
                    label: '',
                    onChange: (val) => {
                      masintonChange('istishna_installment', val.value);
                    },
                    onCurrencyChange: (val) => {
                      if (val.currency === 'IDR') {
                        masintonMultiChange({
                          currency_istishna_installment: val,
                          exchange_rate_istishna_installment: '',
                          istishna_installment_idr: '',
                        });
                      } else {
                        masintonMultiChange({
                          currency_istishna_installment: val,
                          exchange_rate_istishna_installment: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
                        });
                      }
                    },
                    placeholder: 'Nilai Angsuran Istishna',
                    value: istishna_installment.value,
                  }}
                  kursProps={{
                    disabled: disabled,
                    error: exchange_rate_istishna_installment.error,
                    errorMessage: exchange_rate_istishna_installment.errorMessage,
                    isMandatory: true,
                    onChange: (val) => masintonChange('exchange_rate_istishna_installment', val.value),
                    value: exchange_rate_istishna_installment.value,
                  }}
                  idrProps={{
                    disabled: disabled,
                    error: istishna_installment_idr.error,
                    errorMessage: istishna_installment_idr.errorMessage,
                    value: istishna_installment_idr.value,
                  }}
                />
              </Box>
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

export default AlIstishna;
