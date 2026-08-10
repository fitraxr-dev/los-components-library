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

import useModalBuilding from './ModalBuilding.hook';


const ModalBuilding = NiceModal.create((
  {
    processId,
    parentId,
    id = null,
    viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }
) => {

  const {
    control,
    handleSubmit,
    handleSubmitData,
    isValidForm,
    methods,
    modalId,
    theme,
    visible,
  } = useModalBuilding({ id, parentId, processId, viewOnly });

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
      title={id ? 'Edit Bangunan' : 'Add Bangunan'}
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
          defaultValue=""
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
          name="imbNumber"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Nomor IMB"
              placeholder="Input Nomor IMB"
            // error={!!formState.errors.imbNumber}
            // helperText={formState.errors.imbNumber?.message}
            />
          )}
        />
        <Controller
          name="imbDate"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              type="date"
              label="Tanggal IMB"
            // error={!!formState.errors.imbDate}
            // helperText={formState.errors.imbDate?.message}
            />
          )}
        />
        <Controller
          name="publishedPlace"
          control={control}
          defaultValue=""
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Diterbitkan Di"
              placeholder="Input Diterbitkan Di"
            // error={!!formState.errors.publishedPlace}
            // helperText={formState.errors.publishedPlace?.message}
            />
          )}
        />
        <Controller
          name="builtYear"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Tahun Dibangun/Renovasi"
              placeholder="Input Tahun Dibangun/Renovasi"
              // error={!!formState.errors.builtYear}
              // helperText={formState.errors.builtYear?.message}
              type="number"
            />
          )}
        />
        <Controller
          name="condition"
          control={control}
          defaultValue=""
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Kondisi"
              placeholder="Input Kondisi"
            // error={!!formState.errors.condition}
            // helperText={formState.errors.condition?.message}
            />
          )}
        />
        <Controller
          name="allotment"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Peruntukan"
              placeholder="Input Peruntukan"
            />
          )}
        />
        <Controller
          name="wide"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              type="number"
              label="Luas(m2)"
              placeholder="Input Luas"
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
            // error={!!formState.errors.wide}
            // helperText={formState.errors.wide?.message}
            />
          )}
        />
        <Controller
          name="remark"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              disabled={viewOnly}
              type="area"
              rows={4}
              label="Keterangan"
              placeholder="Input Keterangan"
              {...field}
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

export default ModalBuilding;
