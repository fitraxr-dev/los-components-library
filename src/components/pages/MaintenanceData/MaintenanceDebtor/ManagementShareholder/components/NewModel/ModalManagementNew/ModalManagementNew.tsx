import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { toCurrentDate } from '@/helpers/date';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalManagementNew from './ModalManagementNew.hook';


const ModalManagementNew = create(({ }) => {

  const {
    control,
    modal,
    theme,
    modalId,
    mutateManagement,
    handleSubmit,
    isSaveLoading,
  } = useModalManagementNew();

  return (
    <SectionModal
      title="Add New Management"
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
          name="name"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Name"
              placeholder="Masukkan Nama Manajemen"
              type="text"
            />
          }
        />

        <Controller
          name="title"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Title"
              placeholder="Masukkan Title"
              type="text"
            />
          }
        />

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Gender"
              placeholder="Masukkan Gender"
              type="dropdown"
              dropdownList={[
                {
                  label: 'Laki-laki',
                  value: 'M',
                },
                {
                  label: 'Perempuan',
                  value: 'F',
                },
              ]}
            />
          )}
        />

        <Controller
          name="position"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Jabatan"
              placeholder="Masukkan Jabatan"
              type="text"
            />
          }
        />

        <Controller
          name="dob"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="DOB"
              placeholder="Masukkan DOB"
              type="date"
              maxDate={toCurrentDate().toISOString()}
              containerSx={{ flex: 1 }}
              popper={
                { placement: 'top-start' }
              }
            />
          }
        />

        <Controller
          name="etnicOrigin"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Etnic Origin"
              placeholder="Masukkan Etnic Origin"
              type="text"
            />
          }
        />

        <Controller
          name="idType"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="ID Type"
              placeholder="Masukkan ID Type"
              type="text"
            />
          }
        />

        <Controller
          name="idNo"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="ID No"
              placeholder="Masukkan ID No"
              type="text"
            />
          }
        />

        <Controller
          name="identityExpiry"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Identity Expiry"
              placeholder="Masukkan Identity Expiry"
              type="date"
            />
          }
        />

        <Controller
          name="npwp"
          control={control}
          render={({ field, formState: { errors } }) =>
            <Input
              {...field}
              label="NPWP"
              placeholder="Masukkan NPWP"
              maxLength={16}
              type="npwp"
              error={!!errors?.npwp}
              helperText={errors?.npwp?.message || null}
            />
          }
        />

        <Controller
          name="nationality"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Nationality"
              placeholder="Masukkan Nationality"
              type="text"
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
              placeholder="Masukkan Address"
              type="text"
            />
          }
        />

        <Controller
          name="country"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Negara"
              placeholder="Masukkan Negara"
              type="text"
            />
          }
        />

        <Controller
          name="province"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Lokasi (Provinsi)"
              placeholder="Masukkan Lokasi (Provinsi)"
              type="text"
            />
          }
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Lokasi (Kota - Kabupaten)"
              placeholder="Masukkan Lokasi (Kota - Kabupaten)"
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
              label="Lokasi (Kecamatan)"
              placeholder="Masukkan Lokasi (Kecamatan)"
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
              label="Lokasi (Kelurahan)"
              placeholder="Masukkan Lokasi (Kelurahan)"
              type="text"
            />
          }
        />

        <Controller
          name="postalCode"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Postal Code"
              placeholder="Masukkan Postal Code"
              type="number"
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
            />
          }
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Phone"
              placeholder="Masukkan Phone"
              type="number"
              onValueChange={(values) => {
                field.onChange(values.value);
              }}

            />
          }
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Status"
              placeholder="Masukkan Status"
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
          name="collectabilityStatusPer"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Status Collectability New"
              placeholder="Masukkan Status Collectability New"
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
          isLoading={isSaveLoading}
          onClick={handleSubmit(mutateManagement)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalManagementNew;
