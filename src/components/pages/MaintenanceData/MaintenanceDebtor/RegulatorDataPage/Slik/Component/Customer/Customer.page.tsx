import { Box, Button } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaKeep, formatDate, formatDateTime } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableBusinessGroup from '@/components/shared/SmiTable/TableBusinessGroup';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ActionFooterDetail from '../../../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../../../components/TableDebtorInformationLocal';
import { overideDropdownList } from '../../../RegulatorData.helper';

import { tableHeaderBusinessGroup } from './Customer.constant';
import useCustomer from './Customer.hooks';


const Customer = () => {

  const {
    isDebtor,
    debtorData,
    theme,
    control,
    watch,
    setValue,
    isViewOnly,
    roleCanEdit,
    provinceDropdownList,
    countryCodeList,
    countryDropdownList,
    cityDropdownList,
    districtDropdownList,
    subDistrictDropdownList,
    handleSave,
    legalEntityTypeList,
    economicSectorList,
    relationshipReporterList,
    customerClassificationList,
    ratingRateList,
    isValid,
    isAutoSaveFetching,
    findDataMaster,
    listGroup,
    isLoadingListGroup,
    currentPage,
    setCurrentPage,
    totalPage,
    setTotalPage,
    pageSize,
    setPageSize,
    ratingAgencyList,
    regionCodeDropdownList,
  } = useCustomer();

  const valueAddress = (dropdownList: any, value: any) => {
    if (typeof value === 'object') {
      return {
        id: value?.value,
        label: value?.label,
      };
    } else {
      return dropdownList?.find((item) => item?.value === value);
    }
  };

  return (
    <ColumnWrapper sx={{ paddingY: theme.spacing(3) }}>
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

      <SectionTitle title="Customer Identity" isOpen sx={{ my: theme.spacing(3) }}>
        <Box sx={{ display: 'grid', gap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Controller
            disabled
            name="businessIdentityNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nomor Identitas Badan Usaha"
                placeholder="Input Nomor Identitas Badan Usaha"
              />
            )}
          />
          <Controller
            disabled
            name="businessName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nama Badan Usaha"
                placeholder="Input Nama Badan Usaha"
              />
            )}
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Kode Bentuk Badan Usaha
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="businessType"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        id="input-business-type"
                        disabled={isViewOnly}
                        testId="input-business-type"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(legalEntityTypeList)}
                        value={{
                          id: watch('businessType') as string,
                          label: watch('businessType') as string,
                        }}

                        onChange={(val) => {
                          setValue('businessTypeDesc', val.label.split(' | ')[1]);
                          setValue('businessType', val.value);
                        }}
                        hasDataMaster={findDataMaster('businessType')}
                      />
                    );
                  }
                  }
                />
              </Box>
              <Controller
                disabled
                name="businessTypeDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>

          {watch('businessType') === '99' && (
            <Controller
              name="businessTypeRemark"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Bentuk Badan Usaha Lainnya"
                  placeholder="Masukkan Bentuk Badan Usaha Lainnya"
                  isMandatory
                  disabled={isViewOnly}
                  type="area"
                  rows={4}
                  hasDataMaster={findDataMaster('businessTypeRemark')}
                />
              }
            />
          )}
          <Controller
            disabled
            name="placeOfEstablishment"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  label="Tempat Pendirian"
                  type="text"
                  placeholder="Input Tempat Pendirian"
                />
              );
            }}
          />

          <Controller
            disabled
            name="establishmentDeedNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nomor Akta Pendirian"
                placeholder="Input Nomor Akta Pendirian"
              />
            )}
          />
          <Controller
            disabled
            name="establishmentDeedDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Tanggal Akta Pendirian"
                placeholder="Input Tanggal Akta Pendirian"
                // type="date"
                type="text"
                value={field.value ? formatDate(new Date(field.value)) : ''}
              />
            )}
          />

          <Controller
            disabled
            name="lastAmendmentDeedNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nomor Akta Perubahan Terakhir"
                placeholder="Input Nomor Akta Perubahan Terakhir"
              />
            )}
          />
          <Controller
            disabled
            name="lastAmendmentDeedDate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Tanggal Akta Perubahan Terakhir"
                placeholder="Input Tanggal Akta Perubahan Terakhir"
                value={field.value ? formatDate(new Date(field.value)) : ''}
                type="text"
              />
            )}
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Alamat Customer" isOpen sx={{ my: theme.spacing(3) }}>
        <Box sx={{ pb: theme.spacing(3) }}>
          <Controller
            disabled
            name="address"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat Kedudukan"
                placeholder="Masukkan Alamat Kedudukan"
                type="area"
                rows={4}
              />
            }
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.disabled.main}
              >
                Kode Negara Domisili
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      id="input-country"
                      disabled
                      testId="input-country"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(countryDropdownList)}
                      value={{
                        id: watch('country') as string,
                        label: watch('country') as string,
                      }}
                      onChange={(val) => {
                        setValue('country', val.value);
                      }}
                      hasDataMaster={findDataMaster('country')}
                    />
                  )}
                />
              </Box>
              <Controller
                disabled
                name="countryDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>

          <Controller
            disabled
            name="province"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              const value1 = valueAddress(provinceDropdownList, value);
              return (
                <Autocomplete
                  {...field}
                  dropdownList={provinceDropdownList}
                  label="Lokasi (Provinsi)"
                  placeholder="Masukkan Lokasi (Provinsi)"
                  onChange={(val) => { onChange(val); }}
                  value={value1}
                />
              );
            }
            }
          />

          <Controller
            disabled
            name="city"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              const value1 = valueAddress(cityDropdownList, value);
              return (
                <Autocomplete
                  {...field}
                  dropdownList={cityDropdownList}
                  label="Lokasi (Kota - Kabupaten)"
                  placeholder="Masukkan Lokasi (Kota - Kabupaten)"
                  onChange={(val) => { onChange(val); }}
                  value={value1}
                />
              );
            }
            }
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={!isViewOnly ? theme.palette.text.main : theme.palette.disabled.main}
              >
                Lokasi (Kota - Kabupaten)
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="districtSlik"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        id="input-business-type"
                        disabled={isViewOnly}
                        testId="input-business-type"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(regionCodeDropdownList)}
                        value={{
                          id: watch('districtSlik') as string,
                          label: watch('districtSlik') as string,
                        }}

                        onChange={(val) => {
                          setValue('districtDesc', val.label.split(' | ')[1]);
                          setValue('districtSlik', val.value);
                        }}
                        hasDataMaster={findDataMaster('districtSlik')}
                      />
                    );
                  }
                  }
                />
              </Box>
              <Controller
                disabled
                name="districtDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>

          <Controller
            disabled
            name="district"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              const value1 = valueAddress(districtDropdownList, value);
              return (
                <Autocomplete
                  {...field}
                  dropdownList={districtDropdownList}
                  label="Lokasi (Kecamatan)"
                  placeholder="Masukkan Lokasi (Kecamatan)"
                  onChange={(val) => { onChange(val); }}
                  value={value1}
                />
              );
            }
            }
          />

          <Controller
            disabled
            name="subDistrict"
            control={control}
            render={({ field: { value, onChange, ...field } }) => {
              const value1 = valueAddress(subDistrictDropdownList, value);
              return (
                <Autocomplete
                  {...field}
                  dropdownList={subDistrictDropdownList}
                  label="Lokasi (Kelurahan)"
                  placeholder="Masukkan Lokasi (Kelurahan)"
                  onChange={(val) => { onChange(val); }}
                  value={value1}
                />
              );
            }
            }
          />

          <Controller
            disabled
            name="postalCode"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Postal Code"
                placeholder="Masukkan Postal Code"
                type="text"

              />
            }
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.disabled.main}
              >
                Telepon
              </TextStyle>
            </RowWrapper>
            <Box display="flex" gap={theme.spacing(2)}>
              <Controller
                disabled
                name="telephone.areaCode"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Kode"
                    type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                  />
                }
              />
              <Controller
                disabled
                name="telephone.number"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      label=""
                      placeholder="Nomor Telepon"
                      type={!roleCanEdit || isViewOnly ? 'text' : 'number'}
                      containerSx={{
                        width: '80%',
                      }}
                    />
                  );
                }}
              />
              <Controller
                disabled
                name="telephone.ext"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label=""
                    placeholder="Ext"
                    type="text"
                  />
                }
              />
            </Box>
          </Box>

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.disabled.main}
              >
                Office - Seluler
              </TextStyle>
            </RowWrapper>

            <Box display="flex" gap={theme.spacing(2)}>
              <Controller
                disabled
                name="officeCellular.areaCode"
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
                  />
                }
              />

              <Controller
                disabled
                name="officeCellular.number"
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
                  />
                }
              />

            </Box>
          </Box>

          <Controller
            disabled
            name="email"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              return (
                <Input
                  {...field}
                  label="Alamat Email"
                  placeholder="Masukkan Alamat Email"
                  type="text"
                  error={!!error}
                  helperText={invalid ? error?.message : ''}
                />
              );
            }
            }
          />

        </Box>
      </SectionTitle>

      <SectionTitle title="Profil & Status Customer" isOpen sx={{ my: theme.spacing(3) }}>
        <Box sx={{ display: 'grid', gap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Kode Bidang Usaha
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="businessField"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      disabled={isViewOnly}
                      id="input-business-field"
                      testId="input-business-field"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(economicSectorList)}
                      value={{
                        id: field.value as string,
                        label: field.value as string,
                      }}
                      onChange={(val) => {
                        setValue('businessFieldDesc', val.label.split(' | ')[1]);
                        setValue('businessField', val.value);
                      }}
                      hasDataMaster={findDataMaster('businessField')}
                    />
                  }
                />
              </Box>
              <Controller
                disabled
                name="businessFieldDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>
          {watch('businessField') === '009000' && (
            <Controller
              name="businessFieldRemark"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Bidang Usaha Lainnya"
                  placeholder="Masukkan Bidang Usaha Lainnya"
                  disabled={isViewOnly}
                  isMandatory
                  type="area"
                  rows={4}
                  hasDataMaster={findDataMaster('businessFieldRemark')}
                />
              }
            />
          )}


          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Kode Hubungan dengan Pelapor
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="relationWithReporter"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      disabled={isViewOnly}
                      id="input-relation-with-reporter"
                      testId="input-relation-with-reporter"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(relationshipReporterList)}
                      value={{
                        id: field.value as string,
                        label: field.value as string,
                      }}
                      onChange={(val) => {
                        setValue('relationWithReporterDesc', val.label.split(' | ')[1]);
                        setValue('relationWithReporter', val.value);
                      }}
                      hasDataMaster={findDataMaster('relationWithReporter')}
                    />
                  }
                />
              </Box>
              <Controller
                disabled
                name="relationWithReporterDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>

          {watch('businessField') === '009000' ? (
            <Box sx={{ display: 'grid', gap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Controller
                disabled
                name="isExceedBMPK"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Melampaui BMPK / BMPD / BMPP"
                    type="radio"
                    radioList={[
                      { label: 'Ya', value: 'true' },
                      { label: 'Tidak', value: 'false' },
                    ]}
                  />
                }
              />

              <Controller
                disabled
                name="isGoPublic"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Go Public"
                    type="radio"
                    radioList={[
                      { label: 'Ya', value: 'true' },
                      { label: 'Tidak', value: 'false' },
                    ]}
                  />
                }
              />
            </Box>
          )
            : (
              < >
                <Controller
                  disabled
                  name="isExceedBMPK"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label="Melampaui BMPK / BMPD / BMPP"
                      type="radio"
                      radioList={[
                        { label: 'Ya', value: 'true' },
                        { label: 'Tidak', value: 'false' },
                      ]}
                    />
                  }
                />

                <Controller
                  disabled
                  name="isGoPublic"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label="Go Public"
                      type="radio"
                      radioList={[
                        { label: 'Ya', value: 'true' },
                        { label: 'Tidak', value: 'false' },
                      ]}
                    />
                  }
                />
              </>
            )}

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Golongan Customer
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="customerGroup"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      disabled={isViewOnly}
                      id="input-customer-group"
                      testId="input-customer-group"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(customerClassificationList)}
                      value={{
                        id: field.value as string,
                        label: field.value as string,
                      }}
                      onChange={(val) => {
                        setValue('customerGroupDesc', val.label.split(' | ')[1]);
                        setValue('customerGroup', val.value);
                      }}
                      hasDataMaster={findDataMaster('customerGroup')}
                    />
                  }
                />
              </Box>
              <Controller
                disabled
                name="customerGroupDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>

          <Controller
            name="branchCode"
            control={control}
            render={({ field }) =>
              <Autocomplete
                id="input-branch-code"
                disabled
                testId="input-branch-code"
                label="Kode Kantor Cabang"
                placeholder="Pilih Kode Kantor Cabang"
                dropdownList={[]}
                value={{
                  id: field.value as string,
                  label: field.value as string,
                }}
                onChange={() => { }}
              />
            }
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Customer Rating" isOpen sx={{ my: theme.spacing(3) }}>
        <Box sx={{ display: 'grid', gap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)', pb: theme.spacing(3) }}>

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Peringkat atau Rating Customer
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="customerRating"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      disabled={isViewOnly}
                      id="input-customer-rating"
                      testId="input-customer-rating"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(ratingRateList)}
                      value={{
                        id: field.value as string,
                        label: field.value as string,
                      }}
                      onChange={(val) => {
                        setValue('customerRatingDesc', val.label.split(' | ')[1]);
                        setValue('customerRating', val.value);
                      }}
                      hasDataMaster={findDataMaster('customerRating')}
                    />
                  }
                />
              </Box>
              <Controller
                disabled
                name="customerRatingDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>


          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.custom.text}
              >
                Lembaga Pemeringkat atau Rating
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                *
              </TextStyle>
            </RowWrapper>
            <RowWrapper gap={1}>
              <Box sx={{ width: '40%' }}>
                <Controller
                  name="ratingAgency"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      disabled={isViewOnly}
                      id="input-rating-agency"
                      testId="input-rating-agency"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(ratingAgencyList)}
                      value={{
                        id: field.value as string,
                        label: field.value as string,
                      }}
                      onChange={(val) => {
                        setValue('ratingAgencyDesc', val.label.split(' | ')[1]);
                        setValue('ratingAgency', val.value);
                      }}
                      hasDataMaster={findDataMaster('ratingAgency')}
                    />
                  }
                />
              </Box>
              <Controller
                disabled
                name="ratingAgencyDesc"
                control={control}
                render={({ field, fieldState: { error, invalid } }) => {
                  return (
                    <Input
                      {...field}
                      containerSx={{
                        width: '60%',
                      }}
                      placeholder="Deskripsi"
                      type="area"
                      rows={6}
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>
          <Controller
            name="ratingDate"
            control={control}
            render={({ field: { onChange, ...field } }) =>
              <Input
                {...field}
                disabled={isViewOnly}
                label="Tanggal Rating"
                required
                placeholder="Tanggal Rating"
                onChange={(val) => onChange(dayJsJakartaKeep(val))}
                type="date"
                isMandatory={!!watch('customerRating')}
                hasDataMaster={findDataMaster('ratingDate')}
              />
            }
          />
        </Box>
      </SectionTitle>
      {/* <TableBusinessGroup
        module={TypeModule.MAINTENANCE_DATA}
        process={TypeProcess.MAINTENANCE_CUSTOMER}
        debtorOnly={isDebtor}
      /> */}
      <SectionTitle title="Group Usaha" isOpen>
        <BaseContainer>
          <Table
            tableHeader={tableHeaderBusinessGroup}
            tableData={listGroup?.data?.contents}
            isLoading={isLoadingListGroup}
            totalPage={totalPage}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </SectionTitle>
      <Box sx={{ display: 'grid', gap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)', py: theme.spacing(3) }}>
        <Controller
          disabled
          name="modifiedBy"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Modified By"
              disabled
            />
          }
        />
        <Controller
          disabled
          name="modifiedDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Last Modified"
              disabled
              value={field.value ? formatDateTime(field.value) : null}
            />
          }
        />
      </Box>
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <ActionFooterDetail
          handleSave={() => handleSave(false)}
          isAutoSaveFetching={isAutoSaveFetching}
          viewOnly={isViewOnly}
          onChange={(value) => {
            if (value) {
              handleSave(value);
            }
          }}
        />
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default Customer;
