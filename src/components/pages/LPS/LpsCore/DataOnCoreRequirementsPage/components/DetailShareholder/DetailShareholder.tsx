'use client';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { dayJsJakartaKeep } from '@/helpers/date';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useDetailShareholder from './DetailShareholder.hook';


const DetailShareholder = () => {
  const {
    IdDropdownList,
    control,
    currencyDropdownList,
    handleBackToListPage,
    institutionTypeList,
    theme,
    watch,
    showPrefixSuffix,
  } = useDetailShareholder();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Detail Shareholder" />
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle isOpen title="Detail Shareholder">
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
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="Tipe Shareholder"
                    placeholder="Tipe Shareholder"
                    type="dropdown"
                    disabled
                    dropdownList={institutionTypeList}
                  />
                );
              }}
            />

            <Box>
              <TextStyle
                variant="body4"
                weight={600}
                color="#ABABAB"
              >
                Nama Shareholder
              </TextStyle>
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
                        placeholder="Gelar"
                        type="text"
                        disabled
                      />
                    }
                  />
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          {...field}
                          containerSx={{
                            width: '60%',
                          }}
                          placeholder="Nama Shareholder"
                          type="text"
                          disabled
                        />
                      );
                    }}
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
                        disabled
                      />
                    }
                  />
                </RowWrapper>
                :
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        placeholder="Nama Shareholder"
                        type="text"
                        disabled
                      />
                    );
                  }}
                />
              }
            </Box>

            <Controller
              name="dataInformationSource"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="Sumber Informasi Data"
                    placeholder="Sumber Informasi Data"
                    type="text"
                    disabled
                  />
                );
              }}
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
              render={({ field }) =>
                <Input
                  {...field}
                  disabled
                  label="Beneficial Owner"
                  placeholder="Beneficial Owner"
                  type="text"
                />
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
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="ID Type"
                    placeholder="ID Type"
                    type="dropdown"
                    dropdownList={IdDropdownList}
                    disabled
                  />
                );
              }}
            />}

            {showPrefixSuffix?.includes(watch('institutionType')) && <Controller
              name="identityExpiry"
              control={control}
              render={({
                field: { onChange, ...field },
              }) =>
                <Input
                  {...field}
                  label="Identity Expiry"
                  placeholder="Identity Expiry"
                  type="date"
                  onChange={(val) => onChange(dayJsJakartaKeep(val))}
                  disabled
                />
              }
            />}

            {showPrefixSuffix?.includes(watch('institutionType')) && <Controller
              name="idNo"
              control={control}
              render={({ field: { onChange, ...field } }) => {
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
                    disabled
                  />
                );
              }}
            />}

            {showPrefixSuffix?.includes(watch('institutionType')) && <Controller
              name="idDocFile"
              control={control}
              render={({ field: { ref, ...field } }) => {
                return (
                  <Input
                    {...field}
                    inputRef={ref}
                    type="file"
                    label="Upload ID"
                    placeholder="Upload ID"
                    containerSx={{ flex: 1 }}
                    downloadOnly
                  />
                );
              }}
            />}

            <Controller
              name="npwp"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="NPWP"
                    placeholder="NPWP"
                    type="npwp"
                    maxLength={16}
                    disabled
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="npwpFile"
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload NPWP"
                  placeholder="Upload NPWP"
                  containerSx={{ flex: 1 }}
                  downloadOnly
                  disabled
                />
              )}
            />

            <Controller
              name="establishmentAct"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="Akta Pendirian"
                    placeholder="Akta Pendirian"
                    type="text"
                    disabled
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="establishmentActFile"
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload Akta Pendirian"
                  placeholder="Upload Akta Pendirian"
                  containerSx={{ flex: 1 }}
                  downloadOnly
                />
              )}
            />

            <Controller
              name="lastChangeAct"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="Akta Perubahan"
                    placeholder="Akta Perubahan"
                    type="text"
                    disabled
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="lastChangeActFile"
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload Akta Perubahan"
                  placeholder="Upload Akta Perubahan"
                  containerSx={{ flex: 1 }}
                  downloadOnly
                />
              )}
            />
          </Box>
        </SectionTitle>

        <SectionTitle isOpen title="Kepemilikan Saham">
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
              render={({ field: { onChange, ...field } }) => {
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
                    disabled
                    maxLength={13}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="valuePersheet"
              render={({ field: { onChange, ...field } }) => {
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
                    disabled
                  />
                );
              }}
            />

            {watch('valuePersheet.currency') === 'USD' &&
              <Controller
                control={control}
                name="exchangeRate"
                render={({ field }) => {
                  return (
                    <Currency
                      {...field}
                      disabledCurrency
                      label="Exchange Rate"
                      placeholder="Input Exchange Rate"
                      currencyList={[{ label: 'IDR', value: 'IDR' }]}
                      containerSx={{ flex: 1 }}
                      value={{ currency: 'IDR', value: Number(watch('exchangeRate.value')) || '0' }}
                      disabled
                    />
                  );
                }}
              />
            }

            <Controller
              name="percentage"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="Persentase"
                    placeholder="Masukkan Persentase"
                    type="number"
                    disabled
                    isAllowed={(values) => {
                      const { formattedValue, floatValue } = values;
                      return (
                        formattedValue === '' ||
                        (floatValue >= 0 && floatValue <= 100)
                      );
                    }}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="nominal"
              render={({ field }) => (
                <Currency
                  {...field}
                  disabled
                  label="Nominal"
                  placeholder="Nominal"
                  containerSx={{ flex: 1 }}
                  value={{
                    currency: watch('nominal.currency'),
                    value: watch('nominal.value'),
                  }}
                />
              )}
            />

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
        <Button
          variant="outlined"
          onClick={handleBackToListPage}
        >
          Close
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};
export default DetailShareholder;
