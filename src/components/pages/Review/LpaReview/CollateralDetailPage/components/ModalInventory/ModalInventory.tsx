import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import FormUploadDocument from '../FormUploadDocument';

import useModalInventory from './ModalInventory.hook';


const ModalInventory = NiceModal.create((
  {
    processId,
    parentId,
    id = null,
    viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }) => {
  const {
    handleSubmit,
    handleSubmitData,
    modalId,
    theme,
    visible,
    methods,
    control,
    isValidForm,
  } = useModalInventory({ id, parentId, processId, viewOnly });

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 4 }}>
      {viewOnly ?
        <Button
          sx={{ mr: 1 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button> :
        <>
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleSubmitData)}
            disabled={!isValidForm}
          >
            Save
          </Button>
        </>}
    </RowWrapper>
  );

  return (
    <SectionModal
      title={id ? 'Edit Inventory' : 'Add Inventory'}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '80vh',
        maxWidth: '52vw',
        minWidth: '52vw',
      }}
      customFooter={footer}
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
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Nama"
              placeholder="Input Nama"
              // error={!!formState.errors.name}
              // helperText={formState.errors.name?.message}
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              disabled={viewOnly}
              type="number"
              label="Jumlah"
              placeholder="Input Jumlah"
              {...field}
              onValueChange={(values) => {
                field.onChange(values.value);
              }}
            />
          )}
        />

        <Controller
          name="condition"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Kondisi"
              placeholder="Input Kondisi"
            />
          )}
        />

        <Controller
          name="remark"
          control={control}
          render={({ field }) => (
            <Input
              disabled={viewOnly}
              type="area"
              rows={4}
              label="Keterangan"
              placeholder="Input Keterangan"
              {...field}
            />
          )}
        />
      </Box>

      <ColumnWrapper
        sx={{
          gap: 3,
        }}
      >
        <RowWrapper
          sx={{
            borderBottom: '0.1vw solid',
            borderColor: theme.palette.custom.gray30,
            justifyContent: 'center',
            py: 3,
          }}
        >
          <TextStyle variant="body1" color={theme.palette.primary.main} sx={{ justifyContent: 'center' }}>
            Upload Dokumen
          </TextStyle>
        </RowWrapper>
        <FormProvider {...methods} >
          <FormUploadDocument />
        </FormProvider>
      </ColumnWrapper>

    </SectionModal>
  );
});

export default ModalInventory;
