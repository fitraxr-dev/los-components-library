import * as React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import { toCurrentDate } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import {
  documentCategoryDropdownList,
} from '@/components/shared/SmiModal/ModalUploadDocument/ModalUploadDocument.constants';
import useModalUploadDocument from '@/components/shared/SmiModal/ModalUploadDocument/ModalUploadDocument.hook';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { MODAL_UPLOAD_DOCUMENT_ELO } from '../../TableEloDocument.constants';

import type {
  ModalUploadDocumentProps,
} from '@/components/shared/SmiModal/ModalUploadDocument/ModalUploadDocument.types';


const ModalUploadDocumentElo = create((props: ModalUploadDocumentProps) => {
  const modalId = MODAL_UPLOAD_DOCUMENT_ELO;
  const { visible } = useModal(modalId);
  const theme = useTheme();
  const [state] = useApp();
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();


  const {
    isViewAllDocument,
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
    documentDetailData,
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

  // State untuk form fields yang bisa diedit
  const [deadlineDate, setDeadlineDate] = React.useState('');
  const [isCovenant, setIsCovenant] = React.useState(true);
  const [perihal, setPerihal] = React.useState('');
  const [aging, setAging] = React.useState();
  const [dueDate, setDueDate] = React.useState('');

  const isMandatoryEmpty =
    !document.value ||
    !documentCategory.value ||
    !documentGroup.value ||
    !documentType.value ||
    !documentNumber.value ||
    !documentDate.value ||
    !documentName.value;

  const generatedDocumentName = React.useMemo(() => {
    return `${documentType?.value?.label ?? '[Jenis Dokumen]'}_${debiturName ?? '[Customer]'}_${documentNumber?.value.length !== 0 ? documentNumber?.value : '[Dokumen Number]'}_${documentDate?.value ? dayjs(documentDate?.value).format('DDMMYYYY') : '[Tanggal Dokumen]'}`;
  }, [documentType, debiturName, documentNumber, documentDate]);

  const uploadedBy = documentDetailData?.modifiedBy ?? state?.userData?.user?.fullName;
  const uploadedDate = !!documentDetailData?.modifiedDate ?
    dayjs(documentDetailData.modifiedDate).format('YYYY-MM-DD') :
    dayjs(toCurrentDate()).format('YYYY-MM-DD');

  return (
    <SectionModal
      title={`${generateTitle(+props.id)} ELO`}
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
            value={uploadedBy}
            disabled
          />
          <Input
            label="Upload Date"
            placeholder="Upload Date"
            type="date"
            containerSx={{ flex: 1, pointerEvents: 'none' }}
            value={uploadedDate}
            disabled
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Autocomplete
            label="Kategori Dokumen"
            placeholder="Kategori Dokumen"
            dropdownList={documentCategoryDropdownList}
            value={documentCategory.value}
            onChange={(val) => {
              masintonMultiChange({
                documentCategory: val,
                documentGroup: '',
                documentType: '',
              });
            }}
            error={documentCategory.error}
            helperText={documentCategory.error && documentCategory.errorMessage}
            isMandatory
            disabled={isViewAllDocument}
          />
          <Autocomplete
            label="Group Dokumen"
            placeholder="Group Dokumen"
            dropdownList={documentGroupData}
            isLoading={isFetchDocumentGroupLoading}
            value={documentGroup.value}
            onChange={(val) => {
              masintonMultiChange({
                documentGroup: val,
                documentType: '',
              });
            }}
            onInputChange={setKeyworDocumentGroup}
            error={documentGroup.error}
            helperText={documentGroup.error && documentGroup.errorMessage}
            isMandatory
            disabled={!documentCategory.value}
          />
        </Box>
        <Autocomplete
          label="Jenis Dokumen"
          placeholder="Jenis Dokumen"
          dropdownList={documentTypeData}
          isLoading={isFetchDocumentTypeLoading}
          value={documentType.value}
          onChange={(val) => { masintonChange('documentType', val); }}
          onInputChange={setKeyworDocumentType}
          error={documentType.error}
          helperText={documentType.error && documentType.errorMessage}
          isMandatory
          disabled={!documentGroup.value}
        />
        <Input
          label="Upload Dokumen"
          placeholder="Upload Dokumen"
          type="file"
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
          helperText={(document.value?.error && document.value?.errorMessage)
            || (document.error && document.errorMessage)
            || `Supported formats: ${acceptedFormatsText}`}
          isMandatory
        />
        <Input
          label="Nama Dokumen"
          placeholder="Input Nama Dokumen"
          containerSx={{ flex: 1 }}
          value={generatedDocumentName}
          error={documentName.error}
          helperText={documentName.error && documentName.errorMessage}
          isMandatory
          disabled
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
            placeholder="Input Nomor Dokumen"
            containerSx={{ flex: 1 }}

            value={documentNumber.value}
            onChange={(val) => { masintonChange('documentNumber', val); }}
            error={documentNumber.error}
            helperText={documentNumber.error && documentNumber.errorMessage}
            isMandatory
          />
          <Input
            label="Tanggal Dokumen"
            placeholder="Input Tanggal Dokumen"
            type="date"
            containerSx={{ flex: 1 }}
            value={documentDate.value}
            onChange={(val) => { masintonChange('documentDate', val.toISOString()); }}
            error={documentDate.error}
            helperText={documentDate.error && documentDate.errorMessage}
            isMandatory
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            label="Tanggal Jatuh Tempo"
            placeholder="Input Tanggal Jatuh Tempo"
            type="date"
            containerSx={{ flex: 1, pointerEvents: 'none' }}
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
            disabled
          />
          <Input
            label="Covenant/Non Covenant"
            placeholder="Input Covenant Type"
            type="dropdown"
            dropdownList={[
              {
                label: 'Covenant',
                value: true,
              },
              {
                label: 'Non Covenant',
                value: false,
              },
            ]}
            containerSx={{ flex: 1, pointerEvents: 'none' }}
            value={isCovenant}
            onChange={(e) => setIsCovenant(e.target.value)}
            disabled
          />
        </Box>
        <Input
          label="Perihal"
          placeholder="Perihal"
          type="area"
          containerSx={{ flex: 1 }}
          value={perihal}
          onChange={(e) => setPerihal(e.target.value)}
          rows={4}
          disabled
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            label="Aging"
            placeholder="Aging"
            type="number"
            containerSx={{ flex: 1 }}
            value={aging}
            onChange={(e) => setAging(e.target.value)}
            disabled
          />
          <Input
            label="Due Date"
            placeholder="Due Date"
            type="date"
            containerSx={{ flex: 1, pointerEvents: 'none' }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled
          />
        </Box>

        <RowWrapper justifyContent="end" gap={2}>
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isMandatoryEmpty || isSaveLoading}
            isLoading={isSaveLoading}
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalUploadDocumentElo;
