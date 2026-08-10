import React, { useMemo, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

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

import { documentCategoryDropdownList, fileType, modal } from './ModalUploadDocument.constantsV2';
import useModalUploadDocument from './ModalUploadDocument.hookV2';

import type { ModalUploadDocumentProps } from './ModalUploadDocument.typesV2';
import type { AutocompleteOption } from '../../Autocomplete/types';


const ModalUploadDocumentV2 = NiceModal.create((props: ModalUploadDocumentProps) => {
  const modalId = modal.MODAL_UPLOAD_DOCUMENT;
  const { visible } = useModal(modalId);
  const theme = useTheme();
  const [state] = useApp();
  const today = dayjs().toString();
  const [fileError, setFileError] = useState('');
  const acceptTypes: string[] = [
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
    'application/x-compressed',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
  ];

  const { validateFile, acceptedFormatsText } = useCheckFileDokument({ acceptableMimeTypes: acceptTypes });

  const {
    isViewAllDocument,
    debiturName,
    documentGroupData,
    documentTypeData,
    handleSave,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    isSaveLoading,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    generateTitle,
    documentDetailData,
    documentGroup,
    documentType,
    documentCategory,
    document,
    documentNumber,
    documentDate,
    control,
    setValue,
    isValid,
  } = useModalUploadDocument(props);

  const docoumentName = useMemo(() => {
    return `${documentType?.label ?? '[Jenis Dokumen]'}_${debiturName}_${documentNumber?.length !== 0 ? documentNumber : '[Dokumen Number]'}_${documentDate ? dayjs(documentDate).format('DDMMYYYY') : '[Tanggal Dokumen]'}`;
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
            containerSx={{ flex: 1 }}
            value={uploadedDate}
            disabled
          />
        </Box>
        <Controller
          control={control}
          name="documentCategory"
          render={({ field: { value, onChange, ...field }, fieldState: { invalid, error } }) => (
            <Autocomplete
              {...field}
              isMandatory
              label="Kategori Dokumen"
              placeholder="Kategori Dokumen"
              dropdownList={documentCategoryDropdownList}
              disabled={isViewAllDocument}
              value={value as AutocompleteOption}
              onChange={(val) => {
                onChange(val);
                setValue('documentGroup', { id: '', label: '' });
                setValue('documentType', { id: '', label: '' });
              }}
              error={invalid}
            />
          )}
        />
        <Controller
          control={control}
          name="documentGroup"
          render={({ field: { value, onChange, ...field }, fieldState: { invalid, error } }) => (
            <Autocomplete
              {...field}
              isMandatory
              disabled={!documentCategory?.id}
              isLoading={isFetchDocumentGroupLoading}
              label="Group Dokumen"
              placeholder="Group Dokumen"
              dropdownList={documentGroupData}
              value={value as AutocompleteOption}
              onChange={(val) => {
                onChange(val);
                setValue('documentType', { id: '', label: '' });
              }}
              onInputChange={setKeyworDocumentGroup}
              error={invalid}
            />
          )}
        />
        <Controller
          control={control}
          name="documentType"
          render={({ field: { value, onChange, ...field }, fieldState: { invalid, error } }) => (
            <Autocomplete
              {...field}
              isMandatory
              disabled={!documentGroup?.id}
              isLoading={isFetchDocumentTypeLoading}
              label="Jenis Dokumen"
              placeholder="Jenis Dokumen"
              dropdownList={documentTypeData}
              value={value as AutocompleteOption}
              onChange={(val) => { onChange(val); }}
              onInputChange={setKeyworDocumentType}
              error={invalid}
            />
          )}
        />
        <Controller
          control={control}
          name="document"
          render={({ field: { value, onChange, ...field }, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              isMandatory
              type="file"
              label="Upload Dokumen"
              placeholder="Upload Dokumen"
              containerSx={{ flex: 1 }}
              value={document}
              fileConstraint={fileType.FILE_CONSTRAINT}
              onChange={(val) => {
                const result = validateFile(val);
                if (!result.isValid) {
                  setFileError(result.errorMessage);
                  setValue('document', null);
                  setValue('documentName', null);
                  return;
                }
                setFileError('');
                onChange(val);
                setValue('documentName', val.name);
              }}
              error={invalid || !!fileError}
              helperText={fileError || `Supported formats: ${acceptedFormatsText}`}
            />
          )}
        />
        <Controller
          control={control}
          name="documentName"
          render={({ field: { value, ...field }, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              isMandatory
              disabled
              label="Nama Dokumen"
              placeholder="Input Nama Dokumen"
              containerSx={{ flex: 1 }}
              value={docoumentName}
              error={invalid}
            />
          )}
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',

          }}
        >
          <Controller
            control={control}
            name="documentNumber"
            render={({ field: { value, onChange, ...field }, fieldState: { invalid, error } }) => (
              <Input
                label="Nomor Dokumen"
                isMandatory
                placeholder="Input Nomor Dokumen"
                containerSx={{ flex: 1 }}

                value={value}
                onChange={(val) => { onChange(val); }}
                error={invalid}
              />
            )}
          />
          <Controller
            control={control}
            name="documentDate"
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                type="date"
                isMandatory
                label="Tanggal Dokumen"
                placeholder="Input Tanggal Dokumen"
                containerSx={{ flex: 1 }}
                error={invalid}
                maxDate={today}
              />
            )}
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
            disabled={!isValid}
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

export default ModalUploadDocumentV2;
