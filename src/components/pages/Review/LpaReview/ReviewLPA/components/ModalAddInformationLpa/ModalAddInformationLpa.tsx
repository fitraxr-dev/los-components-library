import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import FormUploadDocument from '@/components/shared/SmiComponent/FormUploadDocument';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL_ID } from '../../Review.constants';

import useModalAddInformationLpa from './ModalAddInformationLpa.hook';


const ModalAddInformationLpa = NiceModal.create(({ id = null }: { id: string }) => {
  const modalId = MODAL_ID.ADD_LPA;
  const modal = useModal(modalId);
  const theme = useTheme();

  const {
    methods,
    handleSaveInformationLpa,
    formState,
    control,
    getDisableDocumentField } = useModalAddInformationLpa({ id });

  const isEdit = Boolean(id);
  const modalTitle = isEdit ? 'Edit Informasi LPA' : 'Add Informasi LPA';

  return (
    <SectionModal
      title={modalTitle}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }} width="100%">
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Controller
            control={control}
            name="kjpp"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                inputRef={ref}
                label="Nama KJPP"
                placeholder="Masukkan Nama KJPP"
                error={!!error}
                helperText={error ? error.message : ''}
                isMandatory
              />
            )}
          />

          <Controller
            control={control}
            name="reportNo"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                inputRef={ref}
                label="Nomor Laporan"
                placeholder="Masukkan Nomor Laporan"
                error={!!error}
                helperText={error ? error.message : ''}
                isMandatory
              />
            )}
          />

          <Controller
            control={control}
            name="reportDate"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                inputRef={ref}
                label="Tanggal Laporan"
                type="date"
                placeholder="Pilih Tanggal Laporan"
                error={!!error}
                helperText={error ? error.message : ''}
                isMandatory
              />
            )}
          />

          <Controller
            control={control}
            name="assessmentDate"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                inputRef={ref}
                label="Tanggal Penilaian"
                type="date"
                placeholder="Pilih Tanggal Penilaian"
                error={!!error}
                helperText={error ? error.message : ''}
                isMandatory
              />
            )}
          />

          <Controller
            control={control}
            name="remark"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                inputRef={ref}
                type="area"
                rows={4}
                containerSx={{
                  'grid-column': '1 / -1',
                  'grid-row': 'span 4',
                }}
                label="Keterangan"
                placeholder="Masukkan Keterangan"
                error={!!error}
                helperText={error ? error.message : ''}
                isMandatory
              />
            )}
          />

          <Box sx={{ gridColumn: '1 / -1', width: '100%' }}>
            <ColumnWrapper sx={{ gap: 3 }} width="100%">
              <TextStyle
                variant="body1"
                sx={{
                  borderBottom: 1,
                  borderBottomColor: theme.palette.disabled.main,
                  borderBottomStyle: 'solid',
                  color: theme.palette.primary.main,
                  justifyContent: 'center',
                  padding: '0 0 10px 0',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                Upload Dokumen
              </TextStyle>

              <FormProvider {...methods} >
                <FormUploadDocument />
              </FormProvider>
            </ColumnWrapper>
          </Box>

        </Box>
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveInformationLpa}
          disabled={!formState.isValid || getDisableDocumentField}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal >
  );
},
);

export default ModalAddInformationLpa;
