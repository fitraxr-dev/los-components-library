import { useEffect, useState } from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { formatDate } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../TableDraftMemoHistory.constants';

import { HISTORY_DRAFT_MEMO_INITIAL_VALUES, HISTORY_DRAFT_MEMO_MODAL_SCHEMA } from './ModalDraftMemoHistory.constants';
import { useModalDraftMemoHistory } from './ModalDraftMemoHistory.hook';


const ModalDraftMemoHistory = create((props: any) => {
  const [state] = useApp();
  const theme = useTheme();
  const modalId = modal.HISTORY_DRAFT_MEMO;
  const { visible } = useModal(modalId);
  const { title = 'Add New Draft Memo' } = props;
  const username = state.userData?.user.fullName;
  const today = formatDate(new Date(), 'DD MMMM YYYY');
  const [fileError, setFileError] = useState('');
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

  const { handleOnSave, saveHistoryDraftLoading } = useModalDraftMemoHistory(props);

  const { control, handleSubmit, watch, setValue, formState } = useForm({
    defaultValues: {
      document: {
        extension: '',
        name: '',
        url: '',
      },
      documentDate: undefined,
      documentName: '',
      uploadBy: '',
      uploadDate: '',
    },
    mode: 'onChange',
    resolver: yupResolver(HISTORY_DRAFT_MEMO_MODAL_SCHEMA),
  });

  // const isMandatoryEmpty = !watch('document.name') || !watch('documentName') || !watch('documentDate');

  useEffect(() => {
    setValue('uploadBy', username);
    setValue('uploadDate', today);
  }, []);

  useEffect(() => {
    if (watch('document') && !watch('documentName')) {
      setValue('documentName', watch('document.name'));
    } else if (watch('document') && watch('document.name') !== watch('documentName')) {
      setValue('documentName', watch('documentName'));
    }

  }, [watch('document')]);

  //trigger valid
  console.log('valid', formState.isValid);

  return (
    <SectionModal
      title={title}
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
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error, isTouched },
            }) => (
              <Input
                {...field}
                inputRef={ref}
                disabled
                label="Upload By"
                placeholder="Upload by"
                containerSx={{ flex: 1 }}
                error={isTouched && invalid}
                helperText={isTouched && error ? error.message : ''}
              />
            )}
          />

          <Controller
            control={control}
            name="uploadDate"
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error, isTouched },
            }) => (
              <Input
                {...field}
                inputRef={ref}
                disabled
                type="text"
                label="Upload Date"
                placeholder="Upload Date"
                containerSx={{ flex: 1 }}
                error={isTouched && invalid}
                helperText={isTouched && error ? error.message : ''}
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
            render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
              <Input
                {...field}
                inputRef={ref}
                type="file"
                label="Upload Dokumen"
                placeholder="Upload Dokumen"
                containerSx={{ flex: 1 }}
                onChange={(val) => {
                  const result = validateFile(val);
                  if (!result.isValid) {
                    setFileError(result.errorMessage);
                    setValue('document', null);
                    setValue('documentName', null);
                    return;
                  }

                  setFileError('');
                  field.onChange(val);
                  setValue('documentName', val.name);
                }}
                error={isTouched && invalid || !!fileError}
                helperText={fileError || (isTouched && error ? error.message : '') || `Supported formats: ${acceptedFormatsText}`}
                disabled={saveHistoryDraftLoading}
                isMandatory
              />
            )}
          />
          <Controller
            control={control}
            name="documentName"
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error, isTouched },
            }) => (
              <Input
                {...field}
                inputRef={ref}
                label="Nama Dokumen"
                placeholder="Input Nama Dokumen"
                containerSx={{ flex: 1 }}
                error={isTouched && invalid}
                helperText={isTouched && error ? error.message : ''}
                disabled={!watch('document.name') || saveHistoryDraftLoading}
                isMandatory
              />
            )}
          />
          <Controller
            control={control}
            name="documentDate"
            render={({
              field: { ref, ...field },
              fieldState: { invalid, error, isTouched },
            }) => (
              <Input
                {...field}
                inputRef={ref}
                type="date"
                label="Tanggal Dokumen"
                isMandatory
                maxDate={today}
                InputProps={{ placeholder: 'Input Tanggal Dokumen' }}
                format="DD MMMM YYYY"
                containerSx={{ flex: 1 }}
                error={isTouched && invalid}
                helperText={isTouched && error ? error.message : ''}
                disabled={!watch('documentName') || saveHistoryDraftLoading}
              />
            )}
          />
        </Box>
      </RowWrapper>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button
          isLoading={saveHistoryDraftLoading}
          onClick={(handleSubmit(handleOnSave))}
          disabled={!formState.isValid || !watch('document.name')}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalDraftMemoHistory;
