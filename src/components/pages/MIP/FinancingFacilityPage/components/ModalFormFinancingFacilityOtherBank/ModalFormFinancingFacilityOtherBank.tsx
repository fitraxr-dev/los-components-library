import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import { formatNumber } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../FinancingFacility.constants';

import TableOtherBank from './components/TableOtherBank';
import { useModalFormFinancingFacilityOtherBank } from './ModalFormFinancingFacilityOtherBank.hook';


const ModalFormFinancingFacilityOtherBank = NiceModal.create(({ id }: any) => {
  const theme = useTheme();

  const modalId = modal.FORM_FACILITY_OTHER_BANK;
  const { visible } = useModal(modalId);

  const {
    bankNameDropdownList,
    collectabilityDropdownList,
    currencyDropdownList,
    setBankNameKeyword,
    isLoadingBankName,
    isLoadingBankType,
    handleOnSave,
    formMethods,
    bankTypeDropdownList,
    handleChangeBankType,
    handleSelectedBankValue,
    isSyndication,
  } = useModalFormFinancingFacilityOtherBank({ id });

  return (
    <FormProvider {...formMethods}>
      <SectionModal
        title={`${id ? 'Edit' : 'Add New'} Fasilitas Pembiayaan Bank Lain`}
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
              const _error = error as unknown as {id: {message: string}; label: {message: string}};
              const _value = value as {id: string; label: string};

              return (
                <Autocomplete
                  {...field}
                  isMandatory
                  label="Jenis Kreditur"
                  isLoading={isLoadingBankType}
                  dropdownList={bankTypeDropdownList.map((item) => ({ ...item, id: item.value, label: item.label }))}
                  placeholder="Choose Jenis Kreditur"
                  value={_value}
                  onChange={(val) => {
                    onChange(val);
                    handleChangeBankType(val);
                    formMethods.setValue('bank', null);
                  }}
                  containerSx={{ flex: 1, maxWidth: '100%' }}
                  error={!!error}
                  helperText={invalid ? _error?.id?.message : ''}
                />
              );
            }}
          />
          <Controller
            control={formMethods.control}
            name="bank"
            render={({ field: { value, onChange, ...field }, fieldState: { error, invalid } }) => {
              const _error = error as unknown as {id: {message: string}; label: {message: string}};
              const _value = value as {id: string; label: string};

              return (
                <Autocomplete
                  {...field}
                  isMandatory
                  disabled={!formMethods.watch('bankType.id')}
                  isLoading={isLoadingBankName}
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
                  helperText={invalid ? _error?.id?.message : ''}
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
            name="plafond"
            render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
              const _error = error as unknown as {value: {message: string}};

              return (
                <Currency
                  {...field}
                  label="Plafond"
                  placeholder="Input Plafond"
                  containerSx={{ flex: 1 }}
                  currencyList={currencyDropdownList}
                  value={{
                    currency: formMethods.watch('plafond.currency'),
                    value: formMethods.watch('plafond.value'),
                  }}
                  onChange={(val) => {
                    onChange({
                      currency: val.currency,
                      value: formatNumber(val.value),
                    });
                  }}
                  onCurrencyChange={(currency) => {
                    formMethods.setValue('outstanding.currency', currency);
                    formMethods.setValue('plafondIdr.value', null);
                    formMethods.setValue('outstandingIdr.value', null);

                    if (!currency || currency === 'IDR') {
                      formMethods.setValue('exchangeRate', {
                        currency: 'IDR',
                        value: null,
                      });
                    } else {
                      formMethods.setValue('exchangeRate.value', null);
                    }
                  }}
                  error={!!error}
                  isMandatory={true}
                  helperText={invalid ? _error?.value?.message : ''}
                />
              );
            }}
          />
          <Controller
            control={formMethods.control}
            name="outstanding"
            render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
              const _error = error as unknown as {value: {message: string}};

              return (
                <Currency
                  {...field}
                  isMandatory
                  label="O/S"
                  placeholder="Input O/S"
                  containerSx={{ flex: 1 }}
                  currencyList={currencyDropdownList}
                  value={{
                    currency: formMethods.watch('outstanding.currency'),
                    value: formMethods.watch('outstanding.value'),
                  }}
                  onChange={(val) => {
                    onChange({
                      currency: val.currency,
                      value: formatNumber(val.value),
                    });
                  }}
                  onCurrencyChange={(currency) => {
                    formMethods.setValue('plafond.currency', currency);
                    formMethods.setValue('plafondIdr.value', null);
                    formMethods.setValue('outstandingIdr.value', null);

                    if (!currency || currency === 'IDR') {
                      formMethods.setValue('exchangeRate', {
                        currency: 'IDR',
                        value: null,
                      });
                    } else {
                      formMethods.setValue('exchangeRate.value', null);
                    }
                  }}
                  error={!!error}
                  helperText={invalid ? _error?.value?.message : ''}
                />
              );
            }}
          />
          <Controller
            control={formMethods.control}
            name="exchangeRate"
            render={({ field, fieldState: { error, invalid } }) => {
              const _error = error as unknown as {value: {message: string}};

              return (
                <Currency
                  {...field}
                  label="Exchange Rate"
                  placeholder="Input Exchange Rate"
                  currencyList={[{ label: 'IDR', value: 'IDR' }]}
                  containerSx={{ flex: 1 }}
                  value={{ currency: formMethods.watch('exchangeRate.currency'), value: formMethods.watch('exchangeRate.value') }}
                  error={!!error}
                  onChange={(val) => {
                    field.onChange(val);
                    if (val.currency === '') {
                      formMethods.setValue('exchangeRate.value', null);
                    }
                  }}
                  helperText={invalid && _error?.value?.message}
                  isMandatory={formMethods.watch('plafond.currency') !== 'IDR'}
                  disabled={formMethods.watch('plafond.currency') === 'IDR' || !formMethods.watch('plafond.currency')}
                />
              );
            }}
          />
          <div />
          <Controller
            control={formMethods.control}
            name="plafondIdr"
            render={({ field, fieldState: { error } }) => (
              <Currency
                {...field}
                disabled
                label="Nominal (dalam Rp)"
                placeholder="Auto Calculate"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: formMethods.watch('plafondIdr.value') ?? null }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={formMethods.control}
            name="outstandingIdr"
            render={({ field, fieldState: { error } }) => (
              <Currency
                {...field}
                disabled
                label="O/S (dalam Rp)"
                placeholder="Auto Calculate"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: formMethods.watch('outstandingIdr.value') ?? null }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={formMethods.control}
            name="callType"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                isMandatory
                label="CL/NCL"
                type="dropdown"
                dropdownList={[
                  {
                    label: 'CL',
                    value: 'CL',
                  },
                  {
                    label: 'NCL',
                    value: 'NCL',
                  }
                ]}
                placeholder="Choose CL/NCL"
                containerSx={{ flex: 1 }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={formMethods.control}
            name="collectability"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label="Kolektibilitas"
                type="dropdown"
                dropdownList={collectabilityDropdownList}
                placeholder="Choose Kolektibilitas"
                containerSx={{ flex: 1 }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            control={formMethods.control}
            name="isSyndication"
            render={({ field: { onChange, ...field }, fieldState: { error } }) => (
              <Input
                {...field}
                label="Sindikasi"
                type="radio"
                radioList={[
                  {
                    label: 'Ya',
                    value: true,
                  },
                  {
                    label: 'Tidak',
                    value: false,
                  },
                ]}
                onChange={(e) => {
                  onChange(e.target.value === 'true' ? true : false);
                  if (!isSyndication) {
                    formMethods.setValue('otherBank', []);
                  }
                }}
                containerSx={{ flex: 1 }}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Box>
        {isSyndication && (
          <TableOtherBank />
        )}
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
              containerSx={{ flex: 1 }}
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
            disabled={!formMethods.formState.isValid}
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
