import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { toCurrentDate } from '@/helpers/date';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalManagementExisting from './ModalManagementExisting.hook';

import type { ModalManagementExistingProps } from './ModalManagementExisting.type';


const ModalManagementExisting = create((props: ModalManagementExistingProps) => {

  const {
    isSaveLoading,
    handleSubmit,
    mutateManagement,
    theme,
    modalId,
    formState,
    control,
    jobPositionData,
    modal } = useModalManagementExisting(props);

  return (
    <SectionModal
      title={props.id ? 'Edit Management' : 'Add Management'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        '-ms-overflow-style': 'none',
        minWidth: '52vw',
        'scrollbar-width': 'none',
      }}
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
          render={({ field, formState }) =>
            <Input
              {...field}
              label="Name"
              placeholder="Masukkan Nama"
              type="text"
              isMandatory
              error={!!formState.errors.name}
              helperText={formState.errors.name?.message || null}
            />
          }
        />

        <Controller
          name="position"
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
          name="npwp"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) =>
            <Input
              {...field}
              ref={ref}

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
          name="nik"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) =>
            <Input
              {...field}
              ref={ref}
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
              label="Upload NIK"
              placeholder="Upload NIK"
              type="file"
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
          disabled={!formState.isValid}
          isLoading={isSaveLoading}
          onClick={handleSubmit(mutateManagement)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalManagementExisting;
