import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useModalDebtor from './ModalDebtor.hook';


const ModalDebtor = NiceModal.create(({ id, module, tableType }: PopupDebtorProps) => {
  const {
    collectibilityOptions,
    institutiontypeData,
    isSaveLoading,
    modalId,
    theme,
    modal,
    handleSubmit,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
    handleOnSubmit,
    formState,
    control,
  } = useModalDebtor(id, module);


  const isEdit = id !== null;

  return (
    <SectionModal
      title={isEdit ? 'Edit Customer' : 'Add New Customer'}
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
          render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              ref={ref}
              isMandatory={!module?.includes('CREDIT_CHECKING')}
              type="text"
              label="Nama"
              placeholder="Input Nama"
              error={!!error}
              helperText={invalid && error?.message}
              containerSx={module?.includes('CREDIT_CHECKING') ? { flex: 1 } : { flex: 1, gridColumn: 'span 2' }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />

        {module?.includes('CREDIT_CHECKING') ?
          <Controller
            name="type"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                isMandatory={!module?.includes('CREDIT_CHECKING')}
                type="dropdown"
                label="Tipe"
                error={!!error}
                helperText={invalid && error?.message}
                placeholder="Input Tipe"
                containerSx={{ flex: 1 }}
                dropdownList={institutiontypeData}
                disabled={module?.includes('CREDIT_CHECKING')}
              />
            )}
          />
          : null
        }
        <Controller
          name="npwp"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              ref={ref}
              type="npwp"
              label="NPWP"
              placeholder="Input NPWP"
              maxLength={16}
              error={!!error}
              helperText={invalid && error?.message}
              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="npwpFile"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              ref={ref}
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
      </Box>
      <TextStyle
        variant="body4"
        weight={600}
        color={theme.palette.primary.main}
      >
        Document Credit Checking Result
      </TextStyle>

      {tableType === 'SUMMARY' ?
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
              render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
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
              render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="area"
                  label="Hasil Laporan"
                  placeholder="Input hasil laporan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  rows={2}
                  isMandatory
                />
              )}
            />
            <Controller
              name="note"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="area"
                  label="Catatan"
                  placeholder="Input Catatan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  rows={2}
                  isMandatory
                />
              )}
            />

            <Controller
              name="googleResult"
              control={control}
              render={({ field: { ref, ...field }, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  ref={ref}
                  type="area"
                  label="Google Search"
                  placeholder="Input Catatan"
                  error={!!error}
                  helperText={invalid && error?.message}
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  rows={2}
                  isMandatory
                />
              )}
            />
          </Box>
        </> : null}

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


export default ModalDebtor;
