'use client';

import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';

import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons';
import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';

import useGeneralInformation from './GeneralInformation.hook';


const GeneralInformation = () => {
  const theme = useTheme();
  const {
    handleOpenSubmitModal,
    handleClose,
    isSubmitLoading,
    isPending,
    actions,
    control,
    setValue,
    dataSourceDropdownList,
    institutionTypeList,
    sectorDropdownList,
    provinceDropdownList,
    cityDropdownList,
    districtDropdownList,
    subDistrictDropdownList,
    goPublicList,
    companyType,
    ownedByList,
    languageDropdownList,
    nationalityDropdownList,
    positionDropdownList,
    countryDropdownList,
    branchDropdownList,
    purposeDropdownList,
    filteredOwnership,
    filteredPurpose,
    handleSave,
    isViewOnly,
    formatString,
    isDebtor,
    isAutoSaveFetching,
    isDirty,
    debtorData,
    findDataMaster,
    otherCountry,
    countryCodeList,
    watch,
    canEdit,
    roleCanEdit,
    masterCity,
    masterDistrict,
    masterSubDistrict,
    setIsSubmit,
  } = useGeneralInformation();

  const saveAction = actions?.action ? actions.action[ACTIONS.SAVE] : null;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
      <Title title="General Information" />
      {isDebtor ?
        <>
          <TableDebtorInformationLocal
            debtorName={debtorData?.name}
            gamName={debtorData?.gamName}
            staffName={debtorData?.staffName}
            isNewClient={debtorData?.isNewDebtor}
            cif={debtorData?.cif}
            division={debtorData?.divisionName}
            debtorId={debtorData?.debtorId}
            createdAt={debtorData?.createdDate}
          />
        </> :
        <>
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
            showDifferentDataAlert={false}
          />
        </>
      }
      <SectionTitle title="Detail Customer" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="generalInformation.customerId"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="Customer ID"
                placeholder="Masukkan Customer ID"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.cif"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                label="CIF"
                placeholder="Masukkan CIF"
                type="text"
              />
            }
          />

          <Controller
            name="generalInformation.dataSource"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={dataSourceDropdownList}
                label="Data Source"
                placeholder="Masukkan Data Source"
                type="dropdown"
                hasDataMaster={findDataMaster('dataSource', dataSourceDropdownList)}
              />
            }
            disabled={isViewOnly}
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Customer Category
              </TextStyle>
              {/* <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle> */}
            </RowWrapper>
            <Box display="flex" gap={theme.spacing(2)}>
              <Controller
                name="generalInformation.debtorOwnerships"
                control={control}
                render={({ field: { onChange, ...field } }) =>
                  <Input
                    {...field}
                    containerSx={{ flex: 1 }}
                    label=""
                    placeholder="Masukkan Kemilikan"
                    type="dropdown"
                    dropdownList={filteredOwnership || ownedByList}
                    onChange={(val) => {
                      onChange(val);
                      setValue('generalInformation.debtorPurpose', null);
                    }}
                    hasDataMaster={findDataMaster('debtorOwnerships', filteredOwnership || ownedByList)}

                  />
                }
                disabled={isViewOnly}
              />
              <Controller
                name="generalInformation.debtorPurpose"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    containerSx={{ flex: 1 }}
                    placeholder="Masukkan Bentuk dan Tujuan"
                    type="dropdown"
                    dropdownList={filteredPurpose || purposeDropdownList}
                    hasDataMaster={findDataMaster('debtorPurpose', filteredPurpose || purposeDropdownList)}
                  />
                }
                disabled={isViewOnly}
              />
            </Box>
          </Box>

          <Controller
            name="generalInformation.institutionType"
            control={control}
            render={({ field: { onChange, ...field } }) =>
              <Input
                {...field}
                dropdownList={institutionTypeList}
                label="Institution Type"
                placeholder="Masukkan Institution Type"
                type="dropdown"
                onChange={(val) => {
                  onChange(val);
                  setValue('generalInformation.debtorOwnerships', null);
                  setValue('generalInformation.debtorPurpose', null);
                }}
                isMandatory
                hasDataMaster={findDataMaster('institutionType', institutionTypeList)}
              />
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.customerName"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Customer"
                placeholder="Masukkan Nama Customer"
                type="text"
                isMandatory

                hasDataMaster={findDataMaster('customerName')}
              />
            }
            disabled={isViewOnly}
          />
          <Controller
            name="generalInformation.alias"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alias"
                placeholder="Masukkan Alias"
                type="text"

                hasDataMaster={findDataMaster('alias')}
              />
            }
            disabled={isViewOnly}
          />
        </Box>
        <Controller
          name="generalInformation.customerRemark"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Keterangan Customer"
              placeholder="Masukkan Keterangan Customer"
              type="area"
              rows={4}

              hasDataMaster={findDataMaster('customerRemark')}
            />
          }
          disabled={isViewOnly}
        />

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="generalInformation.isNew"
            control={control}
            disabled
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={[
                  { label: 'New', value: 'true' },
                  { label: 'Existing', value: 'false' },
                ]}
                label="New/Existing Client"
                placeholder="Masukkan New/Existing Client"
                type="dropdown"
                hasDataMaster={findDataMaster('isNew', [
                  { label: 'New', value: 'true' },
                  { label: 'Existing', value: 'false' },
                ])}
              />
            }
          />
          <Controller
            name="generalInformation.infrastructureSector"
            control={control}
            render={({ field: { value, disabled, ...field } }) => {
              let value1 = null;
              if (typeof watch('generalInformation.infrastructureSector') === 'string') {
                value1 = sectorDropdownList?.find((item) => item?.value === watch('generalInformation.infrastructureSector'));
              } else {
                value1 = watch('generalInformation.infrastructureSector');
              }
              return (
                <Autocomplete
                  dropdownList={sectorDropdownList}
                  label="Infrastructure Sector"
                  placeholder="Masukkan Infrastructure Sector"
                  disabled={disabled}
                  isMandatory
                  onChange={(val) => {
                    field.onChange(val);
                    setValue('generalInformation.infrastructureSector', val);
                  }}
                  value={value1}
                  hasDataMaster={findDataMaster('infrastructureSector', sectorDropdownList)}
                />
              );
            }
            }
            disabled={isViewOnly}
          />
          <Controller
            name="generalInformation.defineSector"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Define Sector"
                placeholder="Masukkan Define Sector"
                type="text"
                hasDataMaster={findDataMaster('defineSector')}

              />
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.goPublic"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                isMandatory
                dropdownList={goPublicList}
                label="Go Public"
                placeholder="Choose Go Public"
                type="dropdown"
                hasDataMaster={findDataMaster('goPublic', goPublicList)}
              />
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.debtorType"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={companyType}
                label="BUMN/Swasta"
                placeholder="Choose BUMN/Swasta"
                disabled
                type="dropdown"
                hasDataMaster={findDataMaster('debtorType', companyType)}

              />
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.isRelatedSmi"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={goPublicList}
                hasDataMaster={findDataMaster('isRelatedSmi', goPublicList)}
                label="Pihak Terkait/Tidak"
                placeholder="Choose Pihak Terkait/Tidak"
                type="dropdown"
                isMandatory
              />
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.isGroup"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                dropdownList={goPublicList}
                label="Ada Group"
                placeholder="Choose Ada Group"
                hasDataMaster={findDataMaster('isGroup', goPublicList)}
                type="dropdown"
                isMandatory
              />
            }
            disabled={isViewOnly}
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Alamat Customer" isOpen>
        <Box py={theme.spacing(3)}>
          <Controller
            name="generalInformation.address"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat Kedudukan"
                placeholder="Masukkan Alamat Kedudukan"
                type="area"
                rows={4}
                isMandatory
                hasDataMaster={findDataMaster('address')}
              />
            }
            disabled={isViewOnly}
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
            name="generalInformation.country"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Autocomplete
                  {...field}
                  label="Negara"
                  placeholder="Choose Negara"
                  dropdownList={countryDropdownList}
                  onChange={(val) => { onChange(val); }}
                  value={value}
                  hasDataMaster={findDataMaster('country', countryDropdownList)}
                  isMandatory
                />
              );
            }
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.province"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              let value1 = null;
              if (typeof watch('generalInformation.province') === 'object') {
                value1 = {
                  id: watch('generalInformation.province.value'),
                  label: watch('generalInformation.province.label'),
                };
              } else {
                value1 = provinceDropdownList?.find((item) => item?.value === watch('generalInformation.province'));
              }
              return (
                <Autocomplete
                  {...field}
                  dropdownList={provinceDropdownList}
                  label="Lokasi (Provinsi)"
                  placeholder="Masukkan Lokasi (Provinsi)"
                  onChange={(val) => {
                    onChange(val);
                    setValue('generalInformation.city', null);
                    setValue('generalInformation.district', null);
                    setValue('generalInformation.subDistrict', null);
                  }}
                  value={value1}
                  isMandatory
                  hasDataMaster={findDataMaster('province', provinceDropdownList)}
                />
              );
            }
            }
            disabled={isViewOnly || otherCountry}
          />

          <Controller
            name="generalInformation.city"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              let value1 = null;
              if (typeof watch('generalInformation.city') === 'object') {
                value1 = {
                  id: watch('generalInformation.city.value'),
                  label: watch('generalInformation.city.label'),
                };
              } else {
                value1 = cityDropdownList?.find((item) => item?.value === watch('generalInformation.city'));
              }
              return (
                <Autocomplete
                  {...field}
                  dropdownList={cityDropdownList}
                  label="Lokasi (Kota - Kabupaten)"
                  placeholder="Masukkan Lokasi (Kota - Kabupaten)"
                  onChange={(val) => {
                    onChange(val);
                    setValue('generalInformation.district', null);
                    setValue('generalInformation.subDistrict', null);
                  }}
                  value={value1}
                  hasDataMaster={masterCity}
                  isMandatory
                />
              );
            }
            }
            disabled={isViewOnly || otherCountry}
          />

          <Controller
            name="generalInformation.district"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              let value1 = null;
              if (typeof watch('generalInformation.district') === 'object') {
                value1 = {
                  id: watch('generalInformation.district.value'),
                  label: watch('generalInformation.district.label'),
                };
              } else {
                value1 = districtDropdownList?.find((item) => item?.value === watch('generalInformation.district'));
              }
              return (
                <Autocomplete
                  {...field}
                  dropdownList={districtDropdownList}
                  label="Lokasi (Kecamatan)"
                  placeholder="Masukkan Lokasi (Kecamatan)"
                  onChange={(val) => {
                    onChange(val);
                    setValue('generalInformation.subDistrict', null);
                  }}
                  value={value1}
                  isMandatory
                  hasDataMaster={masterDistrict}
                />
              );
            }
            }
            disabled={isViewOnly || otherCountry}
          />

          <Controller
            name="generalInformation.subDistrict"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              let value1 = null;
              if (typeof watch('generalInformation.subDistrict') === 'object') {
                value1 = {
                  id: watch('generalInformation.subDistrict.value'),
                  label: watch('generalInformation.subDistrict.label'),
                };
              } else {
                value1 = subDistrictDropdownList?.find((item) => item?.value === watch('generalInformation.subDistrict'));
              }
              return (
                <Autocomplete
                  {...field}
                  dropdownList={subDistrictDropdownList}
                  label="Lokasi (Kelurahan)"
                  placeholder="Masukkan Lokasi (Kelurahan)"
                  onChange={(val) => { onChange(val); }}
                  value={value1}
                  isMandatory
                  hasDataMaster={masterSubDistrict}
                />
              );
            }
            }
            disabled={isViewOnly || otherCountry}
          />

          <Controller
            name="generalInformation.postalCode"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Postal Code"
                placeholder="Masukkan Postal Code"
                type="text"

                isMandatory
                hasDataMaster={findDataMaster('postalCode')}

              />
            }
            disabled={isViewOnly || otherCountry}
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Telepon
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <Box display="flex" gap={theme.spacing(2)}>
              <Controller
                name="generalInformation.telephone.areaCode"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Kode"
                    type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                    hasDataMaster={findDataMaster('telephone.areaCode')}
                  />
                }
                disabled={isViewOnly}
              />
              <Controller
                name="generalInformation.telephone.number"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Nomor Telepon"
                    type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                    containerSx={{
                      width: '80%',
                    }}
                    hasDataMaster={findDataMaster('telephone.number')}
                  />
                }
                disabled={isViewOnly}
              />
              <Controller
                name="generalInformation.telephone.ext"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Ext"
                    type="number"
                    hasDataMaster={findDataMaster('telephone.ext')}
                  />
                }
                disabled={isViewOnly}
              />
            </Box>
          </Box>

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Office - Seluler
              </TextStyle>
            </RowWrapper>

            <Box display="flex" gap={theme.spacing(2)}>
              <Controller
                name="generalInformation.officeCellular.areaCode"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Kode"
                    type="dropdown"
                    dropdownList={countryCodeList}
                    containerSx={{
                      width: '70%',
                    }}
                    hasDataMaster={findDataMaster('officeCellular.areaCode')}
                  />
                }
                disabled={isViewOnly}
              />

              <Controller
                name="generalInformation.officeCellular.number"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Office - Seluler"
                    type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                    containerSx={{
                      width: '100%',
                    }}
                    hasDataMaster={findDataMaster('officeCellular.number')}
                  />
                }
                disabled={isViewOnly}
              />

            </Box>
          </Box>

          <Controller
            name="generalInformation.email"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              const _error = error as unknown as { value: { message: string } };
              return (
                <Input
                  {...field}
                  label="Alamat Email"
                  placeholder="Masukkan Alamat Email"
                  type="text"
                  hasDataMaster={findDataMaster('email')}
                  error={!!error}
                  helperText={invalid ? _error?.message : ''}
                />
              );
            }
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.website"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Customer Website"
                placeholder="Masukkan Customer Website"
                regex={null}
                type="text"

                hasDataMaster={findDataMaster('website')}
              />
            }
            disabled={isViewOnly}
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Language & Nationality" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="generalInformation.language"
            control={control}
            render={({ field }) =>
              <MultipleAutoComplete
                {...field}
                withSelectAll={false}
                label="Language"
                dropdownList={languageDropdownList}
                placeholder="Choose Language"
                hasDataMaster={findDataMaster('language', languageDropdownList)}

              />
            }
            disabled={isViewOnly}
          />
          <Controller
            name="generalInformation.nationality"
            control={control}
            render={({ field: { value, onChange, ...field } }) =>
              <Autocomplete
                {...field}
                label="Nationality"
                dropdownList={nationalityDropdownList}
                placeholder="Choose Nationality"
                onChange={(val) => { onChange(val); }}
                value={value}
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('nationality', nationalityDropdownList)}
              />
            }
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Contact Person" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="generalInformation.contactPerson"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Contact Person"
                placeholder="Input Contact Person"
                type="text"
                isMandatory
                hasDataMaster={findDataMaster('contactPerson')}
              />
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.positionContactPerson"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Jabatan Contact Person"
                dropdownList={positionDropdownList}
                placeholder="Input Jabatan Contact Person"
                type="dropdown"
                isMandatory
                hasDataMaster={findDataMaster('positionContactPerson', positionDropdownList)}

              />
            }
            disabled={isViewOnly}
          />

          <Controller
            name="generalInformation.emailContactPerson"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              const _error = error as unknown as { value: { message: string } };
              return (
                <Input
                  {...field}
                  label="Email Contact Person"
                  placeholder="Input Email Contact Person"
                  type="text"
                  hasDataMaster={findDataMaster('emailContactPerson')}
                  error={!!error}
                  helperText={invalid ? _error?.message : ''}
                />
              );
            }
            }
            disabled={isViewOnly}
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Nomor Contact Person - Office
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <Box display="flex" gap={theme.spacing(2)}>
              <Controller
                name="generalInformation.officeCellularContactPerson.areaCode"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Kode"
                    type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                    hasDataMaster={findDataMaster('officeCellularContactPerson.areaCode')}
                  />
                }
                disabled={isViewOnly}
              />
              <Controller
                name="generalInformation.officeCellularContactPerson.number"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Nomor Telepon"
                    type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                    containerSx={{
                      width: '80%',
                    }}
                    hasDataMaster={findDataMaster('officeCellularContactPerson.number')}
                  />
                }
                disabled={isViewOnly}
              />
              <Controller
                name="generalInformation.officeCellularContactPerson.ext"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Ext"
                    type="number"
                    hasDataMaster={findDataMaster('officeCellularContactPerson.ext')}
                  />
                }
                disabled={isViewOnly}
              />
            </Box>
          </Box>

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Nomor Contact Person - Seluler
              </TextStyle>
            </RowWrapper>

            <Box display="flex" gap={theme.spacing(2)}>
              <Controller
                name="generalInformation.cellularContactPerson.areaCode"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Kode"
                    type="dropdown"
                    dropdownList={countryCodeList}
                    containerSx={{
                      width: '70%',
                    }}
                    hasDataMaster={findDataMaster('cellularContactPerson.areaCode')}
                  />
                }
                disabled={isViewOnly}
              />

              <Controller
                name="generalInformation.cellularContactPerson.number"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Office - Seluler"
                    type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                    containerSx={{
                      width: '100%',
                    }}
                    hasDataMaster={findDataMaster('cellularContactPerson.number')}
                  />
                }
                disabled={isViewOnly}
              />

            </Box>
          </Box>

          <Box>
            <RowWrapper mb={1} alignItems="center">
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.custom.gray30}
              >
                Status
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                <Tooltip title="Status customer data di core" placement="right">
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              </TextStyle>
            </RowWrapper>
            <Controller
              name="generalInformation.status"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label=""
                  placeholder="Status"
                  type="text"
                  disabled
                  hasDataMaster={findDataMaster('status')}

                />
              }
              disabled={isViewOnly}
            />
          </Box>

          <Controller
            name="generalInformation.branchCode"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Kode Cabang"
                placeholder="Kode Cabang"
                type="dropdown"
                dropdownList={branchDropdownList}
                isMandatory
                hasDataMaster={findDataMaster('branchCode', branchDropdownList)}

              />
            }
            disabled={isViewOnly}
          />
        </Box>
      </SectionTitle>

      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          name="generalInformation.modifiedBy"
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
          disabled={isViewOnly}
        />

        <Controller
          name="generalInformation.modifiedDate"
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
          disabled={isViewOnly}
        />
      </Box>

      <ActionFooterDetail
        handleSave={handleSave}
        isAutoSaveFetching={isAutoSaveFetching}
        viewOnly={isViewOnly}
        onChange={(value) => {
          if (value) {
            setIsSubmit(value);
            handleSave();
          }
        }}
      />
    </ColumnWrapper>
  );
};

export default GeneralInformation;
