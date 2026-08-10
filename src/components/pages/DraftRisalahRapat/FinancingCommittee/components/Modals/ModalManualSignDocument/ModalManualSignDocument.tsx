import * as React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { formatDate } from '@/helpers/date';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import {
  addManualSignDocumentInitialValues,
  addManualDocumentSignModalSchema,
  PDF_MIME,
} from './ModalManualSignDocument.constants';
import useModalManualSignDocument from './ModalManualSignDocument.hook';


interface ModalManualSignDocumentProps {
  documentId: number;
  documentDate?: string;
  documentName?: string;
  documentNumber?: string;
  fileName?: string;
}

const ModalManualSignDocument = NiceModal.create((props: ModalManualSignDocumentProps) => {
  const { documentId, documentDate, documentName, documentNumber, fileName } = props; const theme = useTheme();
  const { userData } = useIdentity();
  const username = userData?.user?.fullName ?? '';
  const today = React.useMemo(() => formatDate(new Date(), 'DD MMMM YYYY'), []);

  const modalId = MODAL.RISALAH_RAPAT.MANUAL_SIGN_DOCUMENT;
  const { visible } = useModal(modalId);

  const { handleOnSave, isSignDocumentLoading } = useModalManualSignDocument({ documentId, fileName });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    getValues,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      ...addManualSignDocumentInitialValues,
      documentDate: documentDate ?? '',
      documentName: documentName ?? '',
      documentNumber: documentNumber ?? '',
      uploadBy: '',
      uploadDate: '',
    },
    mode: 'onChange',
    resolver: yupResolver(addManualDocumentSignModalSchema),
  });

  // const [document, documentName] = useWatch({
  //   control,
  //   name: ['document', 'documentName'],
  // });

  React.useEffect(() => {
    if (!visible) return;

    const curr = getValues();
    const nextUploadBy = username;
    const nextUploadDate = today;
    const nextDocumentDate = documentDate ?? '';
    const nextDocumentName = documentName ?? '';
    const nextDocumentNumber = documentNumber ?? '';

    if (
      curr.uploadBy !== nextUploadBy ||
      curr.uploadDate !== nextUploadDate ||
      curr.documentDate !== nextDocumentDate ||
      curr.documentName !== nextDocumentName ||
      curr.documentNumber !== nextDocumentNumber
    ) {
      reset(
        {
          ...curr,
          documentDate: nextDocumentDate,
          documentName: nextDocumentName,
          documentNumber: nextDocumentNumber,
          uploadBy: nextUploadBy,
          uploadDate: nextUploadDate,
        },
        { keepDirty: true, keepTouched: true }
      );
    }
  }, [visible, username, today, documentDate, documentName, documentNumber, getValues]);

  const handleFileChange = React.useCallback(
    (val: any | null) => {
      if (!val || !val.file) {
        setValue('document', null, { shouldValidate: true });
        setValue('documentName', '', { shouldValidate: true });
        return;
      }

      const { file, name } = val;

      if (file.type !== PDF_MIME) {
        setError('document', {
          message: 'Format file tidak didukung. Hanya file PDF yang diperbolehkan',
          type: 'manual',
        });
        setValue('document', null, { shouldValidate: true });
        setValue('documentName', '', { shouldValidate: true });
        return;
      }

      // if (file.size > MAX_DOC_SIZE_BYTES) {
      //   setError('document', {
      //     message: 'Ukuran file terlalu besar',
      //     type: 'manual',
      //   });
      //   setValue('document', null, { shouldValidate: true });
      //   setValue('documentName', '', { shouldValidate: true });
      //   return;
      // }

      clearErrors('document');
      setValue('document', val, { shouldValidate: true });
      setValue('documentName', name ?? '', { shouldValidate: true });
    },
    [setValue, setError, clearErrors]
  );

  return (
    <SectionModal
      title="Upload Dokumen Risalah Rapat yang Sudah Ditandatangani"
      containerSx={{ minWidth: '52vw' }}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
    >
      <RowWrapper
        sx={{
          flexDirection: 'column',
          rowGap: theme.spacing(3),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            control={control}
            name="uploadBy"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                disabled
                label="Upload By"
                placeholder="Upload by"
                containerSx={{ flex: 1 }}
                error={fieldState.isTouched && fieldState.invalid}
                helperText={fieldState.isTouched && fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />

          <Controller
            control={control}
            name="uploadDate"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                disabled
                type="text"
                label="Upload Date"
                placeholder="Upload Date"
                containerSx={{ flex: 1 }}
                error={fieldState.isTouched && fieldState.invalid}
                helperText={fieldState.isTouched && fieldState.error ? fieldState.error.message : ''}
              />
            )}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3),
          }}
        >
          <Controller
            control={control}
            name="document"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="file"
                label="Upload Dokumen"
                placeholder="Upload Dokumen"
                containerSx={{ flex: 1 }}
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message || 'Hanya file PDF yang diperbolehkan'
                }
                fileConstraint={PDF_MIME}
                disabled={isSignDocumentLoading}
                isMandatory
                onChange={handleFileChange}
              />
            )}
          />

          <Controller
            control={control}
            name="documentName"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Nama Dokumen"
                placeholder="Input Nama Dokumen"
                containerSx={{ flex: 1 }}
                error={fieldState.isTouched && fieldState.invalid}
                helperText={fieldState.isTouched && fieldState.error ? fieldState.error.message : ''}
                disabled
                isMandatory
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
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  isMandatory
                  onChange={(values: string) => field.onChange(values)}
                  label="Nomor Dokumen"
                  InputProps={{ placeholder: 'Input Nomor Dokumen' }}
                  containerSx={{ flex: 1 }}
                  error={fieldState.isTouched && fieldState.invalid}
                  regex={/^[^\s][\w\d.,()_\s\-@\/]*$/}
                  helperText={fieldState.isTouched && fieldState.error ? fieldState.error.message : ''}
                  disabled
                />
              )}
            />

            <Controller
              control={control}
              name="documentDate"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  isMandatory
                  type="date"
                  label="Tanggal Dokumen"
                  disableFutureDates
                  InputProps={{ placeholder: 'Input Tanggal Dokumen' }}
                  containerSx={{ flex: 1 }}
                  error={fieldState.isTouched && fieldState.invalid}
                  helperText={fieldState.isTouched && fieldState.error ? fieldState.error.message : ''}
                  disabled
                />
              )}
            />
          </Box>
        </Box>
      </RowWrapper>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button
          isLoading={isSignDocumentLoading}
          onClick={handleSubmit(handleOnSave)}
          disabled={!isValid}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalManualSignDocument;
