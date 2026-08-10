import { useState } from 'react';

import { create } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { dayJsJakartaKeep } from '@/helpers/date';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import InputDebtorName from '@/components/shared/Input/components/InputDebtorName';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useModalManagementExisting from './ModalManagementExisting.hook';

import type { ModalManagementExistingProps } from './ModalManagementExisting.type';


const ModalManagementExisting = create((props: ModalManagementExistingProps) => {

  const {
    isAutoSaveFetching,
    isSaveLoading,
    handleSubmit,
    mutateManagement,
    theme,
    setValue,
    modalId,
    formState,
    control,
    idDocTypeData,
    jobPositionData,
    modal } = useModalManagementExisting(props);

  const { validateFile, acceptedFormatsText } = useCheckFileDokument();
  const [npwpFileError, setNpwpFileError] = useState<string>('');
  const [idFileError, setIdFileError] = useState<string>('');

  return (
    <SectionModal
      title={props.id ? 'Edit Management' : 'Add Management'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        '-ms-overflow-style': 'none',
        minWidth: '52vw',
        'scrollbar-width': 'none',
      }}
    >
      <Box
        sx={{
          '& > *': { minWidth: 0 },
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        <Controller
          name="name"
          control={control}
          render={({ formState }) =>
            <InputDebtorName
              control={control}
              label="Name"
              name="name"
              placeholder="Masukkan Nama"
              inputProps={{}}
              bg="white"
              isMandatory
              type="text"
              error={!!formState.errors.name}
              helperText={formState.errors.name?.message || null}
              contentTooltip={formState.errors.name ? null : (
                <Box sx={{ width: '100%' }}>
                  <ul style={{ paddingInline: '40px' }}>
                    {[
                      'Nama lengkap tanpa singkatan',
                      'Huruf kapital hanya di awal nama setiap kata',
                      'Tanpa gelar depan dan belakang untuk persorangan'
                    ].map((dt) => (
                      <li key={dt}>
                        <TextStyle variant="body5" >
                          {dt}
                        </TextStyle>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              suppressTooltipWhenError
            />
          }
        />

        <Controller
          name="position"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              dropdownList={jobPositionData}
              label="Jabatan"
              placeholder="Masukkan Jabatan"
              type="dropdown"
            />
          }
        />

        <Controller
          name="npwp"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) =>
            <Input
              {...field}
              ref={ref}
              label="NPWP"
              placeholder="Masukkan NPWP"
              type="npwp"
              maxLength={16}
              error={!!error}
              helperText={error?.message}
            />
          }
        />

        <Controller
          name="npwpFile"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Upload NPWP"
              placeholder="Upload NPWP"
              type="file"
              onChange={(val) => {
                const result = validateFile(val);
                if (!result.isValid) {
                  setNpwpFileError(result.errorMessage);
                  setValue('npwpFile', null);
                  return;
                }
                setNpwpFileError('');
                field.onChange(val);
              }}
              error={!!npwpFileError}
              helperText={npwpFileError
                || `Supported formats: ${acceptedFormatsText}`}
            />
          }
        />

        <Controller
          name="identityTypeKey"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              dropdownList={idDocTypeData}
              label="ID Type"
              placeholder="Pilih ID Type"
              type="dropdown"
            />
          }
        />

        <Controller
          name="identityDocNumber"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) =>
            <Input
              {...field}
              ref={ref}
              label="ID No."
              placeholder="Masukkan ID No."
              maxLength={20}
              type="text"
              error={!!error}
              helperText={error?.message}
            />
          }
        />

        <Controller
          name="identityDocFile"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Upload ID"
              placeholder="Upload ID"
              type="file"
              onChange={(val) => {
                const result = validateFile(val);
                if (!result.isValid) {
                  setIdFileError(result.errorMessage);
                  setValue('identityDocFile', null);
                  return;
                }
                setIdFileError('');
                field.onChange(val);
              }}
              error={!!idFileError}
              helperText={idFileError
                || `Supported formats: ${acceptedFormatsText}`}
            />
          }
        />

        <Controller
          name="dob"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="DOB"
              placeholder="Masukkan DOB"
              type="date"
              // maxDate={toCurrentDate().toISOString()}
              onChange={(val) => field.onChange(dayJsJakartaKeep(val))}
              containerSx={{ flex: 1 }}
              popper={
                { placement: 'top-start' }
              }
            />
          }
        />
      </Box>

      <RowWrapper
        gap={theme.spacing(3)}
        paddingTop={theme.spacing(3)}
        justifyContent="end"
      >
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          disabled={!formState.isValid || isAutoSaveFetching}
          isLoading={isSaveLoading}
          onClick={handleSubmit(mutateManagement)}
        >
          {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalManagementExisting;
