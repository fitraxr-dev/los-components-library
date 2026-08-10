import { useMemo } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import { toCurrentDate, toDateStringNumber } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import {
  documentCategoryDropdownList,
  documentGroupDropdownList,
  documentTypeDropdownList,
  fileType,
  modal,
} from './ModalUploadDocument.constants';
import useModalUploadDocument from './ModalUploadDocument.hook';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.types';


const ModalUploadDocument = NiceModal.create((props: ModalUploadDocumentProps) => {
  const theme = useTheme();
  const modalId = modal.MODAL_UPLOAD_DOCUMENT;
  const { visible } = useModal(modalId);

  const [state] = useApp();

  const acceptTypes: string[] = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    '.ppt',
    'application/vnd.ms-powerpoint',
    '.pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.pdf',
    'application/pdf',
    '.doc',
    'application/msword',
    '.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls',
    'application/vnd.ms-excel',
    '.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv',
    'text/csv',
    '.zip',
    'application/x-zip-compressed',
    'application/zip',
    'application/x-compressed'
  ];

  const { validateFile, acceptedFormatsText } = useCheckFileDokument({ acceptableMimeTypes: acceptTypes });

  const {
    handleSave,
    isSaveLoading,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    generateTitle,
    debiturName,
    getDocumentTypeLabel,
  } = useModalUploadDocument(props);


  const {
    document,
    documentCategory,
    documentDate,
    documentGroup,
    documentName,
    documentNumber,
    documentType,
  } = masintonForm;


  const isMandatoryEmpty =
  !document.value ||
  !documentCategory.value ||
  !documentGroup.value ||
  !documentType.value ||
  !documentDate.value ||
  !documentNumber.value;

  const docName = useMemo(() => {
    return `${getDocumentTypeLabel(documentType.value) ?? '[Jenis Dokumen]'}_${debiturName}_${documentNumber?.value.length !== 0 ? documentNumber?.value : '[Dokumen Number]'}_${documentDate?.value ? dayjs(documentDate?.value).format('DDMMYYYY') : '[Tanggal Dokumen]'}`;
  }, [documentType, debiturName, documentNumber, documentDate]);


  return (
    <SectionModal
      title={generateTitle(props.id)}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            label="Upload By"
            placeholder="Upload By"
            containerSx={{ flex: 1 }}
            value={state?.userData?.user?.fullName}
            disabled
          />
          <Input
            label="Upload Date"
            placeholder="Upload Date"
            containerSx={{ flex: 1 }}
            value={toDateStringNumber(toCurrentDate())}
            disabled
          />
        </Box>
        <Input
          disabled
          isMandatory
          type="dropdown"
          label="Kategori Dokumen"
          placeholder="Kategori Dokumen"
          containerSx={{ flex: 1 }}
          dropdownList={documentCategoryDropdownList}
          value={documentCategory.value}
          error={documentCategory.error}
          helperText={documentCategory.error && documentCategory.errorMessage}
        />
        <Input
          disabled
          isMandatory
          type="dropdown"
          label="Group Dokumen"
          placeholder="Group Dokumen"
          containerSx={{ flex: 1 }}
          dropdownList={documentGroupDropdownList}
          value={documentGroup.value}
          error={documentGroup.error}
          helperText={documentGroup.error && documentGroup.errorMessage}
        />
        <Input
          disabled
          isMandatory
          type="dropdown"
          label="Jenis Dokumen"
          placeholder="Jenis Dokumen"
          containerSx={{ flex: 1 }}
          dropdownList={documentTypeDropdownList}
          value={documentType.value}
          error={documentType.error}
          helperText={documentType.error && documentType.errorMessage}
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
          helperText={
            (document.value?.error && document.value?.errorMessage) ||
            (document.error && document.errorMessage) ||
            `Supported formats: ${acceptedFormatsText}`}
          fileConstraint={fileType.FILE_CONSTRAINT}
        />
        <Input
          disabled
          isMandatory
          label="Nama Dokumen"
          placeholder="Input Nama Dokumen"
          containerSx={{ flex: 1 }}
          value={docName}
          error={documentName.error}
          helperText={documentName.error && documentName.errorMessage}
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',

          }}
        >
          <Input
            isMandatory
            label="Nomor Dokumen"
            placeholder="Input Nomor Dokumen"
            containerSx={{ flex: 1 }}

            value={documentNumber.value}
            onChange={(val) => {masintonChange('documentNumber', val);}}
            error={documentNumber.error}
            helperText={documentNumber.error && documentNumber.errorMessage}
            withSymbols
          />
          <Input
            isMandatory
            type="date"
            label="Tanggal Dokumen"
            placeholder="Input Tanggal Dokumen"
            containerSx={{ flex: 1 }}
            value={documentDate.value}
            onChange={(val) => {masintonChange('documentDate', val.toISOString());}}
            error={documentDate.error}
            helperText={documentDate.error && documentDate.errorMessage}
          />
        </Box>

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
    </SectionModal >
  );
});

export default ModalUploadDocument;
