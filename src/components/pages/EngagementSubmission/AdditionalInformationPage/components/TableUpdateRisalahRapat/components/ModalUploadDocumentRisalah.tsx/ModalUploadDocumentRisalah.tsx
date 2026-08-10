import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { toCurrentDate, toDateStringNumber } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from './ModalUploadDocumentRisalah.constants';
import useModalUploadDocumentRisalah from './ModalUploadDocumentRisalah.hook';

import type { ModalUploadDocumentRisalahProps } from './ModalUploadDocumentRisalah.types';


const ModalUploadDocumentRisalah = NiceModal.create((props: ModalUploadDocumentRisalahProps) => {
  const modalId = modal.MODAL_UPLOAD_DOCUMENT_RISALAH;
  const { visible } = useModal(modalId);
  const theme = useTheme();
  const [state] = useApp();

  const {
    document,
    documentName,
    documentNumber,
    getFileHelperText,
    handleSave,
    isSaveLoading,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    uploadDate,
    validateFile,
    acceptedFormatsText,
  } = useModalUploadDocumentRisalah({ ...props, visible });

  const uploadedBy = state?.userData?.user?.fullName;
  const uploadedDate = uploadDate || toDateStringNumber(toCurrentDate());

  const isMandatoryEmpty =
    !document.value ||
    !documentName.value ||
    !documentNumber.value;

  return (
    <SectionModal
      title="Add New Pembaharuan Risalah Rapat"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Input
          label="Upload Date"
          placeholder="Upload Date"
          containerSx={{ flex: 1 }}
          value={uploadedDate}
          disabled
        />
        <Input
          isMandatory
          type="file"
          label="Upload Dokumen"
          placeholder="Upload Dokumen"
          containerSx={{ flex: 1 }}
          value={document.value}
          onChange={(val) => {
            const result = validateFile(val);
            if (!result.isValid) {
              masintonMultiChange({
                document: { error: true, errorMessage: result.errorMessage },
                documentName: null,
              });
              return;
            }
            masintonMultiChange({
              document: val,
              documentName: val.name,
            });
          }}
          error={document.value?.error || document.error}
          helperText={getFileHelperText()}
        />
        <Input
          isMandatory
          label="Nama Dokumen"
          placeholder="Input Nama dokumen"
          containerSx={{ flex: 1 }}
          value={documentName.value}
          onChange={(val) => masintonChange('documentName', val)}
          error={documentName.error}
          disabled
          helperText={documentName.error && documentName.errorMessage}
        />
        <Input
          isMandatory
          label="Nomor Dokumen"
          placeholder="Input Nomor dokumen"
          containerSx={{ flex: 1 }}
          value={documentNumber.value}
          onChange={(val) => masintonChange('documentNumber', val)}
          error={documentNumber.error}
          helperText={documentNumber.error && documentNumber.errorMessage}
          withSymbols
        />

        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            disabled={isMandatoryEmpty}
            isLoading={isSaveLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalUploadDocumentRisalah;
