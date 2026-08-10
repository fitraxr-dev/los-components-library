import React from 'react';


import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import InputDebtorName from '@/components/shared/Input/components/InputDebtorName';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import useModalTableDebtorNew from './ModalTableDebtorNew.hook';


const ModalTableDebtorNew = create(({ id }: { id: string }) => {

  const {
    control,
    modal,
    theme,
    modalId,
    handleSubmit,
    mutateDebtor,
    isSaveLoading,
    formState,
  } = useModalTableDebtorNew({ id });

  return (
    <SectionModal
      title={id ? 'Edit Customer' : 'Add Customer'}
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
        <InputDebtorName
          control={control}
          disabled={!!id}
          label="Nama"
          name="name"
          placeholder="Masukkan Nama"
          containerSx={{ gridColumn: '1 / -1' }}
          inputProps={{}}
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
          name="documentNpwp"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Dokumen NPWP"
              placeholder="Masukkan Dokumen NPWP"
              type="file"
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
          onClick={handleSubmit(mutateDebtor)}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalTableDebtorNew;
