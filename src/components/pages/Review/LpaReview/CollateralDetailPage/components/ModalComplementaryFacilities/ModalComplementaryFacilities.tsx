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

import useModalComplementaryFacilities from './ModalComplementaryFacilities.hook';


const ModalComplementaryFacilities = NiceModal.create((
  {
    processId,
    parentId,
    id = null,
    viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }) => {
  const {
    control,
    handleSubmit,
    handleSubmitData,
    isValidForm,
    methods,
    modalId,
    theme,
    visible } = useModalComplementaryFacilities({ id, parentId, processId, viewOnly });


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
      title={id ? 'Edit Sarana Pelengkap' : 'Add Sarana Pelengkap'}
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
              // isMandatory
              // error={!!formState.errors.name}
              // helperText={formState.errors.name?.message}
            />
          )}
        />

        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Tahun"
              placeholder="Input Tahun"
              type="number"
              onValueChange={(values) => {
                field.onChange(values.floatValue);
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
              // isMandatory
              // error={!!formState.errors.condition}
              // helperText={formState.errors.condition?.message}
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={viewOnly}
              type="number"
              label="Jumlah Unit"
              placeholder="Input Jumlah Unit"
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
            />
          )}
        />

        <Controller
          name="capacity"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={viewOnly}
              type="number"
              label="Kapasitas"
              placeholder="Input Kapasitas"
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
            />
          )}
        />

        <Controller
          name="magnitude"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={viewOnly}
              type="number"
              label="Besaran"
              placeholder="Input Besaran"
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
            />
          )}
        />

        <Controller
          name="remark"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={viewOnly}
              type="area"
              rows={4}
              label="Keterangan"
              placeholder="Input Keterangan"
              containerSx={{ gridColumn: '1 / 3' }}
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

export default ModalComplementaryFacilities;
