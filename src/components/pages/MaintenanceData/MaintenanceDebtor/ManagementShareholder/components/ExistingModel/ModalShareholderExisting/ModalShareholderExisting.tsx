import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
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
    institutiontypeData,
    isSaveLoading,
    handleSubmit,
    mutateShareholder,
    theme,
    modalId,
    control,
    isValid,
    jobPositionData,
    modal } = useModalShareholderExisting(props);

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
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
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
              isMandatory
              type="text"
              error={!!formState.errors.name}
              helperText={formState.errors.name?.message || null}
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
            <Box />
            <Controller
              name="nik"
              control={control}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}
                  label="NIK"
                  placeholder="Masukkan NIK"
                  type="number"

                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  error={!!error}
                  helperText={error?.message}
                />
              }
            />

            <Controller
              name="nikFile"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Upload KTP"
                  placeholder="Upload KTP"
                  type="file"
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
              maxLength={16}
              type="npwp"
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
          name="valuePerShares"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Nilai per Lembar"
              placeholder="Masukkan Nilai per Lembar"
              type="currency"
            />
          }
        />

        {watch('valuePerShares.currency') === 'USD' &&
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
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  disabledCurrency
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
          disabled={!isValid}
          isLoading={isSaveLoading}
          onClick={handleSubmit(mutateShareholder)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalShareholderExisting;
