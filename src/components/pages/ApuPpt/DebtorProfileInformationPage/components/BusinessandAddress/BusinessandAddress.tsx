import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import InputDebtorName from '@/components/shared/Input/components/InputDebtorName';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useBusinessandAddress from './BusinessandAddress.hook';


type Option = { label: string; module: string; value: string };

const byValue = (v?: string, list?: Option[]) =>
  (v && list?.find((o) => o.value === v)) ?? null;

const BusinessandAddressSection = ({
  control,
  watch,
  setValue,
  formState,
  changeBgInput,
  findDataMaster,
  needCheckMaster,
}) => {
  const theme = useTheme();
  const {
    isViewOnly,
    isDpopDivision,
    businessEntityForm,
    formatString,
    findBisnisEntityFormLabel,
  } = useBusinessandAddress();
  const options = { label: 'value1', module: 'value2', value: 'key' };
  const config = { staleTime: ONE_MINUTE };

  const provinceCode = watch('province');
  const cityCode = watch('city');
  const districtCode = watch('district');

  const { data: provinceDropdownList } = useGetParameterList('province', options, config);
  const selectedProvince = byValue(provinceCode, provinceDropdownList);

  const cityModule = selectedProvince?.module;
  const { data: cityDropdownList } = useGetParameterList(
    cityModule,
    options,
    { enabled: !!cityModule, ...config }
  );
  const selectedCity = byValue(cityCode, cityDropdownList);

  const districtModule = selectedCity?.module;
  const { data: districtDropdownList } = useGetParameterList(
    districtModule,
    options,
    { enabled: !!districtModule, ...config }
  );
  const selectedDistrict = byValue(districtCode, districtDropdownList);

  const subDistrictModule = selectedDistrict?.module;
  const { data: subDistrictDropdownList } = useGetParameterList(
    subDistrictModule,
    options,
    { enabled: !!subDistrictModule, ...config }
  );

  return (
    <BaseContainer sx={{ boxShadow: 2 }}>
      <ColumnWrapper gap={theme.spacing(3)}>
        <RowWrapper gap={theme.spacing(3)}>
          <Box width="49%">
            <Controller
              control={control}
              name="businessField"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  isMandatory
                  {...field}
                  disabled={isViewOnly}
                  inputRef={ref}
                  type="text"
                  inputProps={{
                    style: {
                      backgroundColor: changeBgInput('businessField'),
                    },
                  }}
                  label="Bidang Usaha atau Kegiatan Usaha"
                  placeholder="Bidang Usaha atau Kegiatan Usaha"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('businessField') || '-'}</TextStyle>}
          </Box>
          <Box width="49%">
            <Controller
              control={control}
              name="businessFieldRef"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  disabled={!isDpopDivision || isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Ref. Bidang Usaha atau Kegiatan Usaha"
                  placeholder="Ref. Bidang Usaha atau Kegiatan Usaha"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('businessFieldRef') || '-'}</TextStyle>}
          </Box>
        </RowWrapper>
        <RowWrapper gap={theme.spacing(3)}>
          <Box width="49%">
            <Controller
              control={control}
              name="licenseNumber"
              render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
                <Input
                  isMandatory
                  {...field}
                  disabled={isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Nomor Izin dari Instansi Berwenang"
                  placeholder="Nomor Izin dari Instansi Berwenang"
                  inputProps={{
                    style: {
                      backgroundColor: changeBgInput('licenseNumber'),
                    },
                  }}
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('licenseNumber') || '-'}</TextStyle>}

          </Box>
          <Box width="49%">
            <Controller
              control={control}
              name="licenseNumberRef"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  disabled={!isDpopDivision || isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Ref. Nomor Izin dari Instansi Berwenang"
                  placeholder="Reference Nomor Izin dari Instansi Berwenang"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}

                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('licenseNumberRef') || '-'}</TextStyle>}
          </Box>
        </RowWrapper>
        <RowWrapper gap={theme.spacing(3)}>
          <Box width="49%">
            <Controller
              control={control}
              name="establishmentPlace"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  isMandatory
                  {...field}
                  disabled={isViewOnly}
                  inputRef={ref}
                  inputProps={{
                    style: {
                      backgroundColor: changeBgInput('establishmentPlace'),
                    },
                  }}
                  type="text"
                  label="Tempat Pendirian"
                  placeholder="Tempat Pendirian"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('establishmentPlace') || '-'}</TextStyle>}
          </Box>
          <Box width="49%">
            <Controller
              control={control}
              name="establishmentPlaceRef"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  disabled={!isDpopDivision || isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Ref. Tempat Pendirian"
                  placeholder="Reference Tempat Pendirian"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('establishmentPlaceRef') || '-'}</TextStyle>}
          </Box>
        </RowWrapper>
        <RowWrapper gap={theme.spacing(3)}>
          <Box width="49%">
            <Controller
              control={control}
              name="establishmentDate"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  isMandatory
                  {...field}
                  inputSx={{
                    backgroundColor: changeBgInput('establishmentDate'),
                  }}
                  disabled={isViewOnly}
                  inputRef={ref}
                  type="date"
                  label="Tanggal Pendirian"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('establishmentDate') ? dayjs(findDataMaster('establishmentDate')).format('DD/MM/YYYY') : '-'}</TextStyle>}
          </Box>
          <Box width="49%">
            <Controller
              control={control}
              name="establishmentDateRef"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  disabled={!isDpopDivision || isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Ref. Tanggal Pendirian"
                  placeholder="Reference Tanggal Pendirian"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('establishmentDateRef') || '-'}</TextStyle>}
          </Box>
        </RowWrapper>
        <RowWrapper gap={theme.spacing(3)}>
          <Box width="49%">
            <InputDebtorName
              name="ultimateBeneficialOwner"
              control={control}
              type="text"
              bg={changeBgInput('ultimateBeneficialOwner')}
              isMandatory
              contentTooltip={
                <ColumnWrapper sx={{ p: 1 }}>
                  <TextStyle variant="body3">
                    Pemilik Manfaat / Ultimate Beneficial
                    <br />
                    Owner Wajib Perorangan.
                  </TextStyle>
                </ColumnWrapper>
              }
              label="Pemilik Manfaat / Ultimate Beneficial Owner"
              placeholder="Pemilik Manfaat / Ultimate Beneficial Owner"
              disabled={isViewOnly}

              error={!!formState.errors.ultimateBeneficialOwner}
              helperText={formState.errors.ultimateBeneficialOwner?.message || null}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('ultimateBeneficialOwner') || '-'}</TextStyle>}

            {/* <Controller
              control={control}
              name="ultimateBeneficialOwner"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  isMandatory
                  {...field}
                  disabled={isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Pemilik Manfaat / Ultimate Beneficial Owner"
                  placeholder="Pemilik Manfaat / Ultimate Beneficial Owner"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            /> */}
          </Box>
          <Box width="49%">
            <Controller
              control={control}
              name="ultimateBeneficialOwnerRef"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  disabled={!isDpopDivision || isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Ref. Pemilik Manfaat / Ultimate Beneficial Owner"
                  placeholder="Reference Pemilik Manfaat / Ultimate Beneficial Owner"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('ultimateBeneficialOwnerRef') || '-'}</TextStyle>}
          </Box>
        </RowWrapper>

        <RowWrapper gap={theme.spacing(3)}>
          <Box width="49%">
            <Controller
              control={control}
              name="businessEntityForm"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  isMandatory
                  disabled={isViewOnly}
                  inputRef={ref}
                  inputSx={{
                    backgroundColor: changeBgInput('businessEntityForm'),
                  }}
                  type="dropdown"
                  dropdownList={businessEntityForm}
                  label="Bentuk Badan Usaha"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('businessEntityForm') ? findBisnisEntityFormLabel(findDataMaster('businessEntityForm')) : '-'}</TextStyle>}
          </Box>
          <Box width="49%">
            <Controller
              control={control}
              name="businessRelationshipPurpose"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  isMandatory
                  disabled={isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Maksud dan Tujuan Hubungan Usaha"
                  placeholder="Maksud dan Tujuan Hubungan Usaha"
                  inputProps={{
                    style: {
                      backgroundColor: changeBgInput('businessRelationshipPurpose'),
                    },
                  }}
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                  withSymbols
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('businessRelationshipPurpose') || '-'}</TextStyle>}

          </Box>
        </RowWrapper>
        <RowWrapper gap={theme.spacing(3)}>
          <Box width="49%" mb={2}>
            <Controller
              control={control}
              name="registeredStockExchange"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  disabled={isViewOnly}
                  inputRef={ref}
                  sx={{
                    backgroundColor: changeBgInput('registeredStockExchange'),
                  }}
                  type="radio"
                  radioList={[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false }
                  ]}
                  label="Terdaftar Bursa Efek"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('registeredStockExchange') ? 'YA' : 'Tidak'}</TextStyle>}
          </Box>
          <Box width="49%">
            <Controller
              control={control}
              name="sourceOfFunds"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  isMandatory
                  disabled={isViewOnly}
                  inputRef={ref}
                  type="text"
                  label="Sumber Dana"
                  placeholder="Sumber Dana"
                  containerSx={{ flex: 1 }}
                  inputProps={{
                    style: {
                      backgroundColor: changeBgInput('sourceOfFunds'),
                    },
                  }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                />
              )}
            />
            {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('sourceOfFunds') || '-'}</TextStyle>}
          </Box>
        </RowWrapper>

        {watch().applicationCategory?.includes('DATA_UPDATES') &&
        <>
          <RowWrapper gap={theme.spacing(3)}>
            <Box width="49%" >
              <Controller
                control={control}
                name="revenue"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    disabled={isViewOnly}
                    inputRef={ref}
                    type="text"
                    inputProps={{
                      style: {
                        backgroundColor: changeBgInput('revenue'),
                      },
                    }}
                    label="Penghasilan"
                    placeholder="Penghasilan"
                    containerSx={{ flex: 1 }}
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('revenue') || '-'}</TextStyle>}
            </Box>
            <Box width="49%">
              <Controller
                control={control}
                name="revenueRef"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    disabled={!isDpopDivision || isViewOnly}
                    inputRef={ref}
                    type="text"
                    label="Ref. Penghasilan"
                    placeholder="Reference Penghasilan"
                    containerSx={{ flex: 1 }}
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('revenueRef') || '-'}</TextStyle>}
            </Box>
          </RowWrapper>

          <RowWrapper gap={theme.spacing(3)} mb={3}>
            <Box width="49%">
              <Controller
                control={control}
                name="accountOwned"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    disabled={isViewOnly}
                    inputRef={ref}
                    type="text"
                    inputProps={{
                      style: {
                        backgroundColor: changeBgInput('accountOwned'),
                      },
                    }}
                    label="Rekening yang Dimiliki"
                    placeholder="Rekening yang Dimiliki"
                    containerSx={{ flex: 1 }}
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('accountOwned') || '-'}</TextStyle>}
            </Box>
            <Box width="49%">
              <Controller
                control={control}
                name="accountOwnedRef"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    disabled={!isDpopDivision || isViewOnly}
                    inputRef={ref}
                    type="text"
                    label="Ref. Rekening yang Dimiliki"
                    placeholder="Reference Rekening yang Dimiliki"
                    containerSx={{ flex: 1 }}
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('accountOwnedRef') || '-'}</TextStyle>}
            </Box>
          </RowWrapper>
        </>
        }
      </ColumnWrapper>

      <TextStyle variant="body2" sx={{ color: '#284A63', fontWeight: '600', marginBottom: 3, marginTop: 2 }}>
        Alamat Kedudukan:
      </TextStyle>
      <Box>
        <Controller
          control={control}
          name="address"
          render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              isMandatory
              disabled={isViewOnly}
              inputRef={ref}
              type="area"
              rows={4}
              inputSx={{
                backgroundColor: changeBgInput('address'),
              }}
              label="Alamat"
              placeholder="Alamat"
              containerSx={{ flex: 1 }}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />
        {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('address') || '-'}</TextStyle>}
      </Box>
      <Box display="flex" mt={2} gap="1%" flexWrap="wrap">
        <Box width="24%" mb={2}>
          <Controller
            control={control}
            name="province"
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                label="Alamat (Provinsi)"
                placeholder="Choose Provinsi"
                inputSx={{ backgroundColor: changeBgInput('province') }}
                dropdownList={provinceDropdownList}
                value={byValue(field.value, provinceDropdownList)}
                onChange={(opt) => {
                  field.onChange((opt as Option | null)?.value ?? '');
                  setValue('city', '');
                  setValue('district', '');
                  setValue('subDistrict', '');
                  setValue('postalCode', '');
                }}
                error={!!error}
                helperText={error?.message || ''}
                disabled={isViewOnly}
                isMandatory
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('province') ? formatString(findDataMaster('province')) : '-'}</TextStyle>}
        </Box>
        <Box width="24%" mb={2}>
          <Controller
            control={control}
            name="city"
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                label="Alamat (Kota-Kabupaten)"
                placeholder="Alamat (Kota-Kabupaten)"
                inputSx={{ backgroundColor: changeBgInput('city') }}
                dropdownList={cityDropdownList}
                value={byValue(field.value, cityDropdownList)}
                onChange={(opt) => {
                  field.onChange((opt as Option | null)?.value ?? '');
                  setValue('district', '');
                  setValue('subDistrict', '');
                  setValue('postalCode', '');
                }}
                error={!!error}
                helperText={error?.message || ''}
                disabled={isViewOnly || !cityModule}
                isMandatory
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('city') ? formatString(findDataMaster('city')) : '-'}</TextStyle>}
        </Box>
        <Box width="24%" mb={2}>
          <Controller
            control={control}
            name="district"
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                label="Alamat (Kecamatan)"
                placeholder="Alamat (Kecamatan)"
                inputSx={{ backgroundColor: changeBgInput('district') }}
                dropdownList={districtDropdownList}
                value={byValue(field.value, districtDropdownList)}
                onChange={(opt) => {
                  field.onChange((opt as Option | null)?.value ?? '');
                  setValue('subDistrict', '');
                  setValue('postalCode', '');
                }}
                error={!!error}
                helperText={error?.message || ''}
                disabled={isViewOnly || !districtModule}
                isMandatory
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('district') ? formatString(findDataMaster('district')) : '-'}</TextStyle>}
        </Box>
        <Box width="24%" mb={2}>
          <Controller
            control={control}
            name="subDistrict"
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                label="Alamat (Kelurahan)"
                placeholder="Alamat (Kelurahan)"
                inputSx={{ backgroundColor: changeBgInput('subDistrict') }}
                dropdownList={subDistrictDropdownList}
                value={byValue(field.value, subDistrictDropdownList)}
                onChange={(opt) => {
                  const o = opt as Option | null;
                  field.onChange(o?.value ?? '');
                  setValue('postalCode', o?.module ?? '');
                }}
                error={!!error}
                helperText={error?.message || ''}
                disabled={isViewOnly || !subDistrictModule}
                isMandatory
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('subDistrict') ? formatString(findDataMaster('subDistrict')) : '-'}</TextStyle>}
        </Box>
        <Box width="24%" mb={2}>
          <Controller
            control={control}
            name="postalCode"
            render={({ field: { ref, onChange, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                isMandatory
                disabled
                inputRef={ref}
                type="number"
                inputProps={{
                  style: {
                    backgroundColor: changeBgInput('postalCode'),
                  },
                }}
                onValueChange={(values) => {
                  onChange(values.value);
                }}
                label="Kode Pos"
                placeholder="Input Kode Pos"
                containerSx={{ flex: 1 }}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('postalCode') || '-'}</TextStyle>}
        </Box>
        <Box width="24%" mb={2}>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                inputRef={ref}
                type="text"
                onChange={(val) => {
                  const numberOnly = /^[0-9]*$/;
                  if (numberOnly.test(val) || val === '') {
                    field.onChange(val);
                  }
                }}
                inputProps={{
                  style: {
                    backgroundColor: changeBgInput('phoneNumber'),
                  },
                }}
                disabled={isViewOnly}
                label="No. Telepon"
                placeholder="Input No. Telepon"
                containerSx={{ flex: 1 }}

                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('phoneNumber') || '-'}</TextStyle>}
        </Box>
        <Box width="24%" mb={2}>
          <Controller
            control={control}
            name="email"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                inputRef={ref}
                inputProps={{
                  style: {
                    backgroundColor: changeBgInput('email'),
                  },
                }}
                disabled={isViewOnly}
                type="text"
                label="Email"
                placeholder="Input Email"
                containerSx={{ flex: 1 }}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('email') || '-'}</TextStyle>}
        </Box>
      </Box>
      <Box>
        <Controller
          control={control}
          name="addressRef"
          render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              disabled={!isDpopDivision || isViewOnly}
              inputRef={ref}
              type="text"
              label="Ref Alamat"
              placeholder="Ref Alamat"
              containerSx={{ flex: 1 }}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />
        {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('addressRef') || '-'}</TextStyle>}
      </Box>
    </BaseContainer>
  );
};

export default BusinessandAddressSection;
