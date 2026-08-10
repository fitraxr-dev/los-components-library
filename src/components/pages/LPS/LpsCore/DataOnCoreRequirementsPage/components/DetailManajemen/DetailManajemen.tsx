'use client';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useDetailManajemen from './DetailManajemen.hook';


const DetailManajemen = () => {
  const {
    cityDropdownList,
    control,
    countryDropdownList,
    ethnicOriginDropdownList,
    genderDropdownList,
    handleBackToListPage,
    idTypeDropdownList,
    nationalityDropDownList,
    positionDropdownList,
    provinceDropdownList,
    statusDropdownList,
    theme,
    titleDropdownList,
    watch,
    districtDropdownList,
    subDistrictDropdownList,
  } = useDetailManajemen();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Detail Management" />
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title="Detail Management" isOpen>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              mt: theme.spacing(5),
            }}
          >
            <Controller
              name="refId"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="ID Ref. Management"
                  placeholder="ID Ref. Management"
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  required
                  label="Status"
                  placeholder="Status"
                  type="dropdown"
                  dropdownList={statusDropdownList}
                  disabled
                />
              }
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Title"
                  placeholder="Title"
                  type="dropdown"
                  dropdownList={titleDropdownList}
                  disabled
                />
              }
            />

            <Box>
              <TextStyle
                variant="body4"
                weight={600}
                color="#ABABAB"
              >
                Nama Manajemen
              </TextStyle>

              <RowWrapper gap={2}>
                <Controller
                  name="prefix"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Gelar"
                      type="text"
                      disabled
                    />
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nama Manajemen"
                      type="text"
                      disabled
                    />
                  )}
                />
                <Controller
                  name="suffix"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Gelar"
                      type="text"
                      disabled
                    />
                  )}
                />
              </RowWrapper>
            </Box>

            <Controller
              name="placeOfBirth"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Place of Birth"
                  placeholder="Place of Birth"
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="dob"
              control={control}
              render={({
                field: { onChange, ...field },
              }) =>
                <Input
                  {...field}
                  label="DOB"
                  placeholder="DOB"
                  type="date"
                  disabled
                />
              }
            />

            <Controller
              name="personInCharge"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Person in Charge"
                  placeholder="Person in Charge"
                  type="dropdown"
                  disabled
                  dropdownList={[
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                  ]}
                />
              }
            />

            <Controller
              name="jobPosition"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Jabatan"
                  placeholder="Jabatan"
                  type="dropdown"
                  dropdownList={positionDropdownList}
                  disabled
                />
              }
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Gender"
                  placeholder="Gender"
                  type="dropdown"
                  dropdownList={genderDropdownList}
                  disabled
                />
              }
            />

            <Controller
              name="ethnicOrigin"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Ethnic Origin"
                  placeholder="Ethnic Origin"
                  type="dropdown"
                  dropdownList={ethnicOriginDropdownList}
                  disabled
                />
              }
            />
          </Box>
        </SectionTitle>

        <SectionTitle title="Dokumen Management" isOpen>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              mt: theme.spacing(5),
            }}
          >
            <Controller
              name="idType"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="ID Type"
                  placeholder="ID Type"
                  type="dropdown"
                  dropdownList={idTypeDropdownList}
                  disabled
                />
              }
            />

            <Controller
              name="identityExpiry"
              control={control}
              render={({
                field: { onChange, ...field },
              }) =>
                <Input
                  {...field}
                  label="Identity Expiry"
                  placeholder="Identity Expiry"
                  type="date"
                  disabled
                />
              }
            />

            <Controller
              name="idNo"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="ID No."
                  placeholder="ID No."
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="ktpFile"
              control={control}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    label="Upload ID"
                    placeholder="Upload ID"
                    type="file"
                    downloadOnly
                    // disabled={isDetailPage}
                    showPreviewFile={!!field.value}
                  />
                );
              }
              }
            />

            <Controller
              name="npwp"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="NPWP"
                  required
                  placeholder="NPWP"
                  type="npwp"
                  disabled
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
                  showPreviewFile={!!field.value}
                  downloadOnly
                  // disabled={isDetailPage}
                  dropdownPlaceholder="Download NPWP"
                />
              }
            />
          </Box>
        </SectionTitle>

        <SectionTitle title="Alamat Management" isOpen>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              mt: theme.spacing(5),
            }}
          >
            <Controller
              name="nationality"
              control={control}
              render={({ field: { value, onChange, ...field } }) => {
                value = nationalityDropDownList?.find((item) => item?.value === watch('nationality.value'));
                return (
                  <Autocomplete
                    {...field}
                    label="Nationality"
                    placeholder=" Nationality"
                    dropdownList={nationalityDropDownList}
                    disabled
                    value={value}
                  />
                );
              }
              }
            />

            <Controller
              name="country"
              control={control}
              render={({ field: { value, onChange, ...field } }) => {
                value = countryDropdownList?.find((item) => item?.value === watch('country.value'));
                return (
                  <Autocomplete
                    {...field}
                    label="Negara"
                    placeholder="Negara"
                    disabled
                    dropdownList={countryDropdownList}
                    value={value}
                  />
                );
              }
              }
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) =>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Input
                    {...field}
                    label="Address"
                    placeholder="Address"
                    minRows={4}
                    type="area"
                    disabled
                  />
                </Box>
              }
            />

            <Controller
              name="province"
              control={control}
              render={({ field: { value, onChange, ...field } }) => {
                let value1 = null;
                if (typeof watch('province') === 'object') {
                  value1 = {
                    id: watch('province.value'),
                    label: watch('province.label'),
                  };
                } else {
                  value1 = provinceDropdownList?.find((item) => item?.value === watch('province'));
                }
                return (
                  <Autocomplete
                    {...field}
                    dropdownList={provinceDropdownList}
                    label="Lokasi (Provinsi)"
                    placeholder="Masukkan Lokasi (Provinsi)"
                    disabled
                    value={value1}
                  />
                );
              }
              }
            />

            <Controller
              name="district"
              control={control}
              render={({ field: { value, onChange, ...field } }) => {
                let value1 = null;
                if (typeof watch('district') === 'object') {
                  value1 = {
                    id: watch('district.value'),
                    label: watch('district.label'),
                  };
                } else {
                  value1 = cityDropdownList?.find((item) => item?.value === watch('district'));
                }
                return (
                  <Autocomplete
                    {...field}
                    dropdownList={cityDropdownList}
                    label="Lokasi (Kota - Kabupaten)"
                    placeholder="Masukkan Lokasi (Kota - Kabupaten)"
                    disabled
                    value={value1}
                  />
                );
              }
              }
            />

            <Controller
              name="subDistrict"
              control={control}
              render={({ field: { value, onChange, ...field } }) => {
                let value1 = null;
                if (typeof watch('subDistrict') === 'object') {
                  value1 = {
                    id: watch('subDistrict.value'),
                    label: watch('subDistrict.label'),
                  };
                } else {
                  value1 = districtDropdownList?.find((item) => item?.value === watch('subDistrict'));
                }
                return (
                  <Autocomplete
                    {...field}
                    dropdownList={districtDropdownList}
                    label="Lokasi (Kecamatan)"
                    placeholder="Masukkan Lokasi (Kecamatan)"
                    disabled
                    value={value1}
                  />
                );
              }}
            />

            <Controller
              name="village"
              control={control}
              render={({ field: { value, onChange, ...field } }) => {
                let value1 = null;
                if (typeof watch('village') === 'object') {
                  value1 = {
                    id: watch('village.value'),
                    label: watch('village.label'),
                  };
                } else {
                  value1 = subDistrictDropdownList?.find((item) => item?.value === watch('village'));
                }
                return (
                  <Autocomplete
                    {...field}
                    dropdownList={subDistrictDropdownList}
                    label="Lokasi (Kelurahan)"
                    placeholder="Masukkan Lokasi (Kelurahan)"
                    disabled
                    value={value1}
                  />
                );
              }
              }
            />

            <Controller
              name="postalCode"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Postal Code"
                  placeholder="Postal Code"
                  type="text"
                  disabled
                />
              }
            />

            <Box >
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color="#ABABAB"
                >
                  Telepon
                </TextStyle>
              </RowWrapper>
              <RowWrapper gap={2}>
                <Controller
                  name="telephone.areaCode"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      placeholder="Input Kode"
                      type="text"
                      disabled
                    />
                  }
                />
                <Controller
                  name="telephone.number"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      placeholder="Input nomor telephone"
                      type="number"
                      disabled
                    />
                  }
                />
                <Controller
                  name="telephone.ext"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="ext"
                      type="text"
                      disabled
                    />
                  )}
                />
              </RowWrapper>
            </Box>

            <Controller
              name="modifiedBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="modifiedDate"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  value={field.value ? formatDateTime(field.value) : null}
                  label="Last Modified"
                  placeholder="Last Modified"
                  type="text"
                  disabled
                />
              }
            />
          </Box>
        </SectionTitle>
      </ColumnWrapper>
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        <Button variant="outlined" onClick={handleBackToListPage}>
          Close
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};
export default DetailManajemen;
