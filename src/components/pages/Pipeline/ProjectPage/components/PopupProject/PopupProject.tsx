import { useEffect } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { formatCurrency } from '@/helpers/formatCurrency';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../Project.constants';

import { CURRENCY, POPUP_PROJECT_SCHEMA, PROVINCE, SECTOR } from './PopupProject.constants';
import { usePopupProject } from './PopupProject.hook';

import type { PopupProjectProps } from './PopupProject.types';
import type { CurrencyFieldError } from '@/types/FieldError';


const PopupProject = NiceModal.create(({ id, viewOnly = false }: PopupProjectProps) => {
  const theme = useTheme();
  const modalId = modal.PROJECT_PAGE;
  const { visible } = useModal(modalId);

  // Page hook
  const {
    projectDetail,
    isSaveLoading,
    handleSubmit,
  } = usePopupProject({ id });

  // Form
  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    formState: { isDirty, isValid },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    defaultValues: projectDetail,
    mode: 'onChange',
    resolver: yupResolver(POPUP_PROJECT_SCHEMA),
  });

  // Variables
  const projectValue = parseFloat(watch('value')?.value?.replace(/,/g, '')) ?? 0;
  const exchangeRate = parseFloat(watch('exchangeRate')?.value?.replace(/,/g, '')) ?? 0;

  const options = { label: 'value1', module: 'value2', value: 'key' };
  const config = { staleTime: 0 };


  const selectedProvince = watch('province') as unknown as {
    module: string;
    value: string;
  } | null;

  const selectedCity = watch('city') as unknown as { module: string; value: string } | null;

  const selectedDistrict = watch('district') as unknown as {
    module: string;
    value: string;
  } | null;

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList(SECTOR);
  const { data: provinceDropdownList } = useGetParameterList(PROVINCE, options);
  const { data: currencyDropdownList } = useGetParameterList(CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });


  const cityModule = provinceDropdownList?.find((item) => item.value === selectedProvince)?.module;
  const { data: cityDropdownList } = useGetParameterList(cityModule, {
    ...options, config:
      { enabled: !!cityModule },
  }, config);

  const districtModule = cityDropdownList?.find((item) => item.value === selectedCity)?.module;
  const { data: districtDropdownList } = useGetParameterList(districtModule, {
    ...options, config:
      { enabled: !!districtModule },
  }, config);

  const isSameData = JSON.stringify(watch()) === JSON.stringify(projectDetail);

  useEffect(() => {
    reset(projectDetail);
  }, [projectDetail]);


  useEffect(() => {
    if (watch('value.currency') === 'USD') {
      const projectValueInIdr = (projectValue * exchangeRate).toString();

      setValue('valueInIdr', {
        currency: 'IDR',
        value: formatCurrency(projectValueInIdr, { maxDecimal: 2 }),
      });
    }

  }, [projectValue, exchangeRate]);

  useEffect(() => {
    const selectedCurrency = watch('value.currency');
    if (selectedCurrency && currencyDropdownList?.length) {
      const currencyData = currencyDropdownList.find(
        (item) => item.value === selectedCurrency
      );
      if (currencyData?.rate) {
        setValue('exchangeRate', {
          currency: 'IDR',
          value: formatCurrency(currencyData.rate, { maxDecimal: 2 }),
        });
      }
    }
    clearErrors('exchangeRate');
  }, [watch('value.currency'), currencyDropdownList]);

  const formatString = (val) => {
    let label = '';
    if (typeof val === 'object' && val !== null) {
      label = val?.value?.toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');
    } else {
      if (val?.length) {
        label = val.toLowerCase()
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
          .join(' ');
      }
    }

    return label;
  };

  const title = () => {
    if (viewOnly) {
      return 'Detail Proyek';
    } else {
      if (id) {
        return 'Edit Proyek';
      } else {
        return 'Add New Proyek';
      }
    }
  };

  return (
    <SectionModal
      title={title()}
      isOpen={visible}
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
        }}
      >
        <Controller
          control={control}
          name="projectName"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              inputRef={ref}
              label="Nama Proyek"
              type="text"
              placeholder="Input Nama Proyek"
              containerSx={{ flex: 1 }}
              error={invalid}
              helperText={error ? error.message : ''}
              disabled={viewOnly}
              isMandatory
              withSymbols
            />
          )}
        />

        <Controller
          control={control}
          name="province"
          render={({ field: { ref, onChange, value, ...field }, fieldState }) => (
            <Autocomplete
              label="Lokasi Proyek (Provinsi)"
              placeholder="Provinsi"
              dropdownList={provinceDropdownList ?? []}
              disabled={viewOnly}
              onChange={(v) => {
                onChange(v.value);
                setValue('city', null);
                setValue('district', null);
              }}
              value={provinceDropdownList?.find((item) => item.value === value) || null}
              error={!!fieldState?.error}
              helperText={fieldState?.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="sector"
          render={({
            field: { ref, ...field },
            fieldState: { invalid, error },
          }) => (
            <Input
              {...field}
              inputRef={ref}
              disabled={viewOnly}
              label="Sektor yang dibiayai"
              type="dropdown"
              placeholder="Pilih sektor yang dibiayai"
              containerSx={{ flex: 1 }}
              dropdownList={sectorDropdownList}
              error={invalid}
              helperText={error ? error.message : ''}
              isMandatory
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({
            field: { ref, onChange, ...field },
            fieldState: { invalid, error },
          }) => (
            <Autocomplete
              disabled={viewOnly}
              label="Lokasi Proyek (Kota/Kabupaten)"
              placeholder="Kota/Kabupaten"
              dropdownList={cityDropdownList ?? []}
              onChange={(v) => {
                onChange(v.value);
                setValue('district', null);
              }}
              value={cityDropdownList.find((item) => item.value === field.value) || null}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        <Controller
          control={control}
          name="value"
          render={({
            field: { ref, value, ...field },
            fieldState: { invalid, error },
          }) => {
            const err = error as unknown as CurrencyFieldError;
            return (
              <Currency
                {...field}
                disabled={viewOnly}
                inputRef={ref}
                label="Nilai Proyek"
                placeholder="Nilai Proyek"
                containerSx={{ flex: 1 }}
                value={{
                  currency: value?.currency || 'IDR',
                  value: value?.value || 'IDR',
                }}
                error={invalid}
                helperText={err?.currency ? err.currency.message : err?.value ? err.value.message : ''}
                isMandatory
              />
            );
          }}
        />

        <Controller
          control={control}
          name="district"
          render={({
            field: { ref, onChange, ...field },
            fieldState: { invalid, error },
          }) => (
            <Autocomplete
              disabled={viewOnly}
              label="Lokasi Proyek (Kecamatan)"
              placeholder="Kecamatan"
              dropdownList={districtDropdownList ?? []}
              onChange={(v) => onChange(v.value)}
              value={districtDropdownList.find((item) => item.value === field.value)}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        <Controller
          control={control}
          name="exchangeRate"
          render={({
            field: { ref, value, ...field },
            fieldState: { invalid, error },
          }) => {
            const err = error as unknown as CurrencyFieldError;

            return (
              <Currency
                {...field}
                isMandatory
                disabled={viewOnly}
                inputRef={ref}
                label="Exchange Rate"
                placeholder="Exchange Rate"
                currencyList={[
                  { label: 'IDR', value: 'IDR' },
                ]}
                containerSx={{
                  flex: 1,
                  visibility: watch('value')?.currency === 'USD' ? 'visible' : 'hidden',
                }}
                value={{
                  currency: 'IDR',
                  value: value?.value,
                }}
                error={invalid}
                helperText={err?.currency ? err.currency.message : err?.value ? err.value.message : ''}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="valueInIdr"
          render={({
            field: { ref, value, ...field },
            fieldState: { invalid, error },
          }) => {
            const err = error as unknown as CurrencyFieldError;

            return (
              <Currency
                {...field}
                disabled
                inputRef={ref}
                label="Nilai Proyek (dalam Rupiah)"
                placeholder="Nilai Proyek"
                currencyList={[
                  { label: 'IDR', value: 'IDR' },
                ]}
                containerSx={{
                  flex: 1,
                  visibility: watch('value')?.currency === 'USD' ? 'visible' : 'hidden',
                }}
                value={{
                  currency: value?.currency,
                  value: value?.value,
                }}
                error={invalid}
                helperText={err?.currency ? err.currency.message : err?.value ? err.value.message : ''}
              />
            );
          }}
        />
      </Box>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit(handleSubmit)}
          disabled={!isDirty || isSameData}
          isLoading={isSaveLoading}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default PopupProject;
