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

import useModalMachineEquipment from './ModalMachineEquipment.hook';


const ModalMachineEquipment = NiceModal.create(({
  processId,
  parentId,
  id = null,
  viewOnly = false }: { processId: string; parentId: string; id: string; viewOnly: boolean }) => {
  const {
    handleSubmit,
    handleSubmitData,
    modalId,
    setValue,
    theme,
    visible,
    methods,
    control,
    isValidForm,
  } = useModalMachineEquipment({ id, parentId, processId, viewOnly });

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
      title={id ? 'Edit Mesin dan Peralatan' : 'Add Mesin dan Peralatan'}
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
          name="engineName"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Nama Mesin & Peralatan"
              placeholder="Input Nama Mesin & Peralatan"
            />
          )}
        />

        <Controller
          name="spesification"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              disabled={viewOnly}
              label="Spesifikasi"
              placeholder="Input Spesifikasi"
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              disabled={viewOnly}
              type="number"
              label="Jumlah"
              placeholder="Input Jumlah"
              thousandSeparator
              onValueChange={(values) => {
                setValue('amount', values.floatValue);
              }}
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
          render={({ field }) => (
            <Input
              disabled={viewOnly}
              {...field}
              label="Kondisi"
              placeholder="Input Kondisi"
            />
          )}
        />

        <Controller
          name="number"
          control={control}
          render={({ field }) => (
            <Input
              disabled={viewOnly}
              type="number"
              label="Nomor"
              placeholder="Input Nomor"
              {...field}
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
              disabled={viewOnly}
              type="area"
              rows={4}
              label="Keterangan"
              placeholder="Input Keterangan"
              containerSx={{ gridColumn: '1 / 3' }}
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

export default ModalMachineEquipment;
