import React from 'react';

import { Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';


import useGetParameterList from '@/hooks/services/useGetParameterList';

import Autocomplete from '@/components/shared/Autocomplete';
import Input from '@/components/shared/Input';

import type { SITEVISIT_VALIDATION_SCHEMA } from '@/components/pages/SiteVisit/shared/constants/schema';
import type { InferType } from 'yup';


type Props = {
  target: 'Customer' | 'site-visit';
  disableEdit?: boolean;
  isDataFromHistory?: boolean;
  skipValidation?: boolean;
}

type Form = InferType<typeof SITEVISIT_VALIDATION_SCHEMA>

const inputNames = {
  Customer: {
    city: 'debtorAddress.city',
    district: 'debtorAddress.district',
    postalCode: 'debtorAddress.postalCode',
    province: 'debtorAddress.province',
    subDistrict: 'debtorAddress.subDistrict',
  },
  'site-visit': {
    city: 'visitAddress.city',
    district: 'visitAddress.district',
    postalCode: 'visitAddress.postalCode',
    province: 'visitAddress.province',
    subDistrict: 'visitAddress.subDistrict',
  },
} as const;

const AddressForm = ({ target, disableEdit, isDataFromHistory, skipValidation = false }: Props) => {
  const { control, ...form } = useFormContext<Form>();

  const selectedProvince = form.watch(inputNames[target].province) as unknown as {
    module: string;
    value: string;
  } | null;

  const selectedCity = form.watch(inputNames[target].city) as unknown as { module: string; value: string } | null;

  const selectedDistrict = form.watch(inputNames[target].district) as unknown as {
    module: string;
    value: string;
  } | null;

  const options = { label: 'value1', module: 'value2', value: 'key' };
  const config = { staleTime: 0 };
  const isMandatoryAddress = target !== 'site-visit' && !isDataFromHistory && !skipValidation;

  // Dropdown data
  const { data: provinceDropdownList } = useGetParameterList('province', options, config);

  const cityModule = provinceDropdownList?.find((item) => item.value === selectedProvince?.value)?.module;
  const { data: cityDropdownList } = useGetParameterList(cityModule, {
    ...options, config:
      { enabled: !!cityModule },
  }, config);

  const districtModule = cityDropdownList?.find((item) => item.value === selectedCity?.value)?.module;
  const { data: districtDropdownList } = useGetParameterList(districtModule, {
    ...options, config:
      { enabled: !!districtModule },
  }, config);

  const subDistrictModule = districtDropdownList?.find((item) => item.value === selectedDistrict?.value)?.module;
  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, {
    ...options, config:
      { enabled: !!subDistrictModule },
  }, config);

  return (
    <Box
      sx={{
        display: 'grid',
        gridGap: 10,
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}
    >
      <Controller
        control={control}
        name={inputNames[target].province}
        render={({ field: { ref, onChange, value, ...field }, fieldState }) => (
          <Autocomplete
            label="Alamat (Provinsi)"
            placeholder="Choose Provinsi"
            dropdownList={provinceDropdownList}
            onChange={(v) => {
              onChange(v);
              form.setValue(inputNames[target].city, null);
              form.setValue(inputNames[target].district, null);
              form.setValue(inputNames[target].subDistrict, null);
              form.setValue(inputNames[target].postalCode, null);
            }}
            value={value}
            error={!skipValidation && !!fieldState?.error}
            helperText={!skipValidation && (fieldState?.error ? 'Alamat (Provinsi) is required' : '')}
            disabled={disableEdit}
            isMandatory={isMandatoryAddress}
          />
        )}
      />

      <Controller
        control={control}
        name={inputNames[target].city}
        render={({ field: { ref, onChange, ...field }, fieldState }) => (
          <Autocomplete
            label="Alamat (Kota/Kabupaten)"
            placeholder="Choose Kota/Kabupaten"
            dropdownList={cityDropdownList}
            onChange={(v) => {
              onChange(v);
              form.setValue(inputNames[target].district, null);
              form.setValue(inputNames[target].subDistrict, null);
              form.setValue(inputNames[target].postalCode, null);
            }}
            value={field.value}
            error={!skipValidation && !!fieldState?.error}
            helperText={!skipValidation && (fieldState?.error ? 'Alamat (Kota/Kabupaten) is required' : '')}
            disabled={disableEdit}
            isMandatory={isMandatoryAddress}
          />
        )}
      />

      <Controller
        control={control}
        name={inputNames[target].district}
        render={({ field: { ref, onChange, ...field }, fieldState }) => (
          <Autocomplete
            label="Alamat (Kecamatan)"
            placeholder="Choose Kecamatan"
            dropdownList={districtDropdownList}
            onChange={(v) => {
              onChange(v);
              form.setValue(inputNames[target].subDistrict, null);
              form.setValue(inputNames[target].postalCode, null);
            }}
            value={field.value}
            error={!skipValidation && !!fieldState?.error}
            helperText={!skipValidation && (fieldState?.error ? 'Alamat (Kecamatan) is required' : '')}
            disabled={disableEdit}
            isMandatory={isMandatoryAddress}
          />
        )}
      />

      <Controller
        control={control}
        name={inputNames[target].subDistrict}
        render={({ field: { ref, onChange, ...field }, fieldState }) => (
          <Autocomplete
            label="Alamat (Kelurahan/Desa)"
            placeholder="Choose Kelurahan/Desa"
            dropdownList={subDistrictDropdownList}
            onChange={(v) => {
              onChange(v);
              form.setValue(inputNames[target].postalCode, v?.module);
              // Trigger validasi untuk field postalCode agar error hilang
              if (!skipValidation) {
                form.trigger(inputNames[target].postalCode);
              }
            }}
            value={field.value}
            error={!skipValidation && !!fieldState?.error}
            helperText={!skipValidation && (fieldState?.error ? 'Alamat (Kelurahan/Desa) is required' : '')}
            disabled={disableEdit}
            isMandatory={isMandatoryAddress}
          />
        )}
      />

      <Controller
        control={control}
        name={inputNames[target].postalCode}
        render={({ field: { ref, ...field }, fieldState }) => (
          <Input
            {...field}
            type="text"
            label="Kode Pos"
            placeholder="Input Kode Pos"

            disabled
            error={!skipValidation && !!fieldState?.error}
            helperText={!skipValidation && (fieldState?.error ? 'Kode Pos is required' : '')}
            value={field.value}
            isMandatory={isMandatoryAddress}
          />
        )}
      />
    </Box>
  );
};

export default AddressForm;
