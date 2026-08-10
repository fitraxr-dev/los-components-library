import React, { useState } from 'react';

import NiceModal, { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import useCheckFileDokument, { PDF_ONLY_MIME_TYPES } from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from './ModalUploadDocumentMIP.constants';
import useModalUploadDocumentMIP from './ModalUploadDocumentMIP.hook';

import type { ModalUploadDocumentMipProps } from './ModalUploadDocumentMIP.types';


const ModalUploadDocumentMIP = create((props: ModalUploadDocumentMipProps) => {
  const { id } = props;
  const modalId = modal.UPLOAD_DOCUMENT_MIP;
  const { visible } = useModal(modalId);
  const theme = useTheme();
  const { validateFile, acceptedFormatsText } = useCheckFileDokument({ acceptableMimeTypes: PDF_ONLY_MIME_TYPES });

  const [fileError, setFileError] = useState<string>('');

  const {
    control,
    handleOnSave,
    handleOnCancel,
    setValue,
    setFileObject,
    handleSubmit,
    isDirty,
    isDocumentEmpty,
    isSaveDocumentLoading,
    isSaveDisabled,
  } = useModalUploadDocumentMIP(props);

  const handleConfirmSave = () => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'OK',
      cancelText: 'Cancel',
      onCancel: () => closeNiceModal(MODAL.GLOBAL.CONFIRM),
      onSubmit: () => {
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
        handleSubmit(handleOnSave)();
      },
      title: 'Pastikan data yang diupload sudah sesuai dengan data yang diinput pada sistem',
    });
  };

  return (
    <SectionModal
      title={`${id ? 'Edit Dokumen MIP' : 'Add New Dokumen MIP'}`}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            control={control}
            name="uploadBy"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                type="text"
                disabled
                label="Upload By"
                placeholder="Upload By"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="uploadDate"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                type="date"
                disabled
                label="Upload Date"
                placeholder="Upload Date"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Box>
        <Controller
          name="document"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <Input
              {...field}
              type="file"
              isMandatory={!id}
              label="Upload Dokumen"
              placeholder="Upload Dokumen"
              containerSx={{ flex: 1 }}
              onChange={(val) => {
                const result = validateFile(val);
                if (!result.isValid) {
                  setFileError(result.errorMessage);
                  setValue('document', null);
                  setValue('documentName', null);
                  setFileObject(null);
                  return;
                }

                setFileError('');
                setFileObject(val.file);
                field.onChange(val);
                setValue('documentName', val.name);
              }}
              error={!!error || !!fileError}
              helperText={fileError || error?.message
                || 'Supported formats: PDF'}
            />
          )}
        />
        <Controller
          name="documentName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="text"
              label="Nama Dokumen"
              placeholder="Nama Dokumen"
              containerSx={{ flex: 1 }}
              error={!!error}
              helperText={error?.message}
              disabled={isDocumentEmpty}
            />
          )}
        />
        <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
          <Button
            variant="outlined"
            onClick={handleOnCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={!isDirty || isSaveDisabled || isSaveDocumentLoading}
            onClick={handleConfirmSave}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalUploadDocumentMIP;
