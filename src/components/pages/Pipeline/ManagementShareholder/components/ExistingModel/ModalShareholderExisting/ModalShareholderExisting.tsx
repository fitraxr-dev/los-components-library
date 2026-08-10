import { useState } from 'react';

import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import InputDebtorName from '@/components/shared/Input/components/InputDebtorName';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalShareholderExisting from './ModalShareholderExisting.hook';

import type { ModalShareholderExistingProps } from './ModalShareholderExisting.type';


const ModalShareholderExisting = create((props: ModalShareholderExistingProps) => {
  const {
    watch,
    getValuesNominal,
    idDocTypeData,
    institutiontypeData,
    isSaveLoading,
    handleSubmit,
    mutateShareholder,
    theme,
    modalId,
    control,
    isAutoSaveFetching,
    isValid,
    setValue,
    jobPositionData,
    currencyDropdownList,
    modal } = useModalShareholderExisting(props);

  const { validateFile, acceptedFormatsText } = useCheckFileDokument();
  const [npwpFileError, setNpwpFileError] = useState<string>('');
  const [idFileError, setIdFileError] = useState<string>('');

  return (
    <SectionModal
      title={props.id ? 'Edit Shareholder' : 'Add Shareholder'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={
        {
          '-ms-overflow-style': 'none',
          minWidth: '52vw',
          'scrollbar-width': 'none',
        }
      }
    >
      <Box
        sx={{
          '& > *': { minWidth: 0 },
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        <Controller
          name="type"
          control={control}
          render={({ field, formState }) =>
            <Input
              {...field}
              dropdownList={institutiontypeData}
              isMandatory
              label="Tipe"
              placeholder="Masukkan Tipe"
              type="dropdown"
              error={!!formState.errors.type}
              helperText={formState.errors.type?.message || null}
            />
          }
        />
        <Controller
          name="name"
          control={control}
          render={({ formState }) =>
            <InputDebtorName
              control={control}
              label="Nama"
              name="name"
              placeholder="Masukkan Nama"
              inputProps={{}}
              bg="transparent"
              isMandatory
              type="text"
              error={!!formState.errors.name}
              helperText={formState.errors.name?.message || null}
              contentTooltip={formState.errors.name ? null : undefined}
              suppressTooltipWhenError
            />
          }
        />

        {watch('type') === 'INDIVIDUAL' &&
          <>
            <Controller
              name="jobPosition"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  dropdownList={jobPositionData}
                  label="Jabatan"
                  placeholder="Masukkan Jabatan"
                  type="dropdown"
                />
              }
            />
            <Controller
              name="identityTypeKey"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  dropdownList={idDocTypeData}
                  label="ID Type"
                  placeholder="Pilih ID Type"
                  type="dropdown"
                />
              }
            />
            <Controller
              name="identityDocNumber"
              control={control}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}
                  label="ID No."
                  placeholder="Masukkan ID No."
                  type="text"
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  error={!!error}
                  helperText={error?.message}
                />
              }
            />

            <Controller
              name="identityDocFile"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Upload ID"
                  placeholder="Upload ID"
                  type="file"
                  containerSx={{ flex: 1 }}
                  onChange={(val) => {
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setIdFileError(result.errorMessage);
                      setValue('identityDocFile', null);
                      return;
                    }
                    setIdFileError('');
                    field.onChange(val);
                  }}
                  error={!!idFileError}
                  helperText={idFileError
                    || `Supported formats: ${acceptedFormatsText}`}
                />
              }
            />
          </>
        }

        <Controller
          name="npwp"
          control={control}
          render={({ field, formState }) =>
            <Input
              {...field}
              label="NPWP"
              placeholder="Masukkan NPWP"
              type="npwp"
              maxLength={16}
              error={!!formState.errors.npwp}
              helperText={formState.errors.npwp?.message || null}
            />
          }
        />

        <Controller
          name="npwpFile"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Upload NPWP"
              placeholder="Upload NPWP"
              type="file"
              onChange={(val) => {
                const result = validateFile(val);
                if (!result.isValid) {
                  setNpwpFileError(result.errorMessage);
                  setValue('npwpFile', null);
                  return;
                }
                setNpwpFileError('');
                field.onChange(val);
              }}
              error={!!npwpFileError}
              helperText={npwpFileError
                || `Supported formats: ${acceptedFormatsText}`}
            />
          }
        />

        <Controller
          name="shares"
          control={control}
          render={({ field, formState }) =>
            <Input
              {...field}
              label="Lembar Saham"
              placeholder="Masukkan Lembar Saham"
              type="number"
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
              error={!!formState.errors.shares}
              helperText={formState.errors.shares?.message || null}
            />
          }
        />

        <Controller
          name="valuePerShare"
          control={control}
          render={({ field }) =>
            <Currency
              {...field}
              label="Nilai per Lembar"
              placeholder="Masukkan Nilai per Lembar"
              containerSx={{ flex: 1 }}
              value={{ currency: field.value.currency, value: field.value.value }}
              onCurrencyChange={(val) => {
                field.onChange({ ...field.value, currency: val });
                // Auto-set exchange rate when currency changes to USD
                const exchangeRate = currencyDropdownList?.find((item) => item.value === val)?.rate;
                if (val === 'USD' && exchangeRate) {
                  setValue('exchangeRate', {
                    currency: 'IDR',
                    value: exchangeRate,
                  });
                } else {
                  setValue('exchangeRate', {
                    currency: 'IDR',
                    value: undefined,
                  });
                }
              }}
              onChange={(val) => {
                field.onChange({ ...field.value, value: val.value });
              }}
            />
          }
        />

        {watch('valuePerShare.currency') === 'USD' &&
          <>
            <Box />
            <Controller
              name="exchangeRate"
              control={control}
              render={({ field, formState }) =>
                <Input
                  {...field}
                  label="Nilai Tukar"
                  placeholder="Masukkan Nilai Tukar"
                  type="currency"
                  disabledCurrency
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}

                  error={!!formState.errors.exchangeRate}
                  helperText={formState.errors.exchangeRate?.message || null}
                />
              }
            />
          </>
        }

        <Controller
          name="percentage"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Persentase"
              placeholder="Masukkan Persentase"
              type="number"
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
            />
          }
        />

        <Input
          disabled
          label="Nominal"
          onChange={() => { }}
          type="currency"
          value={getValuesNominal}
        />
      </Box>
      <RowWrapper
        gap={theme.spacing(3)}
        paddingTop={theme.spacing(3)}
        justifyContent="end"
      >
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          disabled={!isValid || isAutoSaveFetching}
          isLoading={isSaveLoading}
          onClick={handleSubmit(mutateShareholder)}
        >
          {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalShareholderExisting;
