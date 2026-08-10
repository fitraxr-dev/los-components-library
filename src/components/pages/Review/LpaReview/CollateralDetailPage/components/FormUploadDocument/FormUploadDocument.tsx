import React, { useState } from 'react';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { toCurrentDate, toDateStringNumber } from '@/helpers/date';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';

import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';


import { documentCategoryDropdownList } from './FormUploadDocument.constants';
import useFormUploadDocument from './FormUploadDocument.hook';


export const FormUploadDocument = () => {
  const {
    documentGroupData,
    documentTypeData,
    fullName,
    isFetchDocumentGroupLoading,
    isFetchDocumentTypeLoading,
    setKeyworDocumentGroup,
    setKeyworDocumentType,
    theme,
    watch,
    setValue,
    formState,
    documentName,
    control,
  } = useFormUploadDocument();
  const [fileError, setFileError] = useState('');
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

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
          label="Upload Date"
          placeholder="Upload date"
          containerSx={{ flex: 1 }}
          value={toCurrentDate()}
          type="date"
          disabled
        />
        <Input
          label="Upload By"
          placeholder="Upload By"
          containerSx={{ flex: 1 }}
          value={fullName}
          disabled
        />
      </Box>
      <Controller
        name="documentCategory"
        control={control}
        render={({ field, formState }) =>
          <Input
            value={field.value}
            type="dropdown"
            label="Kategori Dokumen"
            placeholder="Kategori Dokumen"
            containerSx={{ flex: 1 }}
            dropdownList={documentCategoryDropdownList}
            error={!!formState.errors.documentCategory}
            helperText={formState.errors.documentCategory?.message?.toString()}
            onChange={(val) => {
              setValue('documentGroup', null);
              setValue('documentType', null);
              field.onChange(val);
            }}
          />
        }
      />

      <Controller
        name="documentGroup"
        control={control}
        render={({ field, formState }) =>
          <Autocomplete
            isLoading={isFetchDocumentGroupLoading}
            label="Group Dokumen"
            placeholder="Group Dokumen"
            dropdownList={documentGroupData}
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              setValue('documentType', null);
            }}
            onInputChange={setKeyworDocumentGroup}
            error={!!formState.errors.documentGroup}
            helperText={formState.errors.documentGroup?.message?.toString()}
            disabled={watch('readonly') === true || !watch('documentCategory')}
          />
        }
      />

      <Controller
        name="documentType"
        control={control}
        render={({ field }) =>
          <Autocomplete
            isLoading={isFetchDocumentTypeLoading}
            label="Jenis Dokumen"
            placeholder="Jenis Dokumen"
            dropdownList={documentTypeData}
            value={field.value}
            onChange={(val) => { field.onChange(val); }}
            onInputChange={setKeyworDocumentType}
            error={!!formState.errors.documentType}
            helperText={formState.errors.documentType?.message?.toString() || ''}
            disabled={watch('readonly') === true || !watch('documentGroup')?.id}
          />
        }
      />
      <Controller
        name="document"
        control={control}
        render={({ field }) =>
          <Input
            type="file"
            label="Upload Dokumen"
            placeholder="Upload Dokumen"
            containerSx={{ flex: 1 }}
            value={field.value}
            onChange={(val) => {
              const result = validateFile(val);
              if (!result.isValid) {
                setFileError(result.errorMessage);
                setValue('document', null);
                return;
              }
              setFileError('');
              field.onChange(val);
              setValue('documentName', val.name);
            }}
            error={!!fileError}
            helperText={fileError || `Supported formats: ${acceptedFormatsText}`}
            disabled={watch('readonly') === true}
          />
        }
      />


      <Input
        label="Nama Dokumen"
        placeholder="Input Nama Dokumen"
        containerSx={{ flex: 1 }}
        value={documentName}
        disabled
      />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          name="documentNumber"
          control={control}
          render={({ field }) =>
            <Input
              label="Nomor Dokumen"
              placeholder="Input Nomor Dokumen"
              containerSx={{ flex: 1 }}
              value={field.value}
              onChange={(val) => { field.onChange(val); }}
              error={!!formState.errors.documentNumber}
              helperText={formState.errors.documentNumber?.message?.toString()}
              disabled={watch('readonly') === true}

            />
          }
        />

        <Controller
          name="documentDate"
          control={control}
          render={({ field }) =>
            <Input
              type="date"
              label="Tanggal Dokumen"
              placeholder="Input Tanggal Dokumen"
              containerSx={{ flex: 1 }}
              value={field.value}
              onChange={(val) => { field.onChange(val); }}
              error={!!formState.errors.documentDate}
              helperText={formState.errors.documentDate ? formState.errors.documentDate.message?.toString() : ''}
              disabled={watch('readonly') === true}
            />
          }
        />
      </Box>
    </ColumnWrapper>
  );
};

export default FormUploadDocument;
