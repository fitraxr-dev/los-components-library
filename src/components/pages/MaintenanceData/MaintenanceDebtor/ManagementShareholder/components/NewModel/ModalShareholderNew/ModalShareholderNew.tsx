import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalShareholderNew from './ModalShareholderNew.hook';


const ModalShareholderNew = create(({ }) => {

  const {
    control,
    modal,
    theme,
    modalId,
    handleSubmit,
    mutateShareholder,
    isSaveLoading,
    formState,
  } = useModalShareholderNew();

  return (
    <SectionModal
      title="Add Shareholder"
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
          name="level"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Level"
              placeholder="Masukkan Level"
              type="text"
            />
          }
        />

        <Controller
          name="shareholderType"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Shareholder Type"
              placeholder="Masukkan Shareholder Type"
              type="text"
            />
          }
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Name"
              placeholder="Masukkan Nama"
              type="text"
            />
          }
        />

        <Controller
          name="npwp"
          control={control}
          render={({ field, fieldState: { error } }) =>
            <Input
              {...field}

              label="NPWP"
              placeholder="Masukkan NPWP"
              type="npwp"
              error={!!error}
              maxLength={16}
              helperText={error?.message}
            />
          }
        />

        <Controller
          name="nik"
          control={control}
          render={({ field }) =>
            <Input
              {...field}

              label="NIK"
              placeholder="Masukkan NIK"
              type="number"
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
            />
          }
        />

        <Controller
          name="shares"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Shares"
              placeholder="Masukkan Shares"
              type="number"
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
              thousandSeparator
            />
          }
        />

        <Controller
          name="percentage"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Percentage"
              placeholder="Masukkan Percentage"
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

        <Controller
          name="currency"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Currency"
              placeholder="Masukkan Currency"
              type="text"
            />
          }
        />

        <Controller
          name="nominal"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Nominal"
              placeholder="Masukkan Nominal"
              type="number"
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
              thousandSeparator
            />
          }
        />

        <Controller
          name="owner"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Owner"
              placeholder="Masukkan Owner"
              type="text"
            />
          }
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Gender"
              placeholder="Masukan Gender"
              type="dropdown"
              dropdownList={[
                {
                  label: 'Laki-laki',
                  value: 'M',
                },
                {
                  label: 'Perempuan',
                  value: 'F',
                }
              ]}
            />
          }
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Address"
              placeholder="Masukkan Alamat"
              type="text"
            />
          }
        />

        <Controller
          name="village"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Village"
              placeholder="Masukkan Kelurahan"
              type="text"
            />
          }
        />

        <Controller
          name="district"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="District"
              placeholder="Masukkan Kecamatan"
              type="text"
            />
          }
        />

        <Controller
          name="collectability"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Collectability"
              placeholder="Masukkan Collectability"
              type="text"
            />
          }
        />

        <Controller
          name="collectabilityStatus"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Status Collectability Per"
              placeholder="Masukkan Status Collectability Per"
              type="text"
            />
          }
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
          disabled={!formState.isValid || !formState.isDirty}
          isLoading={isSaveLoading}
          onClick={handleSubmit(mutateShareholder)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalShareholderNew;
