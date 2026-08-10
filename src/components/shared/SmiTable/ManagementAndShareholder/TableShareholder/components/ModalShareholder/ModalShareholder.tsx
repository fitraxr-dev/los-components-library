import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTable from '@/components/shared/SmiModal/ModalTable';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import useModalShareholder from './ModalShareholder.hook';


const PopupShareholder = NiceModal.create(({ id, module, tableType }: PopupShareholderProps) => {
  const {
    institutiontypeData,
    isSaveLoading,
    modal,
    modalId,
    nominal,
    collectibilityOptions,
    theme,
    handleSubmit,
    handleOnSubmit,
    handleCloseModalWarning,
    documentContents,
    documentPage,
    setItemPerPage,
    setNoPage,
    isLoadingJob,
    jobPositionList,
    control,
    formState,
    setValue,
    watch,
  } = useModalShareholder(id, module);

  const {
    type,
  } = watch();

  const isEdit = id !== null;
  const isIndividualType = type === 'INDIVIDUAL';
  const isOthersType = type === 'OTHERS';

  return (
    <SectionModal
      title={isEdit ? 'Edit Shareholder' : 'Add New Shareholder'}
      isOpen={modal.visible}
      onClose={handleCloseModalWarning}
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
          name="type"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              isMandatory={!module?.includes('CREDIT_CHECKING')}
              type="dropdown"
              label="Tipe"
              error={!!error}
              helperText={error && error?.message}
              placeholder="Input Tipe"
              containerSx={{ flex: 1 }}
              dropdownList={institutiontypeData}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              isMandatory={!module?.includes('CREDIT_CHECKING')}
              type="text"
              label="Nama"
              placeholder="Input Nama"
              error={!!error}
              helperText={error && error?.message}
              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />

        {
          isIndividualType && (
            <>
              <Controller
                name="position"
                control={control}
                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field}
                    id="Jabatan"
                    testId="Jabatan"
                    disabled={module?.includes('CREDIT_CHECKING')}
                    label="Jabatan"
                    value={{
                      id: value.id,
                      label: value.label,
                    }}
                    placeholder="Choose Jabatan"
                    dropdownList={jobPositionList}
                    onChange={(val) => onChange(val)}
                    isLoading={isLoadingJob}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <div />
              <Controller
                name="nik"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    type="number"
                    label="NIK"
                    error={!!error}
                    helperText={error?.message}
                    placeholder="Input NIK"

                    containerSx={{ flex: 1 }}
                    disabled={module?.includes('CREDIT_CHECKING')}
                  />
                )}
              />
              <Controller
                name="uploadNik"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    type="file"
                    label="Upload NIK"
                    placeholder="Upload NIK"
                    containerSx={{ flex: 1 }}
                    error={!!error}
                    helperText={error?.message}
                    disabled={module?.includes('CREDIT_CHECKING')}
                  />
                )}
              />
            </>
          )
        }
        {
          isOthersType && (
            <>
              <Controller
                name="ownershipType"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    {...field}
                    isMandatory
                    type="text"
                    label="Tipe Kepemilikan"
                    placeholder="Keterangan"
                    error={!!error}
                    helperText={invalid && error?.message}
                    containerSx={{ flex: 1 }}
                    disabled={module?.includes('CREDIT_CHECKING')}
                  />
                )}
              />
              <div />
            </>
          )
        }

        <Controller
          name="npwp"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="npwp"
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
          name="uploadNpwp"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="file"
              label="Upload NPWP"
              placeholder="Upload NPWP"
              containerSx={{ flex: 1 }}
              error={!!error}
              helperText={invalid && error?.message}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <Controller
          name="shares"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="number"
              label="Lembar Saham"
              placeholder="Input lembar Saham"
              defaultValue=""
              error={!!error}
              helperText={invalid && error?.message}
              containerSx={{ flex: 1 }}
              disabled={module?.includes('CREDIT_CHECKING')}
            />
          )}
        />
        <ColumnWrapper>
          <Currency
            label="Nilai per Lembar"
            placeholder="Input per Lembar"
            containerSx={{ flex: 1 }}
            value={{ currency: watch('currency'), value: watch('shareValue') }}
            onChange={(val) => {
              setValue('currency', val.currency);
              setValue('shareValue', val.value);
            }}
            disabled={module?.includes('CREDIT_CHECKING')}
          />
        </ColumnWrapper>
        <Controller
          name="percentage"
          control={control}
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="number"
              label="Persentase"
              placeholder="Input persentase"
              isAllowed={(values) => {
                const { formattedValue, floatValue } = values;
                return (
                  formattedValue === '' ||
                  (floatValue >= 0 && floatValue <= 100)
                );
              }}
              containerSx={{ flex: 1 }}
              error={!!error}
              helperText={invalid && error?.message}
              disabled={module?.includes('CREDIT_CHECKING')}
            />

          )}
        />
        <Currency
          label="Nominal"
          placeholder="Input Nominal"
          containerSx={{ flex: 1 }}
          value={{ currency: watch('currency'), value: nominal }}
          disabled
        />
      </Box>
      {module?.includes('CREDIT_CHECKING') ?
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.primary.main}
        >
          Document Credit Checking Result
        </TextStyle>
        : null}

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
              render={({ field, fieldState: { error, invalid } }) => (
                <Input
                  {...field}
                  type="dropdown"
                  dropdownList={collectibilityOptions}
                  label="Kolektibilitas"
                  placeholder="Input Kolektibilitas"
                  isMandatory
                  containerSx={{ flex: 1, gridColumn: '1 / span 2' }}
                  error={!!error}
                  helperText={invalid && error?.message}
                />
              )}
            />
            <Controller
              name="resultReporting"
              control={control}
              render={({ field, fieldState: { error, invalid } }) => (
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
              render={({ field, fieldState: { error, invalid } }) => (
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
              render={({ field, fieldState: { error, invalid } }) => (
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
          disabled={!formState.isDirty || !formState.isValid}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal >
  );
});


export default PopupShareholder;
