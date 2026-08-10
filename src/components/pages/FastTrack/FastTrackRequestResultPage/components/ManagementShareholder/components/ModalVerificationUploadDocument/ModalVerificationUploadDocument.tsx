import React, { useMemo } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';

import { toCurrentDate, toDateStringNumber } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TableDocumentCreditCheckingResult from '@/components/shared/SmiTable/TableDocumentCreditCheckingResult';

import { modal } from '../../ManagementShareholder.constants';

import { documentCategoryDropdownList } from './ModalVerificationUploadDocument.contants';
import useModalVerificationUploadDocument from './ModalVerificationUploadDocument.hook';

import type { ModalVerificationUploadDocumentProps } from './ModalVerificationUploadDocument.types';


const ModalVerificationUploadDocument = NiceModal.create((props: ModalVerificationUploadDocumentProps) => {
  const theme = useTheme();
  const { processId } = useParams();
  const [state] = useApp();
  const { validateFiles, acceptedFormatsText } = useCheckFileDokument();


  const modalId = modal.VERIFICATION_UPLOAD_DOCUMENT;
  const { visible } = useModal(modalId);

  const {
    ownerId,
    ownership,
    status,
    documentParent,
    process,
  } = props;

  const {
    documentGroupData,
    documentTypeData,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    debiturName,
  } = useModalVerificationUploadDocument(props);

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


  const docName = useMemo(() => {
    return `${documentType?.value?.label ?? '[Jenis Dokumen]'}_${debiturName}_${documentNumber?.value.length !== 0 ? documentNumber?.value : '[Dokumen Number]'}_${documentDate?.value ? dayjs(documentDate?.value).format('DDMMYYYY') : '[Tanggal Dokumen]'}`;
  }, [documentType, debiturName, documentNumber, documentDate]);

  return (
    <SectionModal
      title="Upload Dokumen"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '83vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        {/* <Box
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
        </Box> */}
        <Input
          isMandatory
          type="dropdown"
          label="Kategori Dokumen"
          placeholder="Kategori Dokumen"
          containerSx={{ flex: 1 }}
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
        />
        <Autocomplete
          isMandatory
          disabled={!documentCategory.value}
          isLoading={isFetchDocumentGroupLoading}
          label="Group Dokumen"
          placeholder="Group Dokumen"
          dropdownList={documentGroupData}
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
        />
        <Autocomplete
          isMandatory
          disabled={!documentGroup.value}
          isLoading={isFetchDocumentTypeLoading}
          label="Jenis Dokumen"
          placeholder="Jenis Dokumen"
          dropdownList={documentTypeData}
          value={documentType.value}
          onChange={(val) => { masintonChange('documentType', val); }}
          onInputChange={setKeyworDocumentType}
          error={documentType.error}
          helperText={documentType.error && documentType.errorMessage}
        />
        <Input
          showTooltip={true}
          tooltipText="Dapat upload file lebih dari 1."
          isMandatory
          type="file2"
          label="Upload Dokumen"
          placeholder="Upload Dokumen"
          containerSx={{ flex: 1 }}
          value={document.value}
          onChange={(val) => {


            const files = Array.isArray(val) ? val : [];
            const nativeFiles = files.map((fileItem) => fileItem.file);

            const result = validateFiles(nativeFiles);

            if (!result.isValid) {
              masintonMultiChange({
                document: { error: true, errorMessage: result.errorMessage },
                documentName: null,
              });
              return;
            }
            masintonMultiChange({
              document: files,
              documentName: files.map((f) => f.name).join(', '),
            });
          }}
          error={document.value?.error || document.error}
          helperText={
            (document.value?.error && document.value?.errorMessage) ||
            (document.error && document.errorMessage) ||
            `Supported formats: ${acceptedFormatsText}`
          }
        />
        {/* <Input
          isMandatory
          type="file2"
          label="Upload Dokumen"
          placeholder="Upload Dokumen"
          containerSx={{ flex: 1 }}
          value={document.value}
          onChange={(val) => {
            masintonMultiChange({
              document: val,
              documentName: val.name,
            });
          }}
          error={document.error}
          helperText={document.error && document.errorMessage}
        /> */}
        {/* <Input
          isMandatory
          disabled
          label="Nama Dokumen"
          placeholder="Input Nama Dokumen"
          containerSx={{ flex: 1 }}
          value={docName}
          error={documentName.error}
          helperText={documentName.error && documentName.errorMessage}
        /> */}
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
            onChange={(val) => { masintonChange('documentNumber', val); }}
            error={documentNumber.error}
            helperText={documentNumber.error && documentNumber.errorMessage}
          />
          <Input
            isMandatory
            type="date"
            label="Tanggal Dokumen"
            placeholder="Input Tanggal Dokumen"
            containerSx={{ flex: 1 }}
            value={documentDate.value}
            onChange={(val) => { masintonChange('documentDate', val.toISOString()); }}
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
            Close
          </Button>
          <Button
            disabled={isMandatoryEmpty}
            isLoading={isSaveLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </RowWrapper>

        <TableDocumentCreditCheckingResult
          processId={String(processId)}
          ownership={ownership}
          ownerId={String(ownerId)}
          status={status}
          process={process}
          documentParent={documentParent as any}
        />

      </ColumnWrapper>
    </SectionModal >
  );
});

export default ModalVerificationUploadDocument;
