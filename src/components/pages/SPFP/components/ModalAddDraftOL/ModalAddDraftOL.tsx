import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import useApp from '@/hooks/useApp';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import useFieldUploadDocument from '@/components/pages/MaintenanceData/MaintenanceDebtor/LpaPage/LpaPageDetail/DetailAgunan/component/FieldUploadDocument/FieldUploadDocument.hooks';
import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';

import { useAddDraftOLModal } from './ModalAddDraftOL.hook';


const ModalAddOL = NiceModal.create((props: any) => {
  const theme = useTheme();
  const modalId = modal.MODAL_ADD_DRAFT_OL;
  const isModal = useModal(modalId);
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

  const isEditMode = !!props.editData;
  const isDetailMode = !!props.isDetail;
  const isFinalOl = props.isFinalOl === true;

  const { handleOpenWatermarkModal } = useFieldUploadDocument();

  const {
    handleOnSave,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    isSaveLoading,
    documentGroup,
    documentType,
    signedDate,
  } = useAddDraftOLModal(props);

  const {
    document,
    documentName,
    noDraft,
  } = masintonForm;

  const isMandatoryEmpty = !document.value;

  const modalTitle = (() => {
    if (isDetailMode && isFinalOl) return 'Detail Final OL';
    if (isDetailMode) return 'Detail Draft OL';
    if (isEditMode) return 'Edit Draft OL';
    return 'Add Draft OL';
  })();

  return (
    <SectionModal
      title={modalTitle}
      isOpen={isModal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '30vw' }}
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

        {isDetailMode && isFinalOl && (
          <Autocomplete
            disabled
            label="Group Dokumen"
            placeholder="Group Dokumen"
            value={documentGroup}
            error={typeof documentGroup === 'object' ? documentGroup?.error : false}
            helperText={typeof documentGroup === 'object' && documentGroup?.error && documentGroup?.errorMessage}
          />
        )}

        {isDetailMode && isFinalOl && (
          <Autocomplete
            disabled
            label="Jenis Dokumen"
            placeholder="Jenis Dokumen"
            value={documentType}
            error={typeof documentType === 'object' ? documentType?.error : false}
            helperText={typeof documentType === 'object' && documentType?.error && documentType?.errorMessage}
          />
        )}

        <Input
          label="Nama OL"
          type="text"
          placeholder="Nama OL"
          disabled={true}
          value={documentName.value}
          onChange={(val) => {
            if (!isDetailMode) {
              masintonChange('documentName', val);
            }
          }}
        />

        <Box sx={{ alignItems: 'flex-center', display: 'flex', gap: 1 }}>
          <Input
            isMandatory
            type="file"
            label="Upload Dokumen"
            placeholder="Upload Dokumen"
            containerSx={{
              '& input': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              flex: 1,
              mb: 0,
              minWidth: 0,
            }}
            disabled={isDetailMode || !!props?.id || isSaveLoading}
            value={document.value}
            onChange={(val) => {
              if (isDetailMode) return;

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
            helperText={undefined}
          />

          {isDetailMode && (
            <Box
              sx={{
                alignSelf: 'center',
                display: 'flex',
                gap: 1,
                marginTop: 'calc(1em + 2px)',
              }}
            >
              <Box
                onClick={() => handleOpenWatermarkModal(document.value, 'preview')}
                sx={{ cursor: 'pointer', display: 'flex' }}
              >
                <Icon iconName="preview-document" sx={{ height: 16, width: 16 }} />
              </Box>
              <Box
                onClick={() => handleOpenWatermarkModal(document.value, 'download')}
                sx={{ cursor: 'pointer', display: 'flex' }}
              >
                <Icon iconName="download" sx={{ height: 16, width: 16 }} />
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ ml: 1, mt: -4 }}>
          <span
            style={{
              color:
                (document.value?.error || document.error)
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
              fontSize: 8,
            }}
          >
            {(document.value?.error && document.value?.errorMessage)
              || (document.error && document.errorMessage)
              || `Supported formats: ${acceptedFormatsText}`}
          </span>
        </Box>

        {isDetailMode && isFinalOl && (
          <Input
            type="date"
            label="Tanggal Tanda Tangan"
            placeholder="Tanggal Tanda Tangan"
            containerSx={{ flex: 1 }}
            disabled
            value={signedDate}
          />
        )}

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
            <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
              Close
            </Button>
          </RowWrapper>
        )}
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalAddOL;
