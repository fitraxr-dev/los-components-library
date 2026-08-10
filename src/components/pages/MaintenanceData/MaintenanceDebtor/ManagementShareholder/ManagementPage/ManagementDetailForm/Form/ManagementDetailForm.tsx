'use client';

import { useEffect, useState } from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

import { dayJsJakartaKeep, formatDateTime } from '@/helpers/date';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import { shareholderTooltip } from '../../../ManagementShareholder.constants';

import useManagementDetailForm from './ManagementDetailForm.hook';


const ManagementDetailForm = () => {
  const theme = useTheme();
  const [isViewOnly, setIsViewOnly] = useState(false);

  const {
    watch,
    findDataMaster,
    setValue,
    cityDropdownList,
    countryDropdownList,
    nationalityDropDownList,
    control,
    districtDropdownList,
    handleSave,
    handleSubmit,
    isDetailPage,
    handleNotComplete,
    provinceDropdownList,
    subDistrictDropdownList,
    titleDropdownList,
    genderDropdownList,
    ethnicOriginDropdownList,
    idTypeDropdownList,
    statusDropdownList,
    positionDropdownList,
    otherCountry, // Add this line
    handleBackToListPage,
  } = useManagementDetailForm();

  const [fileErrorNpwp, setFileErrorNpwp] = useState<string>('');
  const [fileErrorKtp, setFileErrorKtp] = useState<string>('');
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();


  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle
          title="Detail Management"
          isOpen
        >
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
                  hasDataMaster={findDataMaster('status', statusDropdownList)}
                  dropdownList={statusDropdownList}
                  disabled={isDetailPage}
                  isMandatory
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
                  disabled={isDetailPage}
                  hasDataMaster={findDataMaster('title', titleDropdownList)}
                />
              }
            />

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={!isDetailPage ? theme.palette.custom.text : '#ABABAB'}
                >
                  Nama Manajemen
                </TextStyle>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.error.main}
                >
                  *
                </TextStyle>
                <Tooltip
                  arrow
                  placement="right"
                  slotProps={{
                    arrow: {
                      sx: {
                        color: '#fff',
                      },
                    },
                    tooltip: {
                      sx: {
                        backgroundColor: '#fff',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                        color: theme.palette.primary.main,
                      },
                    },
                  }}
                  title={
                    <ul>
                      {shareholderTooltip.map((dt) => (
                        <li key={dt}>
                          <TextStyle variant="body5" >
                            {dt}
                          </TextStyle>
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              </RowWrapper>
              <RowWrapper gap={2}>
                <Controller
                  name="prefix"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      hasDataMaster={findDataMaster('prefix')}
                      placeholder="Masukin Gelar Depan"
                      type="text"
                      disabled={isDetailPage}
                    />
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      hasDataMaster={findDataMaster('name')}
                      placeholder="Nama Manajemen"
                      type="text"
                      disabled={isDetailPage}
                    />
                  )}
                />
                <Controller
                  name="suffix"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      hasDataMaster={findDataMaster('suffix')}
                      placeholder="Masukin Gelar Belakang"
                      type="text"
                      disabled={isDetailPage}
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
                  hasDataMaster={findDataMaster('placeOfBirth')}
                  placeholder="Place of Birth"
                  type="text"
                  disabled={isDetailPage}
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
                  required
                  hasDataMaster={findDataMaster('dob')}
                  placeholder="DOB"
                  onChange={(val) => onChange(dayJsJakartaKeep(val))}
                  maxDate={dayjs().toString()}
                  type="date"
                  disabled={isDetailPage}
                  isMandatory
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
                  required
                  hasDataMaster={findDataMaster('personInCharge', [
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                  ])}
                  placeholder="Input Person in Charge"
                  type="dropdown"
                  disabled={isDetailPage}
                  dropdownList={[
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                  ]}
                  isMandatory
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
                  hasDataMaster={findDataMaster('jobPosition', positionDropdownList)}
                  placeholder="Jabatan"
                  type="dropdown"
                  dropdownList={positionDropdownList}
                  disabled={isDetailPage}
                  isMandatory
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
                  hasDataMaster={findDataMaster('gender', genderDropdownList)}
                  dropdownList={genderDropdownList}
                  disabled={isDetailPage}
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
                  hasDataMaster={findDataMaster('ethnicOrigin', ethnicOriginDropdownList)}
                  placeholder="Ethnic Origin"
                  type="dropdown"
                  dropdownList={ethnicOriginDropdownList}
                  disabled={isDetailPage}
                />
              }
            />

          </Box>
        </SectionTitle>

        <SectionTitle
          title="Dokumen Management"
          sx={{ mt: theme.spacing(5) }}
          isOpen
        >
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
                  required
                  placeholder="ID Type"
                  type="dropdown"
                  dropdownList={idTypeDropdownList}
                  hasDataMaster={findDataMaster('idType', idTypeDropdownList)}
                  disabled={isDetailPage}
                  isMandatory
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
                  hasDataMaster={findDataMaster('identityExpiry')}
                  label="Identity Expiry"
                  placeholder="Identity Expiry"
                  type="date"
                  onChange={(val) => onChange(dayJsJakartaKeep(val))}
                  disabled={isDetailPage}
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
                  required
                  hasDataMaster={findDataMaster('idNo')}
                  placeholder="ID No."
                  type="text"
                  disabled={isDetailPage}
                  isMandatory
                />
              }
            />

            <Controller
              control={control}
              name="ktpFile"
              render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload ID"
                  placeholder="Upload ID"
                  containerSx={{ flex: 1 }}
                  error={isTouched && invalid || !!fileErrorKtp}
                  helperText={fileErrorKtp || (isTouched && error ?
                    error.message : `Supported formats: ${acceptedFormatsText}`)}
                  downloadOnly={isDetailPage}
                  isMandatory
                  onChange={(val) => {
                    setFileErrorKtp('');
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setFileErrorKtp(result.errorMessage);
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              )}
            />

            <Controller
              name="npwp"
              control={control}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}

                  label="NPWP"
                  required
                  hasDataMaster={findDataMaster('npwp')}
                  placeholder="NPWP"
                  type="npwp"
                  disabled={isDetailPage}
                  maxLength={16}
                  isMandatory
                  error={!!error}
                  helperText={error?.message || ''}
                />
              }
            />

            <Controller
              control={control}
              name="npwpFile"
              render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload NPWP"
                  placeholder="Upload NPWP"
                  containerSx={{ flex: 1 }}
                  error={isTouched && invalid || !!fileErrorNpwp}
                  helperText={fileErrorNpwp || (isTouched && error ?
                    error.message : `Supported formats: ${acceptedFormatsText}`)}
                  downloadOnly={isDetailPage}
                  isMandatory
                  onChange={(val) => {
                    setFileErrorNpwp('');
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setFileErrorNpwp(result.errorMessage);
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              )}
            />

          </Box>
        </SectionTitle>

        <SectionTitle
          title="Alamat Management"
          isOpen
          sx={{ mt: theme.spacing(5) }}
        >
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
                    hasDataMaster={findDataMaster('nationality', nationalityDropDownList)}
                    label="Nationality"
                    placeholder=" Nationality"
                    dropdownList={nationalityDropDownList}
                    disabled={isDetailPage}
                    onChange={(val) => { onChange(val); }}
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
                    hasDataMaster={findDataMaster('country', countryDropdownList)}
                    placeholder="Negara"
                    disabled={isDetailPage}
                    dropdownList={countryDropdownList}
                    onChange={(val) => { onChange(val); }}
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
                    hasDataMaster={findDataMaster('address')}
                    placeholder="Address"
                    rows={4}
                    type="area"
                    disabled={isDetailPage}

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
                    hasDataMaster={findDataMaster('province', provinceDropdownList)}
                    placeholder="Masukkan Lokasi (Provinsi)"
                    disabled={isDetailPage || otherCountry} // Changed this line
                    onChange={(val) => {
                      onChange(val);
                      setValue('village', '');
                      setValue('district', '');
                      setValue('subDistrict', '');
                    }}
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
                    hasDataMaster={findDataMaster('district', cityDropdownList)}
                    placeholder="Masukkan Lokasi (Kota - Kabupaten)"
                    disabled={isDetailPage || otherCountry} // Changed this line
                    onChange={(val) => {
                      onChange(val);
                      setValue('village', '');
                      setValue('subDistrict', '');
                    }}
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
                    hasDataMaster={findDataMaster('subDistrict', districtDropdownList)}
                    placeholder="Masukkan Lokasi (Kecamatan)"
                    disabled={isDetailPage || otherCountry} // Changed this line
                    onChange={(val) => {
                      onChange(val);
                      setValue('village', '');
                    }}
                    value={value1}
                  />
                );
              }
              }
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
                    hasDataMaster={findDataMaster('village', subDistrictDropdownList)}
                    placeholder="Masukkan Lokasi (Kelurahan)"
                    disabled={isDetailPage || otherCountry} // Changed this line
                    onChange={(val) => { onChange(val); }}
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
                  hasDataMaster={findDataMaster('postalCode')}
                  placeholder="Postal Code"
                  type="text"
                  disabled={isDetailPage || otherCountry} // Changed this line
                />
              }
            />

            <Box >
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={!isDetailPage ? theme.palette.custom.text : '#ABABAB'}
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
                      hasDataMaster={findDataMaster('telephone.areaCode')}
                      type="text"
                      disabled={isDetailPage}


                    />
                  }
                />
                <Controller
                  name="telephone.number"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      hasDataMaster={findDataMaster('telephone.number')}
                      placeholder="Input nomor telephone"
                      type="number"
                      disabled={isDetailPage}

                    />
                  }
                />
                <Controller
                  name="telephone.ext"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      hasDataMaster={findDataMaster('telephone.ext')}
                      placeholder="ext"
                      type="text"
                      disabled={isDetailPage}

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
        {!isDetailPage &&
          <Button onClick={handleSubmit(handleSave, handleNotComplete)} disabled={isViewOnly}>
            Save
          </Button>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ManagementDetailForm;
