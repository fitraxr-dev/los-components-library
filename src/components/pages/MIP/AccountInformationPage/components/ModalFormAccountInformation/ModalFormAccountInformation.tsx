import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import { formatNumber, formatNumberToNominal } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../AccountInformation.constants';

import { useModalFormAccountInformation } from './ModalFormAccountInformation.hook';


const ModalFormFinancingFacilityOtherBank = NiceModal.create(({ id }: any) => {
  const theme = useTheme();

  const modalId = modal.FORM_ACCOUNT_INFORMATION;
  const { visible } = useModal(modalId);

  const {
    bankNameDropdownList,
    currencyDropdownList,
    setBankNameKeyword,
    handleOnSave,
    formMethods,
    bankTypeDropdownList,
    handleChangeBankType,
    handleSelectedBankValue,
    isSaveDisabled,
  } = useModalFormAccountInformation({ id });

  return (
    <FormProvider {...formMethods}>
      <SectionModal
        title={`${id ? 'Edit' : 'Add New'} Informasi Rekening`}
        isOpen={visible}
        onClose={() => closeNiceModal(modalId)}
        customFooter={() => null}
        containerSx={{ maxWidth: '52vw', minWidth: '52vw' }}
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
            control={formMethods.control}
            name="debtorName"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label="Nama Customer"
                placeholder="Input Nama Customer"
                containerSx={{ flex: 1, gridColumn: '1 / 3' }}
                error={!!error}
                helperText={error?.message}
                disabled
              />
            )}

          />
          <Controller
            control={formMethods.control}
            name="bankType"
            render={({ field: { onChange, value, ...field }, fieldState: { error, invalid } }) => {
              const _value = value as unknown as {id: string; label: string};

              const _error = error as unknown as {
                id: {message: string};
                label: {message: string};
              };

              return (
                <Autocomplete
                  {...field}
                  isMandatory
                  label="Jenis Bank"
                  dropdownList={bankTypeDropdownList.map((item) => ({ ...item, id: item.value, label: item.label }))}
                  placeholder="Choose Jenis Bank"
                  value={_value}
                  onChange={(val) => {
                    onChange(val);
                    handleChangeBankType(val);
                    formMethods.setValue('bank', null);
                  }}
                  containerSx={{ flex: 1, maxWidth: '100%' }}
                  error={!!error}
                  helperText={invalid && _error?.id.message}
                />
              );
            }}
          />

          <Controller
            control={formMethods.control}
            name="bank"
            render={({ field: { value, onChange, ...field }, fieldState: { error, invalid } }) => {
              const _value = value as {id: string; label: string};
              const _error = error as unknown as {
                id: {message: string};
                label: {message: string};
              };

              return (
                <Autocomplete
                  {...field}
                  isMandatory
                  disabled={!formMethods.watch('bankType.id')}
                  label="Bank"
                  placeholder="Choose Bank"
                  value={_value}
                  onChange={(val) => {
                    onChange(val);
                    handleSelectedBankValue(value?.id, String(val.id));
                  }}
                  onInputChange={(val) => setBankNameKeyword(val)}
                  dropdownList={bankNameDropdownList.map((item) => ({ id: item.value, label: item.label }))}
                  error={!!error}
                  helperText={invalid && _error.id.message}
                />
              );
            }}
          />
          <Controller
            control={formMethods.control}
            name="product"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label="Produk"
                placeholder="Input Produk"
                containerSx={{ flex: 1 }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={formMethods.control}
            name="rates"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                type="text"
                label="Rate"
                placeholder="Input Rate"
                containerSx={{ flex: 1 }}
                error={!!error}
                helperText={error?.message}
                withSymbols
              />
            )}
          />
          <Controller
            control={formMethods.control}
            name="nominal"
            render={({
              field: { onChange, ...field },
              fieldState: { error, invalid },
            }) => {
              const _error = error as unknown as {value: {message: string}};

              return (
                <Currency
                  {...field}
                  label="Nominal"
                  placeholder="Input Nominal"
                  containerSx={{ flex: 1 }}
                  currencyList={currencyDropdownList}
                  value={{
                    currency: formMethods.watch('nominal.currency'),
                    value: formMethods.watch('nominal.value'),
                  }}
                  onChange={(val) => {
                    onChange({
                      currency: val.currency,
                      value: formatNumber(val.value),
                    });

                    if (val.currency !== 'USD') {
                      formMethods.setValue('nominalIdr.value', val.value);
                    }
                  }}
                  onCurrencyChange={(val) => {
                    formMethods.setValue('nominal.value', null);
                  }}
                  isMandatory={true}
                  error={!!error}
                  helperText={invalid && _error.value.message}
                />
              );
            }}
          />
          <Controller
            control={formMethods.control}
            name="exchangeRate"
            render={({ field, fieldState: { error, invalid } }) => {
              const _error = error as unknown as {value: { message: string}};

              return (
                <Currency
                  {...field}
                  label="Exchange Rate"
                  placeholder="Input Exchange Rate"
                  containerSx={{ flex: 1 }}
                  value={{ currency: 'IDR', value: formMethods.watch('exchangeRate.value') }}
                  error={!!error}
                  helperText={invalid && _error.value.message}
                  currencyList={[
                    {
                      label: 'IDR',
                      value: 'IDR',
                    },
                  ]}
                  isMandatory={formMethods.watch('nominal.currency') === 'USD'}
                  disabled={formMethods.watch('nominal.currency') === 'IDR' || !formMethods.watch('nominal.currency')}
                />
              );
            }}
          />
          <Controller
            control={formMethods.control}
            name="nominalIdr"
            render={({ field, fieldState: { error } }) => (
              <Currency
                {...field}
                disabled
                label="Nominal (dalam Rp)"
                placeholder="Auto Calculate"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: formMethods.watch('nominalIdr.value') }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <div />
        </Box>

        <Controller
          control={formMethods.control}
          name="reference"
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Reference"
              type="area"
              rows="3"
              placeholder="Input Reference"
              containerSx={{ flex: 1 }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          control={formMethods.control}
          name="remark"
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Keterangan"
              type="area"
              rows="3"
              placeholder="Input keterangan"
              containerSx={{ flex: 1, mt: 2 }}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
          <Button
            variant="outlined"
            sx={{ mr: 3 }}
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            disabled={isSaveDisabled}
            onClick={formMethods.handleSubmit(handleOnSave)}
          >
            Save
          </Button>
        </RowWrapper>
      </SectionModal>

    </FormProvider>

  );
});

export default ModalFormFinancingFacilityOtherBank;
