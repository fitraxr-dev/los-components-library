import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { toCurrentDate } from '@/helpers/date';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useModalShareholder from './ModalManagement.hook';


const ModalManagement = NiceModal.create(({ id, module, tableType }: PopupShareholderProps) => {
  const {
    handleSubmit,
    isSaveLoading,
    collectibilityOptions,
    jobPositionData,
    modal,
    modalId,
    theme,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
    formState,
    control,
    handleOnSubmit,
  } = useModalShareholder(id, module);

  const isEdit = id !== null;

  return (
    <SectionModal
      title={isEdit ? 'Edit Management' : 'Add New Management'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginBottom: theme.spacing(3),
        }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              label="Nama"
              placeholder="Input Nama"
              containerSx={{ flex: 1 }}
              error={!!error}
              helperText={invalid && error?.message}
              disabled={module?.includes('CREDIT_CHECKING')}
              isMandatory={!module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="jobPosition"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              label="Jabatan"
              type="dropdown"
              placeholder="Select Jabatan"
              dropdownList={jobPositionData}
              error={!!error}
              helperText={invalid && error?.message}
              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="npwp"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="number"
              noDecimal

              label="NPWP"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Input NPWP"
              maxLength={16}
              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="npwpFile"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="file"
              label="Upload NPWP"
              placeholder="Upload NPWP"
              error={!!error}
              helperText={invalid && error?.message}
              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="nik"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="number"
              label="NIK"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Input NIK"

              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="nikFile"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="file"
              label="Upload NIK"
              error={!!error}
              helperText={invalid && error?.message}
              placeholder="Upload NIK"
              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="dob"
          control={control}
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              type="date"
              label="DOB"
              error={!!error}
              helperText={invalid && error?.message}
              maxDate={toCurrentDate().toISOString()}
              containerSx={{ flex: 1 }}
              popper={
                { placement: 'top-start' }
              }
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
      </Box>

      <TextStyle
        variant="body4"
        weight={600}
        color={theme.palette.primary.main}
      >
        Document Credit Checking Result
      </TextStyle>

      {tableType === 'SUMMARY' &&
        <>
          <Box sx={{ height: '100%', marginBottom: theme.spacing(3) }}>
            <ModalTable
              data={documentContents}
              page={documentPage}
              setItemPerPage={setItemPerPage}
              setNoPage={setNoPage}
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="collectability"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  type="dropdown"
                  dropdownList={collectibilityOptions}
                  label="Kolektibilitas"
                  placeholder="Input Kolektibilitas"
                  error={!!error}
                  helperText={invalid && error?.message}
                  isMandatory
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                />
              )}
            />
            <Controller
              name="resultReporting"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  type="area"
                  label="Hasil Laporan"
                  placeholder="Input hasil laporan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  isMandatory
                  rows={2}
                />
              )}
            />
            <Controller
              name="note"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  type="area"
                  label="Catatan"
                  placeholder="Input Catatan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  isMandatory
                  rows={2}
                />
              )}
            />
            <Controller
              name="googleResult"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  type="area"
                  label="Google Search"
                  placeholder="Input Catatan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  isMandatory
                  rows={2}
                />

              )}
            />
          </Box>
        </>
      }

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleOnSubmit)}
          isLoading={isSaveLoading}
          disabled={isSaveLoading || !formState.isValid || !formState.isDirty}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal >
  );
});


export default ModalManagement;
