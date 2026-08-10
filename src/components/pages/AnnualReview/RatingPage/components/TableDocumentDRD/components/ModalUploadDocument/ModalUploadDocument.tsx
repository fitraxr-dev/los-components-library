import React, { useMemo } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import { toCurrentDate, toDateStringNumber } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useCheckFileDokument, { XLSX_ONLY_MIME_TYPES } from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


import { documentCategoryDropdownList, modal } from './ModalUploadDocument.constants';
import useModalUploadDocument from './ModalUploadDocument.hook';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.types';


export const UploadDocument = (props: ModalUploadDocumentProps) => {
  const theme = useTheme();
  const modalId = modal.MODAL_UPLOAD_DOCUMENT;

  const { validateFile } = useCheckFileDokument({
    acceptableMimeTypes: XLSX_ONLY_MIME_TYPES,
  });

  const [state] = useApp();

  const {
    debiturName,
    documentGroupData,
    documentTypeData,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    masintonChange,
    masintonMultiChange,
    masintonForm,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    generateTitle,
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
    !documentNumber.value ||
    !documentDate.value ||
    !documentName.value;

  const docoumentName = useMemo(() => {
    return `${documentType?.value?.label ?? '[Jenis Dokumen]'}_${debiturName}_${documentNumber?.value?.length !== 0 ? documentNumber?.value : '[Dokumen Number]'}_${documentDate?.value ? dayjs(documentDate?.value).format('DDMMYYYY') : '[Tanggal Dokumen]'}`;
  }, [documentType, debiturName, documentNumber, documentDate]);

  return (
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
      <Autocomplete
        isMandatory
        label="Kategori Dokumen"
        placeholder="Kategori Dokumen"
        dropdownList={props.title
          ? documentCategoryDropdownList.filter((item) => item.label === props.documentParent)
          : documentCategoryDropdownList
        }
        value={documentCategory.value}
        onChange={(val) => {
          masintonMultiChange({
            documentCategory: val,
            documentGroup: null,
            documentType: null,
          });
        }}
        error={documentCategory.error}
        helperText={documentCategory.error && documentCategory.errorMessage}
        disabled
      />
      <Autocomplete
        isMandatory
        disabled
        isLoading={isFetchDocumentGroupLoading}
        label="Group Dokumen"
        placeholder="Group Dokumen"
        dropdownList={documentGroupData || []}
        value={documentGroup.value}
        onChange={(val) => {
          masintonMultiChange({
            documentGroup: val,
            documentType: null,
          });
        }}
        onInputChange={setKeyworDocumentGroup}
        error={documentGroup.error}
        helperText={documentGroup.error && documentGroup.errorMessage}
      />
      <Autocomplete
        isMandatory
        disabled
        isLoading={isFetchDocumentTypeLoading}
        label="Jenis Dokumen"
        placeholder="Jenis Dokumen"
        dropdownList={documentTypeData || []}
        value={documentType.value}
        onChange={(val) => { masintonChange('documentType', val); }}
        onInputChange={setKeyworDocumentType}
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
          (document.error && document.errorMessage)
          || 'Supported formats: xlsx , xls'}
        fileConstraint=".xls, .xlsx,"
      />
      <Input
        isMandatory
        disabled
        label="Nama Dokumen"
        placeholder="Input Nama Dokumen"
        containerSx={{ flex: 1 }}
        value={docoumentName}
        onChange={(val) => { masintonChange('documentName', val); }}
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
          label="Nomor Dokumen"
          isMandatory
          placeholder="Input Nomor Dokumen"
          containerSx={{ flex: 1 }}

          value={documentNumber.value}
          onChange={(val) => { masintonChange('documentNumber', val); }}
          error={documentNumber.error}
          helperText={documentNumber.error && documentNumber.errorMessage}
          withSymbols
        />
        <Input
          type="date"
          isMandatory
          label="Tanggal Dokumen"
          placeholder="Input Tanggal Dokumen"
          containerSx={{ flex: 1 }}
          value={documentDate.value}
          onChange={(val) => {
            masintonChange('documentDate', val.toISOString());
          }}
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
  );

};


const ModalUploadDocument = NiceModal.create((props: ModalUploadDocumentProps) => {
  const modalId = modal.MODAL_UPLOAD_DOCUMENT;
  const { visible } = useModal(modalId);

  const { generateTitle } = useModalUploadDocument(props);

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
      <UploadDocument {...props} />
    </SectionModal>
  );
});

export default ModalUploadDocument;
