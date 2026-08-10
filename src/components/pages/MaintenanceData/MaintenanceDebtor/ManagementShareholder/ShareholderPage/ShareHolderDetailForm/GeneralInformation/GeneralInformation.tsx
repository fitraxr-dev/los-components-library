import React, { useState } from 'react';

import { Box, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';

import { dayJsJakartaKeep } from '@/helpers/date';
import { formatNumber } from '@/helpers/utils';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import { shareholderTooltip } from '../../../ManagementShareholder.constants';

import useGeneralInformation from './GeneralInformation.hook';


const GeneralInformation = () => {
  const {
    control,
    theme,
    watch,
    setValue,
    handleSave,
    currencyDropdownList,
    IdDropdownList,
    institutionTypeList,
    handleSubmit,
    isDetailPage,
    isSaveLoading,
    findDataMaster,
    showPrefixSuffix,
    handleNotComplete,
    router,
    handleBackToListPage,
    isValid,
  } = useGeneralInformation();

  const [fileErrorNpwp, setFileErrorNpwp] = useState<string>('');
  const [fileErrorId, setFileErrorId] = useState<string>('');
  const [fileErrorApplicationLetter, setFileErrorApplicationLetter] = useState<string>('');
  const [fileErrorEstablishmentAct, setFileErrorEstablishmentAct] = useState<string>('');
  const [fileErrorLastChangeAct, setFileErrorLastChangeAct] = useState<string>('');
  const [fileErrorLastManager, setFileErrorLastManager] = useState<string>('');
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

  return (
    <ColumnWrapper>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle isOpen title="Detail Shareholder" >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="idRefShareholder"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="ID Ref. Shareholder"
                  placeholder="ID Ref. Shareholder"
                  type="text"
                  disabled
                />
              }
            />


            <Controller
              name="institutionType"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    label="Tipe Shareholder"
                    placeholder="Tipe Shareholder"
                    type="dropdown"
                    isMandatory
                    disabled={isDetailPage}
                    dropdownList={institutionTypeList}
                    hasDataMaster={findDataMaster('institutionType', institutionTypeList)}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );}}
            />

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={!isDetailPage ? theme.palette.custom.text : '#ABABAB'}
                >
                  Nama Shareholder
                </TextStyle>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.error.main}
                >
                  *
                </TextStyle>
                <Tooltip
                  arrow
                  placement="right"
                  slotProps={{
                    arrow: {
                      sx: {
                        color: '#fff',
                      },
                    },
                    tooltip: {
                      sx: {
                        backgroundColor: '#fff',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                  title={
                    <ul>
                      {shareholderTooltip.map((dt) => (
                        <li key={dt}>
                          <TextStyle variant="body5" >
                            {dt}
                          </TextStyle>
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              </RowWrapper>
              {showPrefixSuffix?.includes(watch('institutionType')) ?
                <RowWrapper gap={1}>
                  <Controller
                    name="prefix"
                    control={control}
                    render={({ field }) =>
                      <Input
                        containerSx={{
                          width: '20%',
                        }}
                        {...field}
                        placeholder="Input Gelar"
                        type="text"
                        hasDataMaster={findDataMaster('name')}
                        disabled={isDetailPage}
                      />
                    }
                  />
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) => {
                      return (
                        <Input
                          {...field}
                          containerSx={{
                            width: '60%',
                          }}
                          placeholder="Nama Shareholder"
                          type="text"
                          hasDataMaster={findDataMaster('name')}
                          disabled={isDetailPage}
                          error={!!error}
                          helperText={invalid ? error?.message : ''}
                        />
                      );}}
                  />
                  <Controller
                    name="suffix"
                    control={control}
                    render={({ field }) =>
                      <Input
                        {...field}
                        containerSx={{
                          width: '20%',
                        }}
                        placeholder="Input Gelar"
                        type="text"
                        hasDataMaster={findDataMaster('name')}
                        disabled={isDetailPage}
                      />
                    }
                  />

                </RowWrapper>
                :
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) => {
                    return (
                      <Input
                        {...field}
                        placeholder="Nama Shareholder"
                        type="text"
                        hasDataMaster={findDataMaster('name')}
                        disabled={isDetailPage}
                        error={!!error}
                        helperText={invalid ? error?.message : ''}
                      />
                    );}}
                />
              }
            </Box>

            <Controller
              name="dataInformationSource"
              control={control}
              render={({ field, fieldState: { error, invalid }, fieldState }) => {
                return (
                  <Input
                    {...field}
                    label="Sumber Informasi Data"
                    placeholder="Sumber Informasi Data"
                    type="text"
                    disabled={isDetailPage}
                    hasDataMaster={findDataMaster('informationSource')}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );}}
            />
            <Controller
              name="level"
              control={control}
              render={({ field }) => {
                const value = field.value || '1';
                return (
                  <Input
                    {...field}
                    label="Level/Tingkat"
                    placeholder="Level/Tingkat"
                    type="text"
                    value={value}
                    disabled
                  />
                );
              }
              }
            />
            <Controller
              name="beneficialOwner"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    disabled={isDetailPage}
                    label="Beneficial Owner"
                    placeholder="Beneficial Owner"
                    type="text"
                    hasDataMaster={findDataMaster('beneficialOwner')}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );
              }
              }
            />
          </Box>
        </SectionTitle>
        <SectionTitle isOpen title="Dokumen Shareholder">
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            {showPrefixSuffix?.includes(watch('institutionType')) && <Controller
              name="idType"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    label="ID Type"
                    placeholder="ID Type"
                    type="dropdown"
                    isMandatory
                    hasDataMaster={findDataMaster('idType')}
                    dropdownList={IdDropdownList}
                    disabled={isDetailPage}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );}}
            /> }
            {showPrefixSuffix?.includes(watch('institutionType')) &&
            <Controller
              name="identityExpiry"
              control={control}
              render={({
                field: { onChange, ...field },
              }) =>
                <Input
                  {...field}
                  label="Identity Expiry"
                  placeholder="Identity Expiry"
                  isMandatory
                  type="date"
                  onChange={(val) => onChange(dayJsJakartaKeep(val))}
                  disabled={isDetailPage}
                  hasDataMaster={findDataMaster('identityExpiry')}
                />
              }
            />
            }
            {showPrefixSuffix?.includes(watch('institutionType')) &&
            <Controller
              name="idNo"
              control={control}
              render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    label="ID No."
                    placeholder="ID No."
                    type="text"
                    onChange={(val) => {
                      const numberOnly = /^[0-9\b]+$/;
                      if (numberOnly.test(val) || val === '') onChange(val);
                    }}
                    hasDataMaster={findDataMaster('idNo')}
                    disabled={isDetailPage}
                    isMandatory
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );}}
            />
            }
            {showPrefixSuffix?.includes(watch('institutionType')) &&
            <Controller
              name="idDocFile"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => {
                return (
                  <Input
                    {...field}
                    inputRef={ref}
                    type="file"
                    label="Upload ID"
                    placeholder="Upload ID"
                    containerSx={{ flex: 1 }}
                    error={isTouched && invalid || !!fileErrorId}
                    helperText={fileErrorId || (isTouched && error ?
                      error.message : `Supported formats: ${acceptedFormatsText}`)}
                    downloadOnly={isDetailPage}
                    isMandatory
                    onChange={(val) => {
                      setFileErrorId('');
                      const result = validateFile(val);
                      if (!result.isValid) {
                        setFileErrorId(result.errorMessage);
                        setValue('idDocFile', null);
                        return;
                      }
                      field.onChange(val);
                    }}
                  />
                );}}
            />
            }
            <Controller
              name="npwp"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    label="NPWP"
                    placeholder="NPWP"
                    type="npwp"
                    maxLength={16}
                    hasDataMaster={findDataMaster('npwp')}
                    isMandatory
                    disabled={isDetailPage}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );}}
            />
            <Controller
              control={control}
              name="npwpFile"
              render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload NPWP"
                  placeholder="Upload NPWP"
                  containerSx={{ flex: 1 }}
                  error={isTouched && invalid || !!fileErrorNpwp}
                  helperText={fileErrorNpwp || (isTouched && error ?
                    error.message : `Supported formats: ${acceptedFormatsText}`)}
                  downloadOnly={isDetailPage}
                  isMandatory
                  onChange={(val) => {
                    setFileErrorNpwp('');
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setFileErrorNpwp (result.errorMessage);
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              )}
            />

            {!showPrefixSuffix?.includes(watch('institutionType')) &&
              <Controller
                name="establishmentAct"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      label="Akta Pendirian"
                      placeholder="Akta Pendirian"
                      type="text"
                      hasDataMaster={findDataMaster('establishmentAct')}
                      isMandatory
                      disabled={isDetailPage}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );}}
              />
            }

            {!showPrefixSuffix?.includes(watch('institutionType')) &&
            <Controller
              control={control}
              name="establishmentActFile"
              render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload Akta Pendirian"
                  placeholder="Upload Akta Pendirian"
                  containerSx={{ flex: 1 }}
                  error={isTouched && invalid || !!fileErrorEstablishmentAct}
                  helperText={fileErrorEstablishmentAct || (isTouched && error ?
                    error.message : `Supported formats: ${acceptedFormatsText}`)}
                  downloadOnly={isDetailPage}
                  isMandatory
                  onChange={(val) => {
                    setFileErrorEstablishmentAct('');
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setFileErrorEstablishmentAct(result.errorMessage);
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              )}
            />
            }

            {!showPrefixSuffix?.includes(watch('institutionType')) &&
            <Controller
              name="lastChangeAct"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    label="Akta Perubahan"
                    placeholder="Akta Perubahan"
                    type="text"
                    hasDataMaster={findDataMaster('lastChangeAct')}
                    disabled={isDetailPage}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );}}
            />
            }

            {!showPrefixSuffix?.includes(watch('institutionType')) &&
            <Controller
              control={control}
              name="lastChangeActFile"
              render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload Akta Perubahan"
                  placeholder="Upload Akta Perubahan"
                  containerSx={{ flex: 1 }}
                  error={isTouched && invalid || !!fileErrorLastChangeAct}
                  helperText={fileErrorLastChangeAct || (isTouched && error ?
                    error.message : `Supported formats: ${acceptedFormatsText}`)}
                  downloadOnly={isDetailPage}
                  onChange={(val) => {
                    setFileErrorLastChangeAct('');
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setFileErrorLastChangeAct(result.errorMessage);
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              )}
            />}

          </Box>
        </SectionTitle>
        <SectionTitle isOpen title="Kepemilikan Saham" >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="stockSheet"
              control={control}
              render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    label="Lembar Saham"
                    placeholder="Lembar Saham"
                    type="text"
                    onChange={(val) => {
                      const numberOnly = /^[0-9\b]+$/;
                      if (numberOnly.test(val) || val === '') onChange(val);
                    }}
                    disabled={isDetailPage}
                    isMandatory
                    hasDataMaster={findDataMaster('stockSheet')}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );}}
            />
            <Controller
              control={control}
              name="valuePersheet"
              render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                return (
                  <Currency
                    {...field}
                    label="Nilai per Lembar"
                    placeholder="Nilai per Lembar"
                    containerSx={{ flex: 1 }}
                    currencyList={currencyDropdownList}
                    value={{
                      currency: watch('valuePersheet.currency'),
                      value: watch('valuePersheet.value'),
                    }}
                    onChange={(val) => {
                      onChange({
                        currency: val.currency,
                        value: formatNumber(val.value),
                      });
                      if (val.currency !== 'USD') {
                        setValue('plafondIdr', null);
                        setValue('exchangeRate', null);
                      }
                    }}
                    disabled={isDetailPage}
                    error={!!error}
                    isMandatory={true}
                    hasDataMaster={findDataMaster('value')}
                    // currHasDataMaster={findDataMaster('currencyValue')}
                    helperText={invalid ? error?.value?.message : ''}
                  />
                );
              }}
            />
            {watch('valuePersheet.currency') === 'USD' &&
            <Controller
              control={control}
              name="exchangeRate"
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Currency
                    {...field}
                    disabledCurrency
                    label="Exchange Rate"
                    placeholder="Input Exchange Rate"
                    currencyList={[{ label: 'IDR', value: 'IDR' }]}
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: Number(watch('exchangeRate.value')) || '0' }}
                    error={!!error}
                    onChange={(val) => {
                      field.onChange(val);
                      if (val.currency === '') {
                        setValue('exchangeRate.value', null);
                      }
                    }}
                    hasDataMaster={findDataMaster('exchangeRate')}
                    disabled={isDetailPage}
                    helperText={invalid && error?.message}
                    isMandatory={watch('valuePersheet.currency') === 'USD'}

                  />
                );
              }}
            />
            }
            <Controller
              name="percentage"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => {
                return (
                  <Input
                    {...field}
                    label="Persentase"
                    placeholder="Masukkan Persentase"
                    type="number"
                    isMandatory
                    disabled={isDetailPage}
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                    isAllowed={(values) => {
                      const { formattedValue, floatValue } = values;
                      return (
                        formattedValue === '' ||
                  (floatValue >= 0 && floatValue <= 100)
                      );
                    }}
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('percentage')}
                  />
                );}}
            />
            <Controller
              control={control}
              name="nominal"
              render={({ field, fieldState: { error } }) => (
                <Currency
                  {...field}
                  disabled
                  label="Nominal"
                  placeholder="Nominal"
                  containerSx={{ flex: 1 }}
                  value={{ currency: watch('nominal.currency'), value: watch('nominal.value') }}
                  error={!!error}
                  helperText={error?.message}
                  hasDataMaster={findDataMaster('nominal')}
                />
              )}
            />
            {
              watch('valuePersheet.currency') === 'USD' &&
              <Controller
                control={control}
                name="plafondIdr"
                render={({ field, fieldState: { error } }) => (
                  <Currency
                    {...field}
                    disabled
                    label="Nominal (dalam Rp)"
                    placeholder="Nominal (dalam Rp)"
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: watch('plafondIdr.value') }}
                    error={!!error}
                    hasDataMaster={findDataMaster('plafondIdr')}
                    helperText={error?.message}
                  />
                )}
              />
            }


            <Controller
              name="modifiedBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="lastModified"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Last Modified"
                  type="text"
                  disabled
                />
              }
            />
          </Box>

        </SectionTitle>


      </ColumnWrapper>
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        {isDetailPage ?
          <Button
            variant="outlined"
            onClick={handleBackToListPage}
          >
            Close
          </Button>
          :
          <Button
            isLoading={isSaveLoading}
            disabled={!isValid}
            onClick={handleSubmit(handleSave, handleNotComplete)}
          >
            Save
          </Button>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default GeneralInformation;
