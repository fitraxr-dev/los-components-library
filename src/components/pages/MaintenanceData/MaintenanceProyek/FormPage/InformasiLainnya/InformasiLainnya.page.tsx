'use client';
import { useMemo, useEffect, useRef } from 'react';

import { Box, Tooltip } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';
import { formatNumber } from '@/helpers/utils';
import useApp from '@/hooks/useApp';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionButtonsProyek from '../../components/ActionButtonsProyek/actionButtonsProyek';
import Currency from '../../components/common/Currency/Currency';
import UseActionButtonsProyek from '../../hooks/useActionButtonsProyek';

import UseInformasiLainnya from './InformasiLainnya.hooks';


const InformasiLainnya = () => {
  const [{ currentRole }] = useApp();

  const {
    bucketProcessId,
    control,
    currencyOptions,
    detailProyek,
    handleSave,
    handleSubmit,
    isCreatePage,
    isAutoSaveFetching,
    isDisableField,
    isSaveLoading,
    isValid,
    physicalRealizationOptions,
    router,
    setValueWithoutDirty,
    sourceOfFundProgramOptions,
    sourceOfFundProjectOptions,
    submitDisable,
    theme,
    title,
    watch,
  } = UseInformasiLainnya();

  const safeNumberConversion = (value, defaultValue = 0) => {
    if (value === '' || value === null || value === undefined) {
      return defaultValue;
    }
    const numericValue = parseFloat(value.toString().replace(/,/g, ''));
    return isNaN(numericValue) ? defaultValue : numericValue;
  };

  const getPreviousValue = (fieldData, isDateField = false, isCurrencyField = false) => {
    if (!fieldData?.updated) return '';

    const previousValue = fieldData?.previousValue;

    if (isDateField && previousValue) {
      try {
        const date = new Date(previousValue);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (error) {
        return previousValue;
      }
    }

    if (isCurrencyField && previousValue && typeof previousValue === 'object') {
      const { currency, value } = previousValue;
      if (currency && value !== null && value !== undefined) {
        return value.toString();
      }
      return '';
    }

    return previousValue;
  };

  const watchedProgramSourceOfFund = useWatch({
    control,
    name: 'otherInformation.programSourceOfFund',
  });

  const watchedOthers = useWatch({
    control,
    name: 'otherInformation.others',
  });

  const watchedPhysicalRealization = useWatch({
    control,
    name: 'otherInformation.physicalRealization',
  });

  const isPhysicalRealizationOthersSelected = watchedPhysicalRealization === 'OTHERS';

  const isOthersSelected = watchedProgramSourceOfFund === 'OTHERS';

  const prevProgramSourceOfFundRef = useRef(watchedProgramSourceOfFund);
  const prevPhysicalRealizationRef = useRef(watchedPhysicalRealization);

  // Clear "others" field when not OTHERS is selected
  useEffect(() => {
    if (prevProgramSourceOfFundRef.current !== watchedProgramSourceOfFund) {
      prevProgramSourceOfFundRef.current = watchedProgramSourceOfFund;

      if (!isOthersSelected && watchedOthers) {
        setValueWithoutDirty('otherInformation.others', '');
      }
    }
  }, [watchedProgramSourceOfFund, isOthersSelected, watchedOthers, setValueWithoutDirty]);

  useEffect(() => {
    if (prevPhysicalRealizationRef.current !== watchedPhysicalRealization) {
      prevPhysicalRealizationRef.current = watchedPhysicalRealization;

      if (!isPhysicalRealizationOthersSelected && watch('otherInformation.physicalRealizationOthers')) {
        setValueWithoutDirty('otherInformation.physicalRealizationOthers', '');
      }
    }
  }, [watchedPhysicalRealization, isPhysicalRealizationOthersSelected, setValueWithoutDirty, watch]);

  const dataAsOfOtherInformation = useMemo(() => {
    const dataAsOf = detailProyek?.data?.content?.otherInformation?.dataAsOf;
    return dataAsOf ? formatDateTime(dataAsOf) : '-';
  }, [detailProyek?.data?.content?.otherInformation?.dataAsOf]);

  const { actions, handleSubmitModal, handleClose } = UseActionButtonsProyek(bucketProcessId);

  // auto-update nilai IDR - Using refs to prevent infinite loops
  const prevValuesRef = useRef({
    exchangeRate: null,
    sourceOfFundCurrency: null,
    sourceOfFundValue: null,
  });

  const watchedSourceOfFundValue = useWatch({
    control,
    name: 'otherInformation.valueSourceOfFund.value',
  });

  const watchedSourceOfFundCurrency = useWatch({
    control,
    name: 'otherInformation.valueSourceOfFund.currency',
  });

  const watchedExchangeRate = useWatch({
    control,
    name: 'otherInformation.exchangeRateSourceOfFund.value',
  });

  useEffect(() => {
    // Only proceed if values actually changed to avoid infinite loops
    const hasChanged =
      prevValuesRef.current.sourceOfFundValue !== watchedSourceOfFundValue ||
      prevValuesRef.current.sourceOfFundCurrency !== watchedSourceOfFundCurrency ||
      prevValuesRef.current.exchangeRate !== watchedExchangeRate;

    if (!hasChanged) {
      return;
    }

    // Update ref with current values
    prevValuesRef.current = {
      exchangeRate: watchedExchangeRate,
      sourceOfFundCurrency: watchedSourceOfFundCurrency,
      sourceOfFundValue: watchedSourceOfFundValue,
    };

    const numericSourceOfFundValue = safeNumberConversion(watchedSourceOfFundValue);
    const numericExchangeRate = safeNumberConversion(watchedExchangeRate, 1);

    // Use setTimeout to break the immediate update cycle
    const timeoutId = setTimeout(() => {
      if (watchedSourceOfFundCurrency === 'IDR') {
        // Set exchange rate to 1 for IDR
        if (watchedExchangeRate !== 1) {
          setValueWithoutDirty('otherInformation.exchangeRateSourceOfFund.value', 1);
        }

        // Set valueInIdr directly from sourceOfFund value
        if (numericSourceOfFundValue > 0) {
          setValueWithoutDirty('otherInformation.valueInIdr.value', numericSourceOfFundValue);
        } else {
          setValueWithoutDirty('otherInformation.valueInIdr.value', null);
        }
      } else if (watchedSourceOfFundCurrency === 'USD') {
        // Only clear exchange rate if it was set to 1 (from IDR)
        if (watchedExchangeRate === 1) {
          setValueWithoutDirty('otherInformation.exchangeRateSourceOfFund.value', null);
        }

        // Calculate valueInIdr only if both values are available
        if (numericSourceOfFundValue > 0 && numericExchangeRate > 0 &&
           watchedExchangeRate !== null && watchedExchangeRate !== undefined) {
          const calculatedValue = numericSourceOfFundValue * numericExchangeRate;
          setValueWithoutDirty('otherInformation.valueInIdr.value', calculatedValue);
        } else {
          setValueWithoutDirty('otherInformation.valueInIdr.value', null);
        }
      } else {
        // For other currencies or when no currency selected
        setValueWithoutDirty('otherInformation.valueInIdr.value', null);
        if (watchedExchangeRate !== null) {
          setValueWithoutDirty('otherInformation.exchangeRateSourceOfFund.value', null);
        }
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [watchedSourceOfFundValue, watchedSourceOfFundCurrency, watchedExchangeRate, setValueWithoutDirty]);

  return (
    <ColumnWrapper>
      <RowWrapper sx={{ marginBottom: 5 }}>
        <Title
          title={`${title} Informasi Lainnya`}
        />
      </RowWrapper>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle isOpen title="Informasi Lainnya" >
          <Box display="flex" alignItems="center" py={2} gap={1}>
            <TextStyle variant="body4" weight={600}>
              {`Data as of : ${dataAsOfOtherInformation}`}
            </TextStyle>
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="otherInformation.programSourceOfFund"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Program dari Source of Fund"
                  placeholder="Choose Program dari Source of Fund"
                  type="dropdown"
                  isMandatory
                  disabled={isDisableField}
                  dropdownList={sourceOfFundProgramOptions}
                  hasDataMaster={getPreviousValue(detailProyek?.data?.content?.otherInformation?.programSourceOfFund)}
                />
              }
            />

            {!isOthersSelected && (
              <Controller
                name="otherInformation.projectSourceOfFund"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Source of Fund Project"
                    placeholder="Choose Source of Fund Project"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={sourceOfFundProjectOptions}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.otherInformation?.projectSourceOfFund)}
                  />
                }
              />
            )}

            {isOthersSelected && (
              <Controller
                name="otherInformation.others"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Program dari Source of Fund (Others)"
                    placeholder="Input Others"
                    type="text"
                    disabled={isDisableField}
                    isMandatory
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.otherInformation?.others)}
                  />
                }
              />
            )}

            {isOthersSelected && (
              <Controller
                name="otherInformation.projectSourceOfFund"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Source of Fund Project"
                    placeholder="Choose Source of Fund Project"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={sourceOfFundProjectOptions}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.otherInformation?.projectSourceOfFund)}
                  />
                }
              />
            )}

            <Box sx={{ gridColumn: 'span 2' }}>
              <Controller
                name="otherInformation.remarkSourceOfFund"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Remark Source of Fund"
                    placeholder="Input Remark Source of Fund"
                    type="area"
                    disabled={isDisableField}
                    isMandatory
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.otherInformation?.remarkSourceOfFund)}
                  />
                }
              />
            </Box>

            <Controller
              control={control}
              name="otherInformation.valueSourceOfFund"
              render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                const _error = error as unknown as { value: { message: string } };
                const exchangeRate = watch('otherInformation.exchangeRateSourceOfFund.value') || 1;

                return (
                  <Currency
                    {...field}
                    label="Nilai (Isian Nilai dari Source of Fund)"
                    placeholder="Input Nilai (Isian Nilai dari Source of Fund)"
                    containerSx={{ flex: 1 }}
                    currencyList={currencyOptions}
                    value={{
                      currency: watch('otherInformation.valueSourceOfFund.currency'),
                      value: watch('otherInformation.valueSourceOfFund.value'),
                    }}
                    onChange={(val) => {
                      // Handle empty or invalid values
                      const cleanValue = val.value === '' || val.value === null || val.value === undefined ? null : val.value;
                      const numericValue = cleanValue !== null ? safeNumberConversion(cleanValue, 0) : null;

                      onChange({
                        currency: val.currency,
                        value: numericValue !== null && numericValue > 0 ? formatNumber(cleanValue) : numericValue,
                      });

                      if (val.currency === 'IDR' && numericValue !== null) {
                        setValueWithoutDirty('otherInformation.valueInIdr.value', numericValue);
                      } else if (val.currency === 'USD' && numericValue !== null) {
                        const exchangeRateNum = safeNumberConversion(exchangeRate, 1);
                        const calculatedValue = numericValue * exchangeRateNum;
                        setValueWithoutDirty('otherInformation.valueInIdr.value', calculatedValue);
                      } else {
                        // Reset valueInIdr if value is null/empty
                        setValueWithoutDirty('otherInformation.valueInIdr.value', null);
                      }
                    }}
                    disabled={isDisableField}
                    error={!!error}
                    isMandatory={true}
                    helperText={invalid ? _error?.value?.message : ''}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.otherInformation?.valueSourceOfFund, false, true)}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="otherInformation.exchangeRateSourceOfFund"
              render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                const _error = error as unknown as { value: { message: string } };
                const sourceOfFundValue = watch('otherInformation.valueSourceOfFund.value');
                const sourceOfFundCurrency = watch('otherInformation.valueSourceOfFund.currency');
                const isExchangeRateDisabled = isDisableField || sourceOfFundCurrency === 'IDR';
                const exchangeRateValue = watch('otherInformation.exchangeRateSourceOfFund.value');

                // Determine the display value
                const getDisplayValue = () => {
                  if (sourceOfFundCurrency === 'IDR') {
                    return '1';
                  }
                  return exchangeRateValue || '';
                };

                return (
                  <Currency
                    {...field}
                    label="Exchange Rate"
                    placeholder="Input Exchange Rate"
                    containerSx={{ flex: 1 }}
                    currencyList={currencyOptions}
                    value={{
                      currency: 'IDR',
                      value: getDisplayValue(),
                    }}
                    onChange={(val) => {
                      const cleanValue = val.value === '' || val.value === null || val.value === undefined ? null : val.value;

                      // Only process change if currency is USD or if setting to 1 for IDR
                      if (sourceOfFundCurrency === 'USD') {
                        onChange({
                          currency: 'IDR',
                          value: cleanValue !== null ? formatNumber(cleanValue) : null,
                        });

                        // Recalculate valueInIdr when exchange rate changes for USD
                        if (sourceOfFundValue && cleanValue !== null) {
                          const numericSourceOfFundValue = safeNumberConversion(sourceOfFundValue);
                          const numericExchangeRate = safeNumberConversion(cleanValue);
                          const calculatedValue = numericSourceOfFundValue * numericExchangeRate;
                          setValueWithoutDirty('otherInformation.valueInIdr.value', calculatedValue);
                        } else if (cleanValue === null) {
                          // Reset valueInIdr if exchange rate is empty
                          setValueWithoutDirty('otherInformation.valueInIdr.value', null);
                        }
                      } else if (sourceOfFundCurrency === 'IDR') {
                        // For IDR, always set to 1
                        onChange({
                          currency: 'IDR',
                          value: 1,
                        });
                      }
                    }}
                    disabled={isExchangeRateDisabled}
                    disabledCurrency={true} //disable currency dropdown
                    error={!!error}
                    isMandatory={true}
                    helperText={invalid ? _error?.value?.message : ''}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.otherInformation?.exchangeRateSourceOfFund, false, true)}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="otherInformation.valueInIdr"
              render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                const _error = error as unknown as { value: { message: string } };
                const watchedValue = watch('otherInformation.valueInIdr.value');
                const sourceOfFundValue = watch('otherInformation.valueSourceOfFund.value');

                const getDisplayValue = () => {
                  if (sourceOfFundValue === null || sourceOfFundValue === undefined || sourceOfFundValue === 0) {
                    return '';
                  }
                  return watchedValue || '';
                };

                return (
                  <Currency
                    {...field}
                    label="Nilai in IDR (Isian Nilai dari Source of Fund)"
                    placeholder="Nilai in IDR (Isian Nilai dari Source of Fund"
                    containerSx={{ flex: 1 }}
                    currencyList={currencyOptions}
                    value={{
                      currency: 'IDR',
                      value: getDisplayValue(),
                    }}
                    onChange={(val) => {
                      const numericValue = safeNumberConversion(val.value);
                      onChange({
                        currency: val.currency,
                        value: numericValue > 0 ? formatNumber(val.value) : '',
                      });
                    }}
                    disabled
                    disabledCurrency
                    isMandatory={true}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.otherInformation?.valueInIdr, false, true)}
                  />
                );
              }}
            />

            <Controller
              name="otherInformation.physicalRealization"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Realisasi Fisik"
                  placeholder="Choose Realisasi Fisik"
                  type="dropdown"
                  isMandatory
                  disabled={isDisableField}
                  dropdownList={physicalRealizationOptions}
                  hasDataMaster={getPreviousValue(detailProyek?.data?.content?.otherInformation?.physicalRealization)}
                />
              }
            />

            {isPhysicalRealizationOthersSelected && (
              <Controller
                name="otherInformation.physicalRealizationOthers"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Realisasi Fisik (Others)"
                    placeholder="Realisasi Fisik Others"
                    type="text"
                    disabled={isDisableField}
                    isMandatory
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.otherInformation?.physicalRealizationOthers)}
                  />
                }
              />
            )}

          </Box>
        </SectionTitle>
      </ColumnWrapper>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          py: 2,
        }}
      >
        <Controller
          name="otherInformation.modifiedBy"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              value={field.value || ''}
              label="Modified By"
              placeholder="Modified By"
              type="text"
              disabled
            />
          }
        />

        <Controller
          name="otherInformation.modifiedDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              value={field.value || ''}
              label="Last Modified"
              placeholder="Last Modified"
              type="text"
              disabled
            />
          }
        />
      </Box>
      { isCreatePage ? (
        <RowWrapper marginTop={5} justifyContent="end" gap={theme.spacing(2)}>
          <Button
            variant="outlined"
            onClick={() => { router.back(); }}
          >
            Close
          </Button>
          <Button
            isLoading={isSaveLoading}
            onClick={handleSubmit(handleSave)}
            disabled={!isValid}
          >
            Save
          </Button>
        </RowWrapper>
      ) : (
        <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
          <ActionButtonsProyek
            actions={actions?.action || {}}
            handleSave={handleSave}
            isAutoSaveFetching={isAutoSaveFetching}
            handleOpenSubmitModal={handleSubmitModal}
            isSubmitDisable={!submitDisable}
            isSubmitLoading={false}
            viewOnly={false}
            onClose={handleClose}
            currentRole={currentRole}
          />
        </RowWrapper>
      )}
    </ColumnWrapper>
  );
};

export default InformasiLainnya;
