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

import useAlIjarah from './AlIjarahForm.hook';

import type { SyariahFormsProps } from '../forms.type';


const AlIjarahForm = (props: SyariahFormsProps) => {
  const { financingFacilityData, syariahComponentConfig, disabled } = props;
  const theme = useTheme();
  const { existing, facilityId } = props;

  const {
    masintonChange,
    masintonForm,
    currencyDropdownList,
    governmentMandateList,
    masintonMultiChange,
    Dujroh_review_type,
    Dujroh_review_period,
    Dujroh_payment_period,
    isFacilityValueUnchanged,
  } = useAlIjarah(props);

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
    other_ujroh_review_period,
    ijarah_object,
    financing_period,
    expected_profit,
    government_guarantee,
    remarks,
    facility_value,
    currency_facility_value,
    exchange_rate_facility_value,
    facility_value_idr,
    ujroh_payment_period,
    ujroh_review_type,
    ujroh_review_period,
    ujroh_value,
    currency_ujroh_value,
    exchange_rate_ujroh,
    ujroh_value_idr,
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
          label={getLabel('customer_name', 'Penyewa / Musta\'jir')}
          type="text"
          placeholder={getLabel('customer_name', 'Penyewa / Musta\'jir')}
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
        {currency_facility_value?.value === 'USD' &&
          <Box
            sx={{
              borderBottom: '1px solid #D3D3D3',
              marginBottom: theme.spacing(3),
              paddingBottom: theme.spacing(3),
            }}
          >
            <KonversiMataUangForm
              kursProps={{
                error: exchange_rate_facility_value?.error,
                errorMessage: exchange_rate_facility_value?.errorMessage,
                isMandatory: !showTooltips,
                onChange: (val) => masintonChange('exchange_rate_facility_value', val.value),
                value: exchange_rate_facility_value?.value,
              }}
              disabled={disabled}
            />
          </Box>
        }
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: currency_facility_value?.value === 'USD' ? '1fr 1fr' : '1fr',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
              <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                {getLabel('facility_value', 'Nilai Fasilitas Pembiayaan')}
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
                      const existingFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_facility_value')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'facility_value')?.attributeValue || '0';
                      const existingCurrencyFacilityValue = financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'existing_core_currency_facility_value')?.attributeValue ||
                        financingFacilityData?.attributes?.find((attr) => attr.attributeKey === 'currency_facility_value')?.attributeValue || 'IDR';

                      // Get exchange rate from input or fallback to API
                      const usdExchangeRate = currencyDropdownList?.find((item) => item.value === 'USD')?.rate;
                      const exchangeRateFromApi = (exchange_rate_facility_value.value && exchange_rate_facility_value.value !== '0') ?
                        parseFloat(exchange_rate_facility_value.value.toString().replace(/,/g, '')) :
                        (usdExchangeRate ? parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 15000);

                      // Current form values
                      const currentFacilityValue = facility_value.value ? parseFloat(facility_value.value.toString().replace(/,/g, '')) : 0;
                      const currentCurrencyFacilityValue = currency_facility_value?.value || 'IDR';

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
                          currentIdrValue = exchangeRateFromApi > 0 ? currentFacilityValue * exchangeRateFromApi : 0;
                        } else {
                          currentIdrValue = currentFacilityValue;
                          currentUsdValue = exchangeRateFromApi > 0 ? currentFacilityValue / exchangeRateFromApi : 0;
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

                          {currency_facility_value?.value === 'USD' && (
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

                          {currency_facility_value?.value === 'USD' && (
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
            </Box>
            <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
              {(existing || facilityId) && financingFacilityData && showTooltips && (
                <Checkbox
                  checked={!isFacilityValueUnchanged}
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
                placeholder={`Input ${getLabel('facility_value', 'Nilai Fasilitas Pembiayaan')}`}
                containerSx={{ flex: 1 }}
                value={{ currency: currency_facility_value.value, value: facility_value.value }}
                onCurrencyChange={(val) => {
                  if (val === 'IDR') {
                    masintonMultiChange({
                      currency_facility_value: val,
                      exchange_rate_facility_value: '1',
                      facility_value_idr: '',
                    });
                  } else {
                    const fallbackRate = currencyDropdownList.find((dt) => dt.value === val)?.rate;

                    masintonMultiChange({
                      currency_facility_value: val,
                      exchange_rate_facility_value: fallbackRate || '1',
                    });
                  }
                }}
                onChange={(val) => {
                  masintonChange('facility_value', val.value);
                }}
                error={facility_value.error}
                helperText={facility_value.error && facility_value.errorMessage}
                disabled={disabled}
              />
            </RowWrapper>
          </Box>

          {currency_facility_value?.value === 'USD' && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1.175 }}>
                <TextStyle variant="body4" weight={600} color={theme.palette.grey[400]}>
                  {getLabel('facility_value_idr', 'Nilai Fasilitas Pembiayaan (dalam Rp)')}
                </TextStyle>
              </Box>
              <Currency
                currencyList={currencyDropdownList}
                label=""
                placeholder={getLabel('facility_value_idr', 'Nilai Fasilitas (dalam Rp)')}
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: facility_value_idr.value }}
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
                {!isFacilityValueUnchanged
                  ? 'Checkbox pada Nilai Fasilitas Pembiayaan aktif apabila terdapat perubahan nominal dari nilai existing'
                  : 'Checkbox pada Nilai Fasilitas Pembiayaan tidak aktif tanpa perubahan nominal dari nilai existing'}
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
              label={getLabel('ijarah_object', 'Objek Ijarah')}
              type="text"
              placeholder={getLabel('ijarah_object', 'Objek Ijarah')}
              containerSx={{ flex: 1 }}
              value={ijarah_object.value}
              onChange={(val) => masintonChange('ijarah_object', val)}
              error={ijarah_object.error}
              helperText={ijarah_object.error && ijarah_object.errorMessage}
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
                  {getLabel('ujroh_value', 'Nilai Ujroh/Sewa')}
                </TextStyle>
              </Box>
              <CurrencyForm
                initialProps={{
                  currency: currency_ujroh_value.value,
                  error: ujroh_value.error,
                  errorMessage: ujroh_value.errorMessage,
                  label: '',
                  onChange: (val) => {
                    masintonChange('ujroh_value', val.value);
                  },
                  onCurrencyChange: (val) => {
                    if (val.currency === 'IDR') {
                      masintonMultiChange({
                        currency_ujroh_value: val,
                        exchange_rate_ujroh: '1',
                        ujroh_value_idr: '',
                      });
                    } else {
                      const fallbackRate = currencyDropdownList.find((dt) => dt.value === val.currency)?.rate;
                      masintonMultiChange({
                        currency_ujroh_value: val,
                        exchange_rate_ujroh: fallbackRate || '1',
                      });
                    }
                  },
                  placeholder: `Input ${getLabel('ujroh_value', 'Nilai Ujroh/Sewa')}`,
                  value: ujroh_value.value,
                }}
                kursProps={{
                  error: exchange_rate_ujroh.error,
                  errorMessage: exchange_rate_ujroh.errorMessage,
                  isMandatory: !showTooltips,
                  onChange: (val) => {
                    masintonChange('exchange_rate_ujroh', val.value);
                  },
                  value: exchange_rate_ujroh.value,
                }}
                idrProps={{
                  error: ujroh_value_idr.error,
                  errorMessage: ujroh_value_idr.errorMessage,
                  value: ujroh_value_idr.value,
                }}
                disabled={disabled}
              />
            </Box>
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
            <Input
              label={getLabel('ujroh_payment_period', 'Periode Pembayaran Ujroh/Sewa')}
              type="dropdown"
              dropdownList={Dujroh_payment_period}
              placeholder={getLabel('ujroh_payment_period', 'Periode Pembayaran Ujroh/Sewa')}
              containerSx={{ flex: 1 }}
              value={ujroh_payment_period.value}
              onChange={(val) => masintonMultiChange({
                ujroh_payment_period: Dujroh_payment_period.find((dt) => dt.value === val)?.value,
                ujroh_payment_period_label: Dujroh_payment_period.find((dt) => dt.value === val)?.label,
              })}
              error={ujroh_payment_period.error}
              helperText={ujroh_payment_period.error && ujroh_payment_period.errorMessage}
              disabled={disabled}
            />

            <Input
              label={getLabel('ujroh_review_type', 'Jenis Review Ujroh/Sewa')}
              type="dropdown"
              dropdownList={Dujroh_review_type}
              placeholder={getLabel('ujroh_review_type', 'Jenis Review Ujroh/Sewa')}
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
              label={getLabel('ujroh_review_period', 'Masa Review Ujroh/Sewa')}
              type="dropdown"
              dropdownList={Dujroh_review_period}
              placeholder={getLabel('ujroh_review_period', 'Masa Review Ujroh/Sewa')}
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

export default AlIjarahForm;
