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

import useAlQardh from './AlQardh.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlQardh = (props: SyariahFormsProps) => {
  const { financingFacilityData, syariahComponentConfig } = props;
  const theme = useTheme();
  const { existing, facilityId } = props;

  const {
    masintonChange,
    masintonForm,
    governmentMandateList,
    masintonMultiChange,
    currencyDropdownList,
    Dloan_payment_method,
    isAlQardhLoanAmountUnchanged,
  } = useAlQardh(props);

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
    government_guarantee,
    remarks,
    al_qardh_loan_amount,
    currency_al_qardh_loan_amount,
    exchange_rate_al_qardh_loan,
    al_qardh_loan_amount_idr,
    financing_period,
    loan_payment_method,
    administration_fee,
    currency_administration_fee,
    exchange_rate_administration_fee,
    administration_fee_idr,
    installment_value,
    currency_installment_value,
    exchange_rate_installment,
    loan_payment_method_label,
    installment_value_idr,
  } = masintonForm;

  function renderFormNilaiAngsuran() {
    return (
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
          <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
            {getLabel('installment_value', 'Nilai Angsuran')}
          </TextStyle>
        </Box>
        <CurrencyForm
          initialProps={{
            currency: currency_installment_value.value,
            error: installment_value.error,
            errorMessage: installment_value.errorMessage,
            label: '',
            onChange: (val) => {
              masintonChange('installment_value', val.value);
            },
            onCurrencyChange: (val) => {
              if (val.currency === 'IDR') {
                masintonMultiChange({
                  currency_installment_value: val,
                  exchange_rate_installment: '',
                  installment_value_idr: '',
                });
              } else {
                masintonMultiChange({
                  currency_installment_value: val,
                  exchange_rate_installment: currencyDropdownList.find((dt) => dt.value === val)?.rate,
                });
              }
            },
            placeholder: getLabel('installment_value', 'Nilai Angsuran'),
            value: installment_value.value,
          }}
          kursProps={{
            error: exchange_rate_installment.error,
            errorMessage: exchange_rate_installment.errorMessage,
            isMandatory: !showTooltips,
            onChange: (val) => masintonChange('exchange_rate_installment', val.value),
            value: exchange_rate_installment.value,
          }}
          idrProps={{
            error: installment_value_idr.error,
            errorMessage: installment_value_idr.errorMessage,
            value: installment_value_idr.value,
          }}
        />
      </Box>
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
          isMandatory={!showTooltips}
          label={getLabel('debtor_name', 'Nasabah')}
          type="text"
          placeholder={getLabel('debtor_name', 'Nasabah')}
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
        {currency_al_qardh_loan_amount?.value === 'USD' &&
          <Box
            sx={{
              borderBottom: '1px solid #D3D3D3',
              marginBottom: theme.spacing(3),
              paddingBottom: theme.spacing(3),
            }}
          >
            <KonversiMataUangForm
              kursProps={{
                error: exchange_rate_al_qardh_loan?.error,
                errorMessage: exchange_rate_al_qardh_loan?.errorMessage,
                isMandatory: !showTooltips,
                onChange: (val) => masintonChange('exchange_rate_al_qardh_loan', val.value),
                value: exchange_rate_al_qardh_loan?.value,
              }}
            />
          </Box>
        }
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: currency_al_qardh_loan_amount?.value === 'USD' ? '1fr 1fr' : '1fr',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                {getLabel('al_qardh_loan_amount', 'Jumlah/Nilai pinjaman Al-Qardh')}
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
                      const existingAlQardhLoanAmount = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_al_qardh_loan_amount')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'al_qardh_loan_amount')?.attributeValue || '0';
                      const existingCurrencyAlQardhLoanAmount = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_al_qardh_loan_amount')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_al_qardh_loan_amount')?.attributeValue || 'IDR';

                      // Get exchange rate from API get-list-by-module
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000;

                      // Current form values
                      const currentAlQardhLoanAmount = al_qardh_loan_amount.value ? parseFloat(al_qardh_loan_amount.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencyAlQardhLoanAmount = currency_al_qardh_loan_amount?.value || 'IDR';

                      // Parse existing values
                      const existingValue = existingAlQardhLoanAmount ? parseFloat(existingAlQardhLoanAmount.toString().replace(/,/g, '')) : 0;

                      let existingUsdValue = 0;
                      let existingIdrValue = 0;
                      let currentUsdValue = 0;
                      let currentIdrValue = 0;
                      let usdDifference = 0;
                      let idrDifference = 0;

                      const isExisting = financingFacilityData && existingAlQardhLoanAmount;

                      if (isExisting) {
                        // Calculate existing values based on currency
                        if (existingCurrencyAlQardhLoanAmount === 'USD') {
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
                        if (currentCurrencyAlQardhLoanAmount === 'USD') {
                          currentUsdValue = currentAlQardhLoanAmount;
                          // Current IDR = USD * exchange rate from API (not input exchange rate)
                          currentIdrValue = exchangeRateFromApi > 0 ?
                            currentAlQardhLoanAmount * exchangeRateFromApi : 0;
                        } else {
                          currentIdrValue = currentAlQardhLoanAmount;
                          // Current USD = IDR / exchange rate from API (not input exchange rate)
                          currentUsdValue = exchangeRateFromApi > 0 ?
                            currentAlQardhLoanAmount / exchangeRateFromApi : 0;
                        }

                        // Calculate differences using exchange rate from API
                        if (currentCurrencyAlQardhLoanAmount === 'USD') {
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

                          {currency_al_qardh_loan_amount?.value === 'USD' && (
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

                          {currency_al_qardh_loan_amount?.value === 'USD' && (
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
                  checked={!isAlQardhLoanAmountUnchanged}
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
                placeholder={`Input ${getLabel('al_qardh_loan_amount', 'Jumlah/Nilai pinjaman Al-Qardh')}`}
                containerSx={{ flex: 1 }}
                value={{ currency: currency_al_qardh_loan_amount.value, value: al_qardh_loan_amount.value }}
                onCurrencyChange={(val) => {
                  if (val === 'IDR') {
                    masintonMultiChange({
                      al_qardh_loan_amount_idr: '',
                      currency_al_qardh_loan_amount: val,
                      exchange_rate_al_qardh_loan: '',
                    });
                  } else {
                    const exchangeRateFromInput = exchange_rate_al_qardh_loan?.value;
                    const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;
                    const finalRate = exchangeRateFromInput || fallbackRate;

                    masintonMultiChange({
                      currency_al_qardh_loan_amount: val,
                      exchange_rate_al_qardh_loan: finalRate,
                    });
                  }
                }}
                onChange={(val) => {
                  masintonChange('al_qardh_loan_amount', val.value);
                }}
                error={al_qardh_loan_amount.error}
                helperText={al_qardh_loan_amount.error && al_qardh_loan_amount.errorMessage}
              />
            </RowWrapper>
          </Box>

          {currency_al_qardh_loan_amount?.value === 'USD' && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1.175 }}>
                <TextStyle variant="body4" weight={600} color={theme.palette.grey[400]}>
                  {getLabel('al_qardh_loan_amount_idr', 'Jumlah/Nilai pinjaman Al-Qardh (dalam Rp)')}
                </TextStyle>
              </Box>
              <Currency
                currencyList={currencyDropdownList}
                label=""
                placeholder={getLabel('al_qardh_loan_amount_idr', 'Jumlah Pinjaman (dalam Rp)')}
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: al_qardh_loan_amount_idr.value }}
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
                {!isAlQardhLoanAmountUnchanged
                  ? 'Checkbox pada Jumlah/Nilai pinjaman Al-Qardh aktif apabila terdapat perubahan nominal dari nilai existing'
                  : 'Checkbox pada Jumlah/Nilai pinjaman Al-Qardh tidak aktif tanpa perubahan nominal dari nilai existing'}
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
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                  {getLabel('administration_fee', 'Biaya administrasi')}
                </TextStyle>
              </Box>
              <CurrencyForm
                initialProps={{
                  currency: currency_administration_fee.value,
                  error: administration_fee.error,
                  errorMessage: administration_fee.errorMessage,
                  label: '',
                  onChange: (val) => {
                    masintonChange('administration_fee', val.value);
                  },
                  onCurrencyChange: (val) => {
                    if (val.currency === 'IDR') {
                      masintonMultiChange({
                        administration_fee_idr: '',
                        currency_administration_fee: val,
                        exchange_rate_administration_fee: '',
                      });
                    } else {
                      masintonMultiChange({
                        currency_administration_fee: val,
                        exchange_rate_administration_fee:
                          currencyDropdownList.find((dt) => dt.value === val)?.rate,
                      });
                    }
                  },
                  placeholder: getLabel('administration_fee', 'Biaya administrasi'),
                  value: administration_fee.value,
                }}
                kursProps={{
                  error: exchange_rate_administration_fee.error,
                  errorMessage: exchange_rate_administration_fee.errorMessage,
                  isMandatory: !showTooltips,
                  onChange: (val) => masintonChange('exchange_rate_administration_fee', val.value),
                  value: exchange_rate_administration_fee.value,
                }}
                idrProps={{
                  error: administration_fee_idr.error,
                  errorMessage: administration_fee_idr.errorMessage,
                  value: administration_fee_idr.value,
                }}
              />
            </Box>

            {(currency_administration_fee.value === 'IDR' && currency_installment_value.value === 'IDR') && renderFormNilaiAngsuran()}

          </Box>
          {(currency_administration_fee.value === 'USD' || currency_installment_value.value === 'USD') &&
            <Box
              sx={{
                borderTop: '1px solid #D3D3D3',
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                padding: theme.spacing(3),
              }}
            >
              {renderFormNilaiAngsuran()}
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

            <Input
              label={getLabel('loan_payment_method', 'Cara Bayar Pinjaman')}
              type="dropdown"
              dropdownList={Dloan_payment_method}
              placeholder={getLabel('loan_payment_method', 'Cara Bayar Pinjaman')}
              containerSx={{ flex: 1 }}
              value={loan_payment_method.value}
              onChange={(val) => masintonMultiChange({
                loan_payment_method: Dloan_payment_method.find((dt) => dt.value === val)?.value,
                loan_payment_method_label: Dloan_payment_method.find((dt) => dt.value === val)?.label,
              })}
              error={loan_payment_method.error}
              helperText={loan_payment_method.error && loan_payment_method.errorMessage}
            />
          </Box>
        </SectionTitle >
      </Box >
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

export default AlQardh;
