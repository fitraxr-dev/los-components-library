import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';

import {
  overideDropdownList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/RegulatorDataPage/RegulatorData.helper';
import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import TableFacilityInformationSlik from '../TableFacilityInformation';

import { usePenjamin } from './Penjamin.hooks';


const Penjamin = () => {

  const {
    control,
    theme,
    watch,
    setValue,
    handleSave,
    handleBackToListPage,
    isViewOnly,
    gurantorCodeList,
    facilitySegmentList,
    dataOperationList,
    customerClassificationList,
    isValid,
    findDataMaster,
  } = usePenjamin();

  return (
    <ColumnWrapper>

      <TableFacilityInformationSlik />

      <SectionTitle title="Detail Fasilitas Pembiayaan" isOpen>
        <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', py: theme.spacing(3) }}>
          <Controller
            name="facilityAccountNumber"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nomor Rekening Fasilitas"
                placeholder="Nomor Rekening Fasilitas"
                type="text"
                disabled
              />
            }
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

              >
                Jenis Segmen Fasilitas
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
                  name="facilitySegment"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      id="input-facility-segment"
                      disabled={isViewOnly}
                      testId="input-facility-segment"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(facilitySegmentList)}
                      value={{
                        id: watch('facilitySegment') as string,
                        label: watch('facilitySegment') as string,
                      }}
                      onChange={(val: any) => {
                        setValue('facilitySegmentDesc', val.label.split(' | ')[1]);
                        setValue('facilitySegment', val.value);
                      }}
                      hasDataMaster={findDataMaster('facilitySegment')}
                    />
                  }
                />
              </Box>
              <Controller
                name="facilitySegmentDesc"
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
                      disabled
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
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

              >
                Jenis Identitas Penjamin
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
                  name="identityType"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      id="input-identity-type"
                      disabled={isViewOnly}
                      testId="input-identity-type"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(gurantorCodeList)}
                      value={{
                        id: watch('identityType') as string,
                        label: watch('identityType') as string,
                      }}
                      onChange={(val: any) => {
                        setValue('identityTypeDesc', val.label.split(' | ')[1]);
                        setValue('identityType', val.value);
                      }}
                      hasDataMaster={findDataMaster('identityType')}
                    />
                  }
                />
              </Box>
              <Controller
                name="identityTypeDesc"
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
                      disabled
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>

          {watch('identityType') === '9' && (
            <Controller
              name="identityTypeRemark"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Jenis Identitas Penjamin Lainnya"
                  placeholder="Jenis Identitas Penjamin Lainnya"
                  type="area"
                  disabled={isViewOnly}
                  isMandatory
                  rows={4}
                  hasDataMaster={findDataMaster('identityTypeRemark')}
                />
              }
            />
          )}

          <Controller
            name="identityNo"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nomor Identitas Penjamin"
                placeholder="Nomor Identitas Penjamin"
                disabled={isViewOnly}
                type="number"
                hasDataMaster={findDataMaster('identityNo')}
                isMandatory
              />
            }
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Penjamin"
                placeholder="Nama Penjamin"
                type="text"
                disabled={isViewOnly}
                isMandatory
                hasDataMaster={findDataMaster('name')}
              />
            }
          />

          <Controller
            name="fullName"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Nama Lengkap Penjamin"
                placeholder="Nama Lengkap Penjamin"
                type="text"
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('fullName')}
              />
            }
          />

          <Box>
            <RowWrapper mb={1}>
              <TextStyle
                variant="body4"
                weight={600}
                color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

              >
                Golongan
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
                  name="gurantorCode"
                  control={control}
                  render={({ field }) =>
                    <Autocomplete
                      id="input-gurantor-code"
                      disabled={isViewOnly}
                      testId="input-gurantor-code"
                      placeholder="Pilih Kode"
                      dropdownList={overideDropdownList(customerClassificationList)}
                      value={{
                        id: watch('gurantorCode') as string,
                        label: watch('gurantorCode') as string,
                      }}
                      onChange={(val: any) => {
                        setValue('gurantorCodeDesc', val.label.split(' | ')[1]);
                        setValue('gurantorCode', val.value);
                      }}
                      hasDataMaster={findDataMaster('gurantorCode')}
                    />
                  }
                />
              </Box>
              <Controller
                name="gurantorCodeDesc"
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
                      disabled
                      error={!!error}
                      helperText={invalid ? error?.message : ''}
                    />
                  );
                }}
              />
            </RowWrapper>
          </Box>

          <Controller
            name="address"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Alamat Penjamin"
                placeholder="Alamat Penjamin"
                type="text"
                disabled={isViewOnly}
                isMandatory
                hasDataMaster={findDataMaster('address')}
              />
            }
          />

          <Controller
            name="guarantorCoverageLevel"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Persentasi Fasilitas yang Dijamin"
                placeholder="Persentasi Fasilitas yang Dijamin"
                type="number"
                disabled={isViewOnly}
                error={watch('guarantorCoverageLevel') && Number(watch('guarantorCoverageLevel')) <= 0}
                helperText={watch('guarantorCoverageLevel') && Number(watch('guarantorCoverageLevel')) <= 0 ? 'Persentasi Fasilitas yang Dijamin harus diisi lebih dari 0' : ''}
                hasDataMaster={findDataMaster('guarantorCoverageLevel')}
              />
            }
          />


          <Controller
            name="remark"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Keterangan"
                placeholder="Keterangan"
                type="text"
                disabled={isViewOnly}
                hasDataMaster={findDataMaster('remark')}
              />
            }
          />

          <Controller
            name="dataOperation"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Operasi Data"
                placeholder="Operasi Data"
                type="dropdown"
                disabled={isViewOnly}
                dropdownList={dataOperationList}
                isMandatory
                hasDataMaster={findDataMaster('dataOperation')}
              />
            }
          />

          <Controller
            name="branch"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                label="Kode Kantor Cabang"
                placeholder="Kode Kantor Cabang"
                type="text"
                disabled
              />
            }
          />


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
                label="Last Modified Date"
                placeholder="Last Modified Date"
                type="text"
                disabled
                value={field.value ? formatDateTime(field.value) : ''}
              />
            }
          />
        </Box>
      </SectionTitle>

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        <Button onClick={handleBackToListPage} variant="outlined">Close</Button>
        {!isViewOnly && (
          <Button onClick={handleSave}>Save</Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default Penjamin;
