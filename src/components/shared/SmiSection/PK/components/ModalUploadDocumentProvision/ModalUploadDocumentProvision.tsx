import { useMemo } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import { toCurrentDate, toDateStringNumber } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';


import { MODALPK } from '../../PK.constants';

import useModalUploadDocumentPrivision from './ModalUploadDocumentProvision.hook';

import type { ModalUploadDocumentProps } from './ModalUploadDocumentProvision.types';


const ModalUploadDocumentProvision = NiceModal.create((props: ModalUploadDocumentProps) => {
  const theme = useTheme();
  const modal = useModal();
  const [state] = useApp();
  const { isDetailDisabled } = props;
  const { debiturName } = useIdentity();
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

  const modalId = MODALPK.MODAL_DOCUMENT_PROVISION;
  const {
    documentCategoryDropdownList,
    documentTypeDataList,
    documentGroupDataList,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    masintonChange,
    masintonForm,
    masintonMultiChange,
  } = useModalUploadDocumentPrivision(props);
  const {
    document,
    documentCategory,
    documentDate,
    documentGroup,
    documentName,
    documentNumber,
    documentType,
    description,
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
      title={props.title}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '50vw',
      }}
    >
      <ColumnWrapper display="flex" flexDirection="column" gap={3}>
        <Input
          placeholder="Deskripsi"
          label="Deskripsi"
          type="text"
          disabled={isDetailDisabled}
          value={description.value}
          onChange={(val) => {masintonChange('description', val);}}
          error={description.error}
          helperText={description.error && description.errorMessage}
        />
        <RowWrapper sx={{ borderBottom: '1px solid #ABABAB', justifyContent: 'center', py: 1 }}>
          <TextStyle variant="title1" color={theme.palette.primary.main}>
            Upload Dokumen
          </TextStyle>
        </RowWrapper>
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
            label="Kategori Dokumen"
            placeholder="Kategori Dokumen"
            disabled={isDetailDisabled}
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
            disabled={!documentCategory.value || isDetailDisabled}
            isLoading={isFetchDocumentGroupLoading}
            label="Group Dokumen"
            placeholder="Group Dokumen"
            dropdownList={documentGroupDataList}
            value={documentGroup.value}
            onChange={(val) => {masintonChange('documentGroup', val);}}
            error={documentGroup.error}
            helperText={documentGroup.error && documentGroup.errorMessage}
          />
          <Autocomplete
            isMandatory
            disabled={!documentGroup.value || isDetailDisabled}
            isLoading={isFetchDocumentTypeLoading}
            label="Jenis Dokumen"
            placeholder="Jenis Dokumen"
            dropdownList={documentTypeDataList}
            value={documentType.value}
            onChange={(val) => {masintonChange('documentType', val);}}
            error={documentType.error}
            helperText={documentType.error && documentType.errorMessage}
          />
          <Input
            disabled={isDetailDisabled}
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
                documentName: val?.name,
              });
            }}
            isDownloadable={!isDetailDisabled}
            error={document.value?.error || document.error}
            helperText={(document.value?.error && document.value?.errorMessage)
              || (document.error && document.errorMessage)
              || `Supported formats: ${acceptedFormatsText}`}
          />
          <Input
            disabled
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
              disabled={isDetailDisabled}
              label="Nomor Dokumen"
              placeholder="Input Nomor Dokumen"
              containerSx={{ flex: 1 }}

              value={documentNumber.value}
              onChange={(val) => { masintonChange('documentNumber', val); }}
              error={documentNumber.error}
              helperText={documentNumber.error && documentNumber.errorMessage}
            />
            <Input
              disabled={isDetailDisabled}
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
        </ColumnWrapper>
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end', mt: 3 }}>
        {!isDetailDisabled ?

          <>
            <Button
              variant="outlined"
              onClick={() => closeNiceModal(modalId)}
              sx={{ mr: 3 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              isLoading={isSaveLoading}
              disabled={isMandatoryEmpty}
              onClick={() => handleSave()}
            >
              Save
            </Button>
          </>
          :
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Close
          </Button>
        }

      </RowWrapper>
    </SectionModal >
  );
});

export default ModalUploadDocumentProvision;
