import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { EthnicOriginLOV, JobPositionLOV } from '@/configs/constants/lov';
import { dayJsJakartaKeep, formatDate, formatDateTime } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ActionFooterDetail from '../../../../components/ActionFooterDetail/ActionFooterDetail';
import { overideDropdownList } from '../../../RegulatorData.helper';

import useManagement from './Management.hooks';


const ManagementPage = () => {

  const {
    theme,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    tableHeader,
    totalPage,
    currentPage,
    setCurrentPage,
    setPageSize,
    activeDetail,
    control,
    setValue,
    isViewOnly,
    provinceDropdownList,
    countryDropdownList,
    cityDropdownList,
    districtDropdownList,
    subDistrictDropdownList,
    slikManagementData,
    operationDataList,
    regionCodeDropdownList,
    isValid,
    isLoading,
    handleSaveDetailManagement,
    statusDropdownList,
    titleDropdownList,
    genderDropdownList,
    idTypeDropdownList,
    nationalityDropDownList,
    watch,
    findDataMaster,
    anomalyRowStyle,
  } = useManagement();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Box width="45vw">
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
      </Box>
      <Table
        tableHeader={tableHeader}
        tableData={slikManagementData || []}
        isLoading={isLoading}
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        anomalyRow={anomalyRowStyle}
      />
      {activeDetail && (
        <>
          <SectionTitle title="Detail Management" isOpen sx={{ my: theme.spacing(3) }} >
            <Box sx={{ display: 'grid', gap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <Controller
                control={control}
                name="managementCode"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    disabled
                    label="ID Ref. Management"
                    placeholder="ID Ref. Management"
                  />
                )}
              />
              <Box>
                <RowWrapper mb={1}>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.disabled.main}
                  >
                    Status Pengurus
                  </TextStyle>
                </RowWrapper>
                <RowWrapper gap={1}>
                  <Box sx={{ width: '40%' }}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Autocomplete
                            id="input-status"
                            disabled
                            testId="input-status"
                            placeholder="Pilih Kode"
                            dropdownList={overideDropdownList(statusDropdownList)}
                            value={{
                              id: watch('status') as string,
                              label: watch('status') as string,
                            }}

                            onChange={(val) => {
                              setValue('statusDesc', val.label.split(' | ')[1]);
                              setValue('status', val.value);
                            }}
                            hasDataMaster={findDataMaster('status')}
                          />
                        );
                      }
                      }
                    />
                  </Box>
                  <Controller
                    disabled
                    name="statusDesc"
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
                control={control}
                name="title"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled
                    type="dropdown"
                    dropdownList={titleDropdownList}
                    label="Title"
                    placeholder="Title"
                  />
                )}
              />
              <Box>
                <RowWrapper mb={1}>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.disabled.main}
                  >
                    Nama Pengurus
                  </TextStyle>
                </RowWrapper>
                {(watch('suffix') !== null) && (watch('prefix') !== null) ?
                  <RowWrapper gap={1}>
                    <Controller
                      name="prefix"
                      control={control}
                      render={({ field }) =>
                        <Input
                          containerSx={{
                            width: '20%',
                          }}
                          {...field}
                          placeholder="Input Gelar"
                          type="text"
                          disabled
                        />
                      }
                    />
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState: { error, invalid } }) => {
                        return (
                          <Input
                            {...field}
                            containerSx={{
                              width: '60%',
                            }}
                            placeholder="Nama Pengurus"
                            type="text"
                            disabled
                            error={!!error}
                            helperText={invalid ? error?.message : ''}
                          />
                        );
                      }}
                    />
                    <Controller
                      name="suffix"
                      control={control}
                      render={({ field }) =>
                        <Input
                          {...field}
                          containerSx={{
                            width: '20%',
                          }}
                          placeholder="Input Gelar"
                          type="text"
                          disabled
                        />
                      }
                    />

                  </RowWrapper>
                  :
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled
                        type="text"
                        label="Nama Manajemen"
                        placeholder="Nama Manajemen"
                      />
                    )}
                  />
                }
              </Box>

              <Controller
                control={control}
                name="placeOfBirth"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled
                    type="text"
                    label="Place of Birth"
                    placeholder="Place of Birth"
                  />
                )}
              />
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ? formatDate(field.value) : ''}
                    type="text"
                    disabled
                    label="DOB"
                    placeholder="DOB"
                  />
                )}
              />
              <Controller
                control={control}
                name="personInCharge"
                render={({ field }) => (
                  <Input
                    {...field}
                    disabled
                    type="dropdown"
                    dropdownList={[
                      { label: 'Yes', value: 'true' },
                      { label: 'No', value: 'false' },
                    ]}
                    label="Person in Charge"
                    placeholder="Person in Charge"
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
                    Kode Jabatan
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
                      name="jobPositionSlik"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Autocomplete
                            id="input-job-position"
                            disabled={isViewOnly}
                            testId="input-job-position"
                            placeholder="Pilih Kode"
                            dropdownList={overideDropdownList(JobPositionLOV())}
                            value={{
                              id: watch('jobPositionSlik') as string,
                              label: watch('jobPositionSlik') as string,
                            }}

                            onChange={(val) => {
                              setValue('jobPositionDesc', val.label.split(' | ')[1]);
                              setValue('jobPositionSlik', val.value);
                            }}
                            hasDataMaster={findDataMaster('jobPositionSlik')}
                          />
                        );
                      }
                      }
                    />
                  </Box>
                  <Controller
                    disabled
                    name="jobPositionDesc"
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
                control={control}
                name="gender"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Gender"
                    disabled
                    label="Gender"
                    type="dropdown"
                    dropdownList={genderDropdownList}
                  />
                )}
              />
              <Controller
                control={control}
                name="ethnicOrigin"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="dropdown"
                    dropdownList={EthnicOriginLOV()}
                    placeholder="Ethnic Origin"
                    disabled
                    label="Ethnic Origin"
                  />
                )}
              />
              <Controller
                control={control}
                name="ownershipShare"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Pangsa Kepemilikan (%)"
                    label="Pangsa Kepemilikan (%)"
                    isMandatory
                    disabled={isViewOnly}
                    value={field.value}
                    isAllowed={(values) => {
                      const { formattedValue, floatValue } = values;
                      return (
                        formattedValue === '' ||
                        (floatValue > 0 && floatValue <= 100)
                      );
                    }}
                    hasDataMaster={findDataMaster('ownershipShare')}
                  />
                )}
              />
            </Box>
          </SectionTitle>

          <SectionTitle title="Dokumen Management" isOpen sx={{ my: theme.spacing(3) }} >
            <Box sx={{ display: 'grid', gap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)' }}>

              <Box>
                <RowWrapper mb={1}>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.disabled.main}
                  >
                    Kode Jenis Identitas Pengurus
                  </TextStyle>
                </RowWrapper>
                <RowWrapper gap={1}>
                  <Box sx={{ width: '40%' }}>
                    <Controller
                      name="idType"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Autocomplete
                            id="input-id-type"
                            disabled
                            testId="input-id-type"
                            placeholder="Pilih Kode"
                            dropdownList={overideDropdownList(idTypeDropdownList)}
                            value={{
                              id: watch('idType') as string,
                              label: watch('idType') as string,
                            }}

                            onChange={(val) => {
                              setValue('idTypeDesc', val.label.split(' | ')[1]);
                              setValue('idType', val.value);
                            }}
                            hasDataMaster={findDataMaster('idType')}
                          />
                        );
                      }
                      }
                    />
                  </Box>
                  <Controller
                    disabled
                    name="idTypeDesc"
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
                control={control}
                name="identityExpiry"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    label="Identity Expiry"
                    value={field.value ? dayJsJakartaKeep(field.value) : ''}
                    disabled
                    placeholder="Identity Expiry"
                  />
                )}
              />
              <Controller
                control={control}
                name="idNo"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    label="Nomor Identitas Pengurus"
                    disabled
                    placeholder="Nomor Identitas Pengurus"
                  />
                )}
              />
              <Controller
                control={control}
                name="idDocument"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="file"
                    label="Upload ID"
                    downloadOnly
                    showPreviewFile
                    placeholder="Upload ID"
                  />
                )}
              />
              <Controller
                control={control}
                name="npwp"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    type="npwp"
                    maxLength={16}
                    label="NPWP"
                    disabled
                    placeholder="NPWP"
                    error={!!error}
                    helperText={error?.message || ''}
                  />
                )}
              />
              <Controller
                control={control}
                name="npwpDocument"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="file"
                    label="Upload NPWP"
                    placeholder="Upload NPWP"
                    showPreviewFile
                    downloadOnly
                  />
                )}
              />
            </Box>

          </SectionTitle>

          <SectionTitle title="Alamat Management" isOpen sx={{ my: theme.spacing(3) }}>
            <Box sx={{ pb: theme.spacing(3) }}>
              <Controller
                name="address"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Alamat Kedudukan"
                    placeholder="Masukkan Alamat Kedudukan"
                    type="area"
                    rows={4}
                    disabled
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
                      render={({ field }) => {
                        return (
                          <Autocomplete
                            id="input-country"
                            disabled
                            testId="input-country"
                            placeholder="Pilih Kode"
                            dropdownList={overideDropdownList(nationalityDropDownList)}
                            value={{
                              id: watch('country') as string,
                              label: watch('country') as string,
                            }}

                            onChange={(val) => {
                              setValue('countryDesc', val.label.split(' | ')[1]);
                              setValue('country', val.value);
                            }}
                            hasDataMaster={findDataMaster('country')}
                          />
                        );
                      }
                      }
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
                name="province"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      type="dropdown"
                      dropdownList={provinceDropdownList}
                      label="Lokasi (Provinsi)"
                      placeholder="Masukkan Lokasi (Provinsi)"
                      disabled
                    />
                  );
                }
                }
              />

              <Controller
                name="district"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      type="dropdown"
                      dropdownList={cityDropdownList}
                      label="Lokasi (Kota - Kabupaten)"
                      placeholder="Masukkan Lokasi (Kota - Kabupaten)"
                      // value={value1.id}
                      disabled
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
                name="subDistrict"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      type="dropdown"
                      dropdownList={districtDropdownList}
                      label="Lokasi (Kecamatan)"
                      placeholder="Masukkan Lokasi (Kecamatan)"
                      disabled
                    />
                  );
                }
                }
              />

              <Controller
                name="village"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="dropdown"
                      {...field}
                      dropdownList={subDistrictDropdownList}
                      label="Lokasi (Kelurahan)"
                      placeholder="Masukkan Lokasi (Kelurahan)"
                      // value={value}
                      disabled
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
                    placeholder="Masukkan Postal Code"
                    type="text"
                    disabled
                  />
                }
              />


            </Box>
          </SectionTitle>
          <Box sx={{ display: 'grid', gap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)', py: theme.spacing(3) }}>

            <Controller
              control={control}
              name="branch"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Kode Kantor Cabang"
                  placeholder="Kode Kantor Cabang"
                  disabled
                  type="text"
                />
              )}
            />

            <Controller
              name="operationData"
              control={control}
              render={({ field }) =>
                <Input
                  containerSx={{
                    width: '100%',
                  }}
                  {...field}
                  placeholder="Pilih Operasi Data"
                  label="Operasi Data"
                  type="dropdown"
                  disabled={isViewOnly}
                  dropdownList={operationDataList}
                  onChange={(val) => {
                    setValue('operationData', val);
                  }}
                  hasDataMaster={findDataMaster('operationData')}
                />
              }
            />
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
          <RowWrapper justifyContent="end">
            <ActionFooterDetail
              handleSave={() => handleSaveDetailManagement(false)}
              viewOnly={!isViewOnly}
              onChange={(value) => {
                if (value) {
                  handleSaveDetailManagement(value);
                }
              }}
            />
          </RowWrapper>
        </>

      )}

      {!activeDetail && (
        <RowWrapper justifyContent="end">
          <ActionFooterDetail />
        </RowWrapper>
      )}
    </ColumnWrapper>
  );
};

export default ManagementPage;
