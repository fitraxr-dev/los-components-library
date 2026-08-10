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

import useModalBoat from './ModalBoat.hook';


const ModalBoat = NiceModal.create((
  { processId,
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
  } = useModalBoat({ id, parentId, processId, viewOnly });

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
      title={id ? 'Edit Kapal' : 'Add Kapal'}
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
              label="Nama"
              placeholder="Input Nama"
              disabled={viewOnly}
            />
          )}
        />
        <Controller
          name="countryManufacture"
          control={control}
          render={({ field }) => (
            <Input
              label="Negara Pembuat"
              placeholder="Input Negara Pembuat"
              {...field}
              disabled={viewOnly}
            />
          )}
        />
        <Controller
          name="condition"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Kondisi"
              placeholder="Input Kondisi"
              disabled={viewOnly}
            />
          )}
        />
        <Controller
          name="year"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Tahun"
              placeholder="Input Tahun"
              disabled={viewOnly}
            />
          )}
        />
        <Controller
          name="portOfRegistration"
          control={control}
          render={({ field }) => (
            <Input
              label="Pelabuhan Pendaftaran"
              placeholder="Input Pelabuhan Pendaftaran"
              {...field}
              disabled={viewOnly}
            />
          )}
        />
        <Controller
          name="identificationLetterNumber"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Nomor/Huruf Pengenal"
              placeholder="Input Nomor/Huruf Pengenal"
              disabled={viewOnly}
              thousandSeparator
              type="text"
              // isMandatory
              // error={!!formState.errors.identificationLetterNumber}
              // helperText={formState.errors.identificationLetterNumber?.message?.toString()}
            />
          )}
        />
        <Controller
          name="imoNo"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="No IMO"
              placeholder="Input No IMO"
              disabled={viewOnly}
              // isMandatory
              // error={!!formState.errors.imoNo}
              // helperText={formState.errors.imoNo?.message?.toString()}
            />
          )}
        />
        <Controller
          name="deadWeight"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Bobot Mati"
              placeholder="Input Bobot Mati"
              disabled={viewOnly}
            />
          )}
        />
        <Controller
          name="mainEngine"
          control={control}
          render={({ field }) => (
            <Input
              label="Mesin Utama"
              placeholder="Input Mesin Utama"
              {...field}
              disabled={viewOnly}
            />
          )}
        />
        <Controller
          name="flag"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Bendera"
              placeholder="Input Bendera"
              disabled={viewOnly}
              // isMandatory
              // error={!!formState.errors.flag}
              // helperText={formState.errors.flag?.message?.toString()}
            />
          )}
        />
        <Controller
          name="wide"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Lebar"
              placeholder="Input Lebar"
              disabled={viewOnly}
              // isMandatory
              // error={!!formState.errors.wide}
              // helperText={formState.errors.wide?.message?.toString()}
            />
          )}
        />
        <Controller
          name="in"
          control={control}
          render={({ field, formState }) => (
            <Input
              label="Dalam"
              placeholder="Input Dalam"
              {...field}
              disabled={viewOnly}
              // isMandatory
              // error={!!formState.errors.in}
              // helperText={formState.errors.in?.message?.toString()}
            />
          )}
        />
        <Controller
          name="length"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Panjang Keseluruhan"
              placeholder="Input Panjang Keseluruhan"
              disabled={viewOnly}
              // isMandatory
              // error={!!formState.errors.length}
              // helperText={formState.errors.length?.message?.toString()}
            />
          )}
        />
        <Controller
          name="netWeight"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Berat Bersih"
              placeholder="Input Berat Bersih"
              disabled={viewOnly}
              // isMandatory
              // error={!!formState.errors.netWeight}
              // helperText={formState.errors.netWeight?.message?.toString()}
            />
          )}
        />
        <Controller
          name="remark"
          control={control}
          render={({ field }) => (
            <Input
              type="area"
              rows={4}
              label="Keterangan"
              placeholder="Input Keterangan"
              {...field}
              disabled={viewOnly}
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

export default ModalBoat;
