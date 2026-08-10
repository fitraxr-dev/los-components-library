import React, { useMemo } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';
import dayjs from 'dayjs';

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
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import Icon from '../../Icon';

import { documentCategoryDropdownList, modal, TABLE_HEADER_UPLOAD_DOCUMENT } from './ModalUploadDocument.constants';
import useModalUploadDocument from './ModalUploadDocument.hook';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.types';


const ModalUploadDocument = NiceModal.create((props: ModalUploadDocumentProps) => {
  const modalId = modal.MODAL_UPLOAD_DOCUMENT;
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
    documentList,
    isGetDocumentListLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeaderUploadDocument,
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
    !documentCategory.value ||
    !documentGroup.value ||
    !documentType.value ||
    !documentNumber.value ||
    !documentDate.value ||
    !documentName.value ||
    !Array.isArray(document.value) || // Pindahkan pemeriksaan ini ke akhir
    document.value.length === 0;

  const docoumentName = useMemo(() => {
    return `${documentType?.value?.label ?? '[Jenis Dokumen]'}_${debiturName}_${documentNumber?.value.length !== 0 ? documentNumber?.value : '[Dokumen Number]'}_${documentDate?.value ? dayjs(documentDate?.value).format('DDMMYYYY') : '[Tanggal Dokumen]'}`;
  }, [documentType, debiturName, documentNumber, documentDate]);

  const uploadedBy = documentDetailData?.modifiedBy ?? state?.userData?.user?.fullName;
  const uploadedDate = !!documentDetailData?.modifiedDate ?
    toDateStringNumber(documentDetailData.modifiedDate) :
    toDateStringNumber(toCurrentDate());

  return (
    <SectionModal
      title={generateTitle(+props.id)}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Autocomplete
          isMandatory
          label="Kategori Dokumen"
          placeholder="Kategori Dokumen"
          dropdownList={documentCategoryDropdownList}
          disabled={isViewAllDocument}
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
            const result = validateFile(val);
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
            (document.error && document.errorMessage)
            || `Supported formats: ${acceptedFormatsText}`}

        />
        {/* <Input
          isMandatory
          disabled
          label="Nama Dokumen"
          placeholder="Input Nama Dokumen"
          containerSx={{ flex: 1 }}
          value={docoumentName}
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
            showTooltip={true}
            tooltipText="Setiap file yang diunggah akan mendapat nomor unik."
            label="Nomor Dokumen"
            isMandatory
            placeholder="Input Nomor Dokumen"
            containerSx={{ flex: 1 }}

            value={documentNumber.value}
            onChange={(val) => { masintonChange('documentNumber', val); }}
            error={documentNumber.error}
            helperText={documentNumber.error && documentNumber.errorMessage}
          />
          <Input
            type="date"
            isMandatory
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
        <Table
          isLoading={isGetDocumentListLoading}
          tableData={documentList?.contents}
          tableHeader={tableHeaderUploadDocument}
          currentPage={noPage}
          totalPage={documentList?.page?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        />
      </ColumnWrapper>
    </SectionModal >
  );
});

export default ModalUploadDocument;
