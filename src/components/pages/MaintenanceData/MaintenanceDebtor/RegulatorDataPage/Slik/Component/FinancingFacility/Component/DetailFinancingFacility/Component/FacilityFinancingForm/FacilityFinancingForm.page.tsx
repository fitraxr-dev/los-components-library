import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CurrencyLOV } from '@/configs/constants/lov';
import { formatDate, formatDateTime } from '@/helpers/date';

import {
  overideDropdownList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/RegulatorDataPage/RegulatorData.helper';
import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import TableFacilityInformationSlik from '../TableFacilityInformation';

import { useFacilityFinancingForm } from './FacilityFinancingForm.hooks';


const FacilityFinancingForm = () => {

  const {
    control,
    theme,
    creditFinancingnatureList,
    creditFinancingtypeList,
    creditFinancingcontractList,
    customerCategoryList,
    typeOfUsageList,
    orieantationOfusageList,
    economicSectorList,
    regionCodeList,
    valutaList,
    financingRateList,
    govProgramInterestRateList,
    creditQualityList,
    defaultResonList,
    restructureMethodeList,
    conditionList,
    customerClassificationList,
    watch,
    isViewOnly,
    setValue,
    handleOnSave,
    isValid,
    handleBackToListPage,
    findDataMaster,
  } = useFacilityFinancingForm();

  return (
    <>
      <ColumnWrapper>

        <TableFacilityInformationSlik />

        <SectionTitle title="Detail Fasilitas Pembiayaan" isOpen sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', py: theme.spacing(3) }}>
            <Controller
              name="facilityAccountNumber"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  // error={!!error}
                  {...field}
                  label="Nomor Rekening Fasilitas"
                  placeholder="Nomor Rekening Fasilitas"
                  disabled
                  // helperText={invalid ? error?.message : ''}
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
                  Kode Sifat Kredit atau Pembiayaan
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
                    name="creditFinancingNature"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-credit-financing-nature"
                        disabled={isViewOnly}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                        testId="input-credit-financing-nature"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(creditFinancingnatureList)}
                        value={{
                          id: watch('creditFinancingNature') as string,
                          label: watch('creditFinancingNature') as string,
                        }}
                        onChange={(val: any) => {
                          setValue('creditFinancingNatureDesc', val.label.split(' | ')[1]);
                          setValue('creditFinancingNature', val.value);
                        }}
                        hasDataMaster={findDataMaster('creditFinancingNature')}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="creditFinancingNatureDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            {watch('creditFinancingNature') === '9' && (
              <Controller
                name="creditFinancingNatureRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Sifat Kredit atau Pembiayaan Lainnya"
                    placeholder="Sifat Kredit atau Pembiayaan Lainnya"
                    isMandatory
                    disabled={isViewOnly}
                    type="area"
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('creditFinancingNatureRemark')}
                  />
                }
              />
            )}

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

                >
                  Kode Jenis Kredit atau Pembiayaan
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
                    name="creditFinancingType"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-credit-financing-type"
                        disabled={isViewOnly}
                        // error={!!error}
                        testId="input-credit-financing-type"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(creditFinancingtypeList)}
                        value={{
                          id: watch('creditFinancingType') as string,
                          label: watch('creditFinancingType') as string,
                        }}

                        onChange={(val) => {
                          setValue('creditFinancingTypeDesc', val.label.split(' | ')[1]);
                          setValue('creditFinancingType', val.value);
                        }}
                        hasDataMaster={findDataMaster('creditFinancingType')}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="creditFinancingTypeDesc"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) => {
                    return (
                      <Input
                        {...field}
                        containerSx={{
                          width: '60%',
                        }}
                        placeholder="Deskripsi"
                        disabled
                        type="area"
                        rows={6}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            {(watch('creditFinancingType') === 'P99' || watch('creditFinancingType') === 'N99') && (
              <Controller
                name="creditFinancingTypeRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Jenis Kredit atau Pembiayaan Lainnya"
                    placeholder="Jenis Kredit atau Pembiayaan Lainnya"
                    isMandatory
                    disabled={isViewOnly}
                    type="area"
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('creditFinancingTypeRemark')}
                  />
                }
              />
            )}


            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

                >
                  Kode Akad Kredit atau Pembiayaan
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
                    name="creditFinancingContract"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-credit-financing-contract"
                        disabled={isViewOnly}
                        // error={!!error}
                        testId="input-credit-financing-contract"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(creditFinancingcontractList)}
                        value={{
                          id: watch('creditFinancingContract') as string,
                          label: watch('creditFinancingContract') as string,
                        }}

                        onChange={(val) => {
                          setValue('creditFinancingContractDesc', val.label.split(' | ')[1]);
                          setValue('creditFinancingContract', val.value);
                        }}
                        hasDataMaster={findDataMaster('creditFinancingContract')}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="creditFinancingContractDesc"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) => {
                    return (
                      <Input
                        {...field}
                        containerSx={{
                          width: '60%',
                        }}
                        placeholder="Deskripsi"
                        disabled
                        type="area"
                        rows={6}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            {watch('creditFinancingContract') === '999' && (
              <Controller
                name="creditFinancingContractRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Akad Kredit atau Pembiayaan Lainnya"
                    placeholder="Akad Kredit atau Pembiayaan Lainnya"
                    isMandatory
                    disabled={isViewOnly}
                    type="area"
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('creditFinancingContractRemark')}
                  />
                }
              />
            )}

            <Controller
              name="initialContractNo"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  disabled
                  label="Nomor Akad Awal"
                  placeholder="Nomor Akad Awal"
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="initialContractDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  disabled
                  label="Tanggal Akad Awal"
                  placeholder="Tanggal Akad Awal"
                  value={field?.value ? formatDate(field?.value) : ''}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="finalContractNo"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  disabled
                  label="Nomor Akad Akhir"
                  placeholder="Nomor Akad Akhir"
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="finalContractDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  disabled
                  label="Tanggal Akad Akhir"
                  placeholder="Tanggal Akad Akhir"
                  value={field?.value ? formatDate(field?.value) : ''}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />
          </Box>
        </SectionTitle>


        <SectionTitle title="Periode Status" isOpen sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', py: theme.spacing(3) }}>
            <Controller
              name="renewalFrequency"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Frekuensi Perpanjangan Fasilitas Kredit dan Pembiayaan"
                  type="number"
                  placeholder="Frekuensi Perpanjangan Fasilitas Kredit dan Pembiayaan"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('renewalFrequency')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />
            <Controller
              name="loanStartDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Tanggal Awal Kredit atau Pembiayaan"
                  placeholder="Tanggal Awal Kredit atau Pembiayaan"
                  maxDate={new Date().toISOString()}
                  type="date"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('loanStartDate')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />
            <Controller
              name="initialLoanStartDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Tanggal Mulai"
                  placeholder="Tanggal Mulai"
                  maxDate={new Date().toISOString()}
                  type="date"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('initialLoanStartDate')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />
            <Controller
              name="maturityDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Tanggal Jatuh Tempo"
                  placeholder="Tanggal Jatuh Tempo"
                  type="date"
                  disabled
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
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
                  Kode Kategori Customer
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
                    name="customerCategory"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-customer-category"
                        disabled={isViewOnly}
                        testId="input-customer-category"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(customerCategoryList)}
                        value={{
                          id: watch('customerCategory') as string,
                          label: watch('customerCategory') as string,
                        }}

                        onChange={(val) => {
                          setValue('customerCategoryDesc', val.label.split(' | ')[1]);
                          setValue('customerCategory', val.value);
                        }}
                        hasDataMaster={findDataMaster('customerCategory')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="customerCategoryDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
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
                  Kode Jenis Pengguna
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
                    name="typeOfUsage"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-type-of-usage"
                        disabled={isViewOnly}
                        testId="input-type-of-usage"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(typeOfUsageList)}
                        value={{
                          id: watch('typeOfUsage') as string,
                          label: watch('typeOfUsage') as string,
                        }}

                        onChange={(val) => {
                          setValue('typeOfUsageDesc', val.label.split(' | ')[1]);
                          setValue('typeOfUsage', val.value);
                        }}
                        hasDataMaster={findDataMaster('typeOfUsage')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="typeOfUsageDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
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
                  Kode Orientasi Pengguna
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
                    name="orientationOfUsage"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-orientation-of-usage"
                        disabled={isViewOnly}
                        testId="input-orientation-of-usage"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(orieantationOfusageList)}
                        value={{
                          id: watch('orientationOfUsage') as string,
                          label: watch('orientationOfUsage') as string,
                        }}

                        onChange={(val) => {
                          setValue('orientationOfUsageDesc', val.label.split(' | ')[1]);
                          setValue('orientationOfUsage', val.value);
                        }}
                        hasDataMaster={findDataMaster('orientationOfUsage')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="orientationOfUsageDesc"
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
                        disabled
                        rows={6}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            {watch('orientationOfUsage') === '3' && (
              <Controller
                name="orientationOfUsageRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Orientasi Penggunaan Lainnya"
                    placeholder="Orientasi Penggunaan Lainnya"
                    isMandatory
                    disabled={isViewOnly}
                    type="area"
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('orientationOfUsageRemark')}
                  />
                }
              />
            )}

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

                >
                  Kode Sektor Ekonomi
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
                    name="economicSector"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-economic-sector"
                        disabled={isViewOnly}
                        testId="input-economic-sector"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(economicSectorList)}
                        value={{
                          id: watch('economicSector') as string,
                          label: watch('economicSector') as string,
                        }}

                        onChange={(val) => {
                          setValue('economicSectorDesc', val.label.split(' | ')[1]);
                          setValue('economicSector', val.value);
                        }}
                        hasDataMaster={findDataMaster('economicSector')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="economicSectorDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            {watch('economicSector') === '009000' && (
              <Controller
                name="economicSectorRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Sektor Ekonomi Lapangan Usaha Lainnya"
                    placeholder="Sektor Ekonomi Lapangan Usaha Lainnya"
                    isMandatory
                    disabled={isViewOnly}
                    type="area"
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('economicSectorRemark')}
                  />
                }
              />
            )}

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

                >
                  Kode Kabupaten
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
                    name="regionCode"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-region-code"
                        disabled={isViewOnly}
                        testId="input-region-code"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(regionCodeList)}
                        value={{
                          id: watch('regionCode') as string,
                          label: watch('regionCode') as string,
                        }}

                        onChange={(val) => {
                          setValue('regionCodeDesc', val.label.split(' | ')[1]);
                          setValue('regionCode', val.value);
                        }}
                        hasDataMaster={findDataMaster('regionCode')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="regionCodeDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>
            {watch('regionCode') === '0000' && (
              <Controller
                name="regionCodeRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Lokasi Proyek Lainnya"
                    placeholder="Lokasi Proyek Lainnya"
                    isMandatory
                    disabled={isViewOnly}
                    type="area"
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('regionCodeRemark')}
                  />
                }
              />
            )}
          </Box>
        </SectionTitle>

        <SectionTitle title="Valuta & Nilai" isOpen sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', py: theme.spacing(3) }}>

            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

                >
                  Valuta
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
                    name="valuta"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-valuta"
                        disabled={isViewOnly}
                        testId="input-valuta"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(valutaList)}
                        value={{
                          id: watch('valuta') as string,
                          label: watch('valuta') as string,
                        }}

                        onChange={(val) => {
                          setValue('valutaDesc', val.label.split(' | ')[1]);
                          setValue('valuta', val.value);
                        }}
                        hasDataMaster={findDataMaster('valuta')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="valutaDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
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
                  Jenis Suku Bunga atau Imbalan
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
                    name="financingRateType"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-financing-rate-type"
                        disabled={isViewOnly}
                        testId="input-financing-rate-type"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(financingRateList)}
                        value={{
                          id: watch('financingRateType') as string,
                          label: watch('financingRateType') as string,
                        }}

                        onChange={(val) => {
                          setValue('financingRateTypeDesc', val.label.split(' | ')[1]);
                          setValue('financingRateType', val.value);
                        }}
                        hasDataMaster={findDataMaster('financingRateType')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="financingRateTypeDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            {watch('financingRateType') === '9' && (
              <Controller
                name="financingRateTypeRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Jenis Suku Bunga / Imbalan Lainnya"
                    placeholder="Jenis Suku Bunga / Imbalan Lainnya"
                    isMandatory
                    type="area"
                    disabled={isViewOnly}
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('financingRateTypeRemark')}
                  />
                }
              />
            )}

            <Controller
              name="financingRate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Suku Bunga atau Imbalan (%)"
                  placeholder="Suku Bunga atau Imbalan (%)"
                  type="number"
                  isMandatory
                  disabled={isViewOnly}
                  isAllowed={(value) => {
                    const { floatValue } = value;
                    return (
                      (floatValue <= 100 && floatValue >= 0) || floatValue === null || floatValue === undefined
                    );
                  }}
                  hasDataMaster={findDataMaster('financingRate')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
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
                  Kode Kredit atau Pembiayaan Program Pemerintah
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
                    name="govermentRate"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-goverment-rate"
                        disabled={isViewOnly}
                        testId="input-goverment-rate"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(govProgramInterestRateList)}
                        value={{
                          id: watch('govermentRate') as string,
                          label: watch('govermentRate') as string,
                        }}

                        onChange={(val) => {
                          setValue('govermentRateDesc', val.label.split(' | ')[1]);
                          setValue('govermentRate', val.value);
                        }}
                        hasDataMaster={findDataMaster('govermentRate')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="govermentRateDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            <Controller
              name="takeoverSource"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Kode Asal Kredit atau Pembiayaan Takeover"
                  placeholder="Kode Asal Kredit atau Pembiayaan Takeover"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('takeoverSource')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
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
                  Sumber Dana
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
                    name="customerClasification"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-customer-classification"
                        disabled={isViewOnly}
                        testId="input-customer-classification"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(customerClassificationList)}
                        value={{
                          id: watch('customerClasification') as string,
                          label: watch('customerClasification') as string,
                        }}

                        onChange={(val) => {
                          setValue('customerClasificationDesc', val.label.split(' | ')[1]);
                          setValue('customerClasification', val.value);
                        }}
                        hasDataMaster={findDataMaster('customerClasification')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="customerClasificationDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            <Controller
              name="firstPlafond"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Currency
                  {...field}
                  label="Plafon Awal"
                  placeholder="Plafon Awal"
                  disabled={isViewOnly}
                  disabledCurrency
                  currencyList={[{
                    label: 'IDR',
                    value: 'IDR',
                  }]}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                  value={{
                    currency: 'IDR',
                    value: watch('firstPlafond') as string,
                  }}
                  onChange={(val) => {
                    setValue('firstPlafond', val.value);
                    console.log(val);
                  }}
                  hasDataMaster={findDataMaster('firstPlafond')}
                />
              }
            />

            <Controller
              name="plafon"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Currency
                  {...field}
                  label="Plafon"
                  placeholder="Plafon"
                  isMandatory
                  disabled={isViewOnly}
                  disabledCurrency
                  currencyList={[{ label: 'IDR', value: 'IDR' }]}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                  value={{
                    currency: 'IDR',
                    value: watch('plafon') as string,
                  }}
                  onChange={(val) => {
                    setValue('plafon', val.value);
                    console.log(val);
                  }}
                  hasDataMaster={findDataMaster('plafon')}
                />
              }
            />

            <Controller
              name="realitationValue"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Realisasi atau Pencairan Bulan Berjalan"
                  placeholder="Realisasi atau Pencairan Bulan Berjalan"
                  isMandatory
                  type="number"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('realitationValue')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="penaltyEt"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Currency
                  {...field}
                  label="Denda"
                  placeholder="Denda"
                  disabled={isViewOnly}
                  disabledCurrency
                  currencyList={[{
                    label: 'IDR',
                    value: 'IDR',
                  }]}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                  value={{
                    currency: 'IDR',
                    value: watch('penaltyEt') as string,
                  }}
                  onChange={(val) => {
                    setValue('penaltyEt', val.value);
                    console.log(val);
                  }}
                  hasDataMaster={findDataMaster('penaltyEt')}
                  isMandatory
                />
              }
            />

            <Controller
              name="osPrincipal"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Currency
                  {...field}
                  label="Baki Debet"
                  placeholder="Baki Debet"
                  disabled={isViewOnly}
                  disabledCurrency
                  currencyList={[{
                    label: 'IDR',
                    value: 'IDR',
                  }]}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                  value={{
                    currency: 'IDR',
                    value: watch('osPrincipal') as string,
                  }}
                  onChange={(val) => {
                    setValue('osPrincipal', val.value);
                    console.log(val);
                  }}
                  hasDataMaster={findDataMaster('osPrincipal')}
                  isMandatory
                />
              }
            />

            <Controller
              name="currencyOutstanding"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Currency
                  {...field}
                  label="Nilai Dalam Mata Uang Asal"
                  placeholder="Nilai Dalam Mata Uang Asal"
                  disabled={isViewOnly}
                  currencyList={[{
                    label: 'IDR',
                    value: 'IDR',
                  },
                  {
                    label: 'USD',
                    value: 'USD',
                  },
                  ]}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                  value={{
                    currency: watch('currencyOutstanding') as string,
                    value: watch('sourceCurrencyAmount') as string,
                  }}
                  onChange={(val) => {
                    setValue('currencyOutstanding', val.currency);
                    setValue('sourceCurrencyAmount', val.value);
                    console.log(val);
                  }}
                  hasDataMaster={findDataMaster('sourceCurrencyAmount')}
                />
              }
            />
          </Box>
        </SectionTitle>

        <SectionTitle title="Kualitas & Kondisi" isOpen sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gridGap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', py: theme.spacing(3) }}>
            <Box>
              <RowWrapper mb={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={isViewOnly ? theme.palette.disabled.main : theme.palette.text.primary}

                >
                  Kode Kualitas Kredit atau Pembiayaan
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
                    name="creditQuality"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-credit-quality"
                        disabled={isViewOnly}
                        testId="input-credit-quality"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(creditQualityList)}
                        value={{
                          id: watch('creditQuality') as string,
                          label: watch('creditQuality') as string,
                        }}

                        onChange={(val) => {
                          setValue('creditQualityDesc', val.label.split(' | ')[1]);
                          setValue('creditQuality', val.value);
                        }}
                        hasDataMaster={findDataMaster('creditQuality')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="creditQualityDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            {watch('creditQuality') === '5' && (
              <>
                <Controller
                  name="nplDate"
                  control={control}
                  render={({ field, fieldState: { error, invalid } }) =>
                    <Input
                      {...field}
                      label="Tanggal Macet"
                      placeholder="Tanggal Macet"
                      disabled={isViewOnly}
                      type="date"
                      isMandatory
                      // error={!!error}
                      // helperText={invalid ? error?.message : ''}
                      hasDataMaster={findDataMaster('nplDate')}
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
                      Kode Sebab macet
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
                        name="defaultReason"
                        control={control}
                        render={({ field, fieldState: { error, invalid } }) =>
                          <Autocomplete
                            id="input-default-reason"
                            disabled={isViewOnly}
                            testId="input-default-reason"
                            placeholder="Pilih Kode"
                            dropdownList={overideDropdownList(defaultResonList)}
                            value={{
                              id: watch('defaultReason') as string,
                              label: watch('defaultReason') as string,
                            }}

                            onChange={(val) => {
                              setValue('defaultReasonDesc', val.label.split(' | ')[1]);
                              setValue('defaultReason', val.value);
                            }}
                            hasDataMaster={findDataMaster('defaultReason')}
                            // error={!!error}
                            // helperText={invalid ? error?.message : ''}
                          />
                        }
                      />
                    </Box>
                    <Controller
                      name="defaultReasonDesc"
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
                            // error={!!error}
                            // helperText={invalid ? error?.message : ''}
                          />
                        );
                      }}
                    />
                  </RowWrapper>
                </Box>
              </>)}

            {watch('defaultReason') === '99' && (
              <Controller
                name="defaultReasonRemark"
                control={control}
                render={({ field, fieldState: { error, invalid } }) =>
                  <Input
                    {...field}
                    label="Sebab Macet Lainnya"
                    placeholder="Sebab Macet Lainnya"
                    disabled={isViewOnly}
                    isMandatory
                    type="area"
                    rows={4}
                    // error={!!error}
                    // helperText={invalid ? error?.message : ''}
                    hasDataMaster={findDataMaster('defaultReasonRemark')}
                  />
                }
              />
            )}

            <Controller
              name="principalArrears"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Currency
                  {...field}
                  label="Tunggakan Pokok"
                  placeholder="Tunggakan Pokok"
                  disabled={isViewOnly}
                  disabledCurrency
                  currencyList={[{
                    label: 'IDR',
                    value: 'IDR',
                  }]}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                  value={{
                    currency: 'IDR',
                    value: watch('principalArrears') as string,
                  }}
                  onChange={(val) => {
                    setValue('principalArrears', val.value);
                    console.log(val);
                  }}
                  hasDataMaster={findDataMaster('principalArrears')}
                />
              }
            />

            <Controller
              name="interestArrears"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Tunggakan Bunga atau Imbalan"
                  placeholder="Tunggakan Bunga atau Imbalan"
                  isMandatory
                  type="number"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('interestArrears')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="delinquencyDays"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Jumlah Hari Tunggakan"
                  placeholder="Jumlah Hari Tunggakan"
                  isMandatory
                  type="number"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('delinquencyDays')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="latePaymentFrequency"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Frekuensi Tunggakan"
                  placeholder="Frekuensi Tunggakan"
                  isMandatory
                  type="number"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('delinquencyDays')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="restructureFrequency"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Frekuensi Restrukturisasi"
                  placeholder="Frekuensi Restrukturisasi"
                  isMandatory
                  type="number"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('restructureFrequency')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="restructureFirstDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Tanggal Restrukturisasi Awal"
                  placeholder="Tanggal Restrukturisasi Awal"
                  isMandatory
                  type="date"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('restructureFirstDate')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="restructureLastDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Tanggal Restrukturisasi Akhir"
                  placeholder="Tanggal Restrukturisasi Akhir"
                  type="date"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('restructureLastDate')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
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
                  Kode Cara Restrukturisasi
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
                    name="restructureMethode"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-restructure-methode"
                        disabled={isViewOnly}
                        testId="input-restructure-methode"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(restructureMethodeList)}
                        value={{
                          id: watch('restructureMethode') as string,
                          label: watch('restructureMethode') as string,
                        }}

                        onChange={(val) => {
                          setValue('restructureMethodeDesc', val.label.split(' | ')[1]);
                          setValue('restructureMethode', val.value);
                        }}
                        hasDataMaster={findDataMaster('restructureMethode')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="restructureMethodeDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
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
                  Kondisi
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
                    name="condition"
                    control={control}
                    render={({ field, fieldState: { error, invalid } }) =>
                      <Autocomplete
                        id="input-condition"
                        disabled={isViewOnly}
                        testId="input-condition"
                        placeholder="Pilih Kode"
                        dropdownList={overideDropdownList(conditionList)}
                        value={{
                          id: watch('condition') as string,
                          label: watch('condition') as string,
                        }}

                        onChange={(val) => {
                          setValue('conditionDesc', val.label.split(' | ')[1]);
                          setValue('condition', val.value);
                        }}
                        hasDataMaster={findDataMaster('condition')}
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    }
                  />
                </Box>
                <Controller
                  name="conditionDesc"
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
                        // error={!!error}
                        // helperText={invalid ? error?.message : ''}
                      />
                    );
                  }}
                />
              </RowWrapper>
            </Box>

            <Controller
              name="conditionDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Tanggal Kondisi"
                  placeholder="Tanggal Kondisi"
                  type="date"
                  isMandatory
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('conditionDate')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="remark"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Keterangan"
                  placeholder="Keterangan"
                  type="text"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('conditionDate')}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="branch"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Kode Kantor Cabang"
                  placeholder="Kode Kantor Cabang"
                  disabled
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="modifiedBy"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
                  disabled
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />

            <Controller
              name="modifiedDate"
              control={control}
              render={({ field, fieldState: { error, invalid } }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Last Modified"
                  disabled
                  value={field.value ? formatDateTime(field.value) : ''}
                  // error={!!error}
                  // helperText={invalid ? error?.message : ''}
                />
              }
            />
          </Box>
        </SectionTitle>

      </ColumnWrapper>
      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        <Button onClick={handleBackToListPage} variant="outlined">Close</Button>
        {!isViewOnly && (
          <Button onClick={handleOnSave}>Save</Button>
        )}
      </RowWrapper>
    </>
  );
};

export default FacilityFinancingForm;
