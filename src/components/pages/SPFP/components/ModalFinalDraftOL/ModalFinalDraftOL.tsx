import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';

import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';

import { useModalFinalDraftOL } from './ModalFinalDraftOL.hook';

import type { ModalFinalDraftOLProps } from './ModalFinalDraftOL.types';


const ModalFinalDraftOL = NiceModal.create((props: ModalFinalDraftOLProps) => {
  const theme = useTheme();
  const modalId = modal.MODAL_FINAL_DRAFT_OL;
  const isModal = useModal(modalId);
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

  const isEditMode = !!props.editData;
  const isDetailMode = !!props.isDetail;

  const {
    handleOnSave,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    isSaveLoading,
    generateTitle,
    documentCategory,
    documentGroup,
    documentGroupData,
    documentType,
    documentTypeData,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isKtpOrNpwp,
    docoumentName,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
  } = useModalFinalDraftOL(props);

  const {
    document: documentField,
    documentName,
    noDraft,
    signedDate,
  } = masintonForm;

  const isMandatoryEmpty =
    !documentField.value ||
    !documentCategory ||
    (typeof documentCategory === 'object' && !documentCategory?.id) ||
    !documentGroup ||
    (typeof documentGroup === 'object' && !documentGroup?.id) ||
    !documentType ||
    (typeof documentType === 'object' && !documentType?.id) ||
    !signedDate.value;

  return (
    <SectionModal
      title={isDetailMode ? 'Detail Draft OL' : (isEditMode ? 'Edit Final OL' : 'Add Final OL')}
      isOpen={isModal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '30vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Input
          label="No. Draft"
          type="text"
          placeholder="No. Draft"
          disabled={true}
          rows={3}
          value={noDraft.value}
          multiline
        />
        <Autocomplete
          isMandatory
          disabled={!documentCategory || (typeof documentCategory === 'object' && !documentCategory?.id) || isDetailMode || isKtpOrNpwp}
          isLoading={isFetchDocumentGroupLoading}
          label="Group Dokumen"
          placeholder="Group Dokumen"
          dropdownList={documentGroupData}
          value={documentGroup}
          onChange={(val) => {
            masintonMultiChange({
              documentGroup: val,
              documentType: '',
            });
          }}
          onInputChange={setKeyworDocumentGroup}
          error={typeof documentGroup === 'object' ? documentGroup?.error : false}
          helperText={typeof documentGroup === 'object' && documentGroup?.error && documentGroup?.errorMessage}
        />
        <Autocomplete
          isMandatory
          disabled={!documentGroup || (typeof documentGroup === 'object' && !documentGroup?.id) || isDetailMode || isKtpOrNpwp}
          isLoading={isFetchDocumentTypeLoading}
          label="Jenis Dokumen"
          placeholder="Jenis Dokumen"
          dropdownList={documentTypeData}
          value={documentType}
          onChange={(val) => { masintonChange('documentType', val); }}
          onInputChange={setKeyworDocumentType}
          error={typeof documentType === 'object' ? documentType?.error : false}
          helperText={typeof documentType === 'object' && documentType?.error && documentType?.errorMessage}
        />
        <Input
          isMandatory
          disabled={true}
          label="Nama Dokumen"
          placeholder="Input Nama Dokumen"
          containerSx={{ flex: 1 }}
          value={docoumentName}
          error={documentName.error}
          helperText={documentName.error && documentName.errorMessage}
        />
        <Input
          isMandatory
          type="file"
          label="Upload Dokumen"
          placeholder="Upload Dokumen"
          containerSx={{ flex: 1 }}
          disabled={isDetailMode || (props?.id ? true : false) || isSaveLoading}
          value={documentField.value}
          onChange={(val) => {
            if (isDetailMode) return; // Prevent onChange in detail mode
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
          error={documentField.value?.error || documentField.error}
          helperText={(documentField.value?.error && documentField.value?.errorMessage)
            || (documentField.error && documentField.errorMessage)
            || `Supported formats: ${acceptedFormatsText}`}
        />
        <Input
          type="date"
          isMandatory
          label="Tanggal Tanda Tangan"
          placeholder="Tanggal Tanda Tangan"
          containerSx={{ flex: 1 }}
          disabled={isDetailMode}
          value={signedDate.value}
          onChange={(val) => { masintonChange('signedDate', dayjs(val).format('YYYY-MM-DD')); }}
          error={signedDate.error}
          helperText={signedDate.error && signedDate.errorMessage}
        />
        {!isDetailMode && (
          <RowWrapper py={3} gap={2} justifyContent="end">
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
              disabled={isSaveLoading}
            >
              Cancel
            </Button>
            <Button
              disabled={isMandatoryEmpty || isSaveLoading}
              onClick={() => handleOnSave(props)}
            >
              Save
            </Button>
          </RowWrapper>
        )}
        {isDetailMode && (
          <RowWrapper py={3} gap={2} justifyContent="end">
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
            >
              Close
            </Button>
          </RowWrapper>
        )}
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalFinalDraftOL;
