'use client';

import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';
import { overideDropdownList } from '../RegulatorData.helper';

import useApolo from './Apolo.hooks';


const ApoloPage = () => {

  const {
    isDebtor,
    isAutoSaveFetching,
    debtorData,
    theme,
    control,
    handleSaveDetailApolo,
    canEdit,
    financingObject,
    economicSector,
    apoloFinanceCategory,
    businessCategory,
    apoloRelatedParty,
    apoloRelatedStatus,
    country,
    customerGroupData,
    setValue,
    isValid,
    locationProject,
    findDataMaster,
    watch,
    setIsSubmit,
  } = useApolo();

  return (
    <Box>
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

      <Box sx={{ display: 'grid', gap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', pt: theme.spacing(3) }}>

        <Box>
          <RowWrapper mb={1}>
            <TextStyle
              variant="body4"
              weight={600}
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
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
                name="groupCustomerCode"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-group-customer"
                    disabled={!canEdit}
                    testId="input-group-customer"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(customerGroupData)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('groupCustomerDescription', val.label.split(' | ')[1]);
                      setValue('groupCustomerCode', val.value);
                    }}
                    hasDataMaster={findDataMaster('customerGroup')}
                  />
                }
              />
            </Box>
            <Controller
              name="groupCustomerDescription"
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
                    rows={4}
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
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Negara
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
                name="country"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-country"
                    disabled={!canEdit}
                    testId="input-country"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(country)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('countryDesc', val.label.split(' | ')[1]);
                      setValue('country', val.value);
                    }}
                    hasDataMaster={findDataMaster('country')}
                  />
                }
              />
            </Box>
            <Controller
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
                    rows={4}
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
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Status Keterikatan
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
                name="relatedStatus"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-relationship-status"
                    disabled={!canEdit}
                    testId="input-relationship-status"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(apoloRelatedStatus)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('relatedStatusDescription', val.label.split(' | ')[1]);
                      setValue('relatedStatus', val.value);
                    }}
                    hasDataMaster={findDataMaster('relatedStatus')}
                  />
                }
              />
            </Box>
            <Controller
              name="relatedStatusDescription"
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
                    rows={4}
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
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Hubungan Pihak Terkait
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
                name="relatedPartyRelationship"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-relationship"
                    disabled={!canEdit}
                    testId="input-relationship"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(apoloRelatedParty)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('relatedPartyRelationshipDescription', val.label.split(' | ')[1]);
                      setValue('relatedPartyRelationship', val.value);
                    }}
                    hasDataMaster={findDataMaster('relatedPartyRelationship')}
                  />
                }
              />
            </Box>
            <Controller
              name="relatedPartyRelationshipDescription"
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
                    rows={4}
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
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Kategori Usaha Customer
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
                name="businessCategory"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-business-category"
                    disabled={!canEdit}
                    testId="input-business-category"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(businessCategory)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('businessCategoryDescription', val.label.split(' | ')[1]);
                      setValue('businessCategory', val.value);
                    }}
                    hasDataMaster={findDataMaster('businessCategory')}
                  />
                }
              />
            </Box>
            <Controller
              name="businessCategoryDescription"
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
                    rows={4}
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
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Kategori Usaha Keuangan Berkelanjutan
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
                name="financeCategory"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-sustainable-finance-category"
                    disabled={!canEdit}
                    testId="input-sustainable-finance-category"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(apoloFinanceCategory)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('financeCategoryDescription', val.label.split(' | ')[1]);
                      setValue('financeCategory', val.value);
                    }}
                    hasDataMaster={findDataMaster('financeCategory')}
                  />
                }
              />
            </Box>
            <Controller
              name="financeCategoryDescription"
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
                    rows={4}
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
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Sektor Ekonomi Lapangan Usaha
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
                render={({ field }) =>
                  <Autocomplete
                    id="input-economic-sector"
                    disabled={!canEdit}
                    testId="input-economic-sector"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(economicSector)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('economicSectorDescription', val.label.split(' | ')[1]);
                      setValue('economicSector', val.value);
                    }}
                    hasDataMaster={findDataMaster('economicSector')}
                  />
                }
              />
            </Box>
            <Controller
              name="economicSectorDescription"
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
                    rows={4}
                    disabled
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );
              }}
            />
          </RowWrapper>
        </Box>

        {watch('economicSector') === 'SE:e009' ?
          <Controller
            name="economicSectorRemark"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Sektor Ekonomi Lapangan Usaha Lainnya"
                placeholder="Sektor Ekonomi Lapangan Usaha Lainnya"
                disabled={!canEdit}
                type="area"
                rows={4}
                hasDataMaster={findDataMaster('economicSectorRemark')}
              />
            )}
          />
          : null
        }

        <Box>
          <RowWrapper mb={1}>
            <TextStyle
              variant="body4"
              weight={600}
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Lokasi Proyek
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
                name="projectCity"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-location-project"
                    disabled={!canEdit}
                    testId="input-location-project"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(locationProject)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('projectCityDescription', val.label.split(' | ')[1]);
                      setValue('projectCity', val.value);
                    }}
                    hasDataMaster={findDataMaster('projectCity')}
                  />
                }
              />
            </Box>
            <Controller
              name="projectCityDescription"
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
                    rows={4}
                    disabled
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );
              }}
            />
          </RowWrapper>
        </Box>

        {watch('projectCity') === 'LO:e000' &&
          <Controller
            name="projectCityRemark"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Lokasi Proyek Lainnya"
                placeholder="Lokasi Proyek Lainnya"
                disabled={!canEdit}
                type="area"
                rows={4}
                hasDataMaster={findDataMaster('projectCityRemark')}
              />
            )}
          />
        }

        <Box>
          <RowWrapper mb={1}>
            <TextStyle
              variant="body4"
              weight={600}
              color={canEdit ? theme.palette.text.primary : theme.palette.disabled.main}
            >
              Objek Pembiayaan
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
                name="financingObject"
                control={control}
                render={({ field }) =>
                  <Autocomplete
                    id="input-financing-object"
                    disabled={!canEdit}
                    testId="input-financing-object"
                    placeholder="Pilih Kode"
                    dropdownList={overideDropdownList(financingObject)}
                    value={{
                      id: field.value as string,
                      label: field.value as string,
                    }}
                    onChange={(val) => {
                      setValue('financingObjectDescription', val.label.split(' | ')[1]);
                      setValue('financingObject', val.value);
                    }}
                    hasDataMaster={findDataMaster('financingObject')}
                  />
                }
              />
            </Box>
            <Controller
              name="financingObjectDescription"
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
                    rows={4}
                    disabled
                    error={!!error}
                    helperText={invalid ? error?.message : ''}
                  />
                );
              }}
            />
          </RowWrapper>
        </Box>

        {watch('financingObject') === 'BJ:e150' &&
          <Controller
            name="financingObjectRemark"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Objek Pembiayaan Lainnya"
                placeholder="Objek Pembiayaan Lainnya"
                disabled={!canEdit}
                type="area"
                rows={4}
                hasDataMaster={findDataMaster('financingObjectRemark')}
              />
            )}
          />
        }

        <Controller
          name="financingType"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Jenis Pembiayaan"
              placeholder="Jenis Pembiayaan"
              disabled={!canEdit}
              type="area"
              rows={4}
              isMandatory
              hasDataMaster={findDataMaster('financingType')}
            />
          )}
        />

      </Box>

      <Box sx={{ display: 'grid', gap: theme.spacing(3), gridTemplateColumns: 'repeat(2, 1fr)', pt: theme.spacing(3) }}>

        <Controller
          name="modifiedBy"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Modified By"
              placeholder="Modified By"
              type="text"
              disabled
            />
          )}
        />

        <Controller
          name="modifiedDate"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Last Modified"
              placeholder="Last Modified"
              value={field.value ? formatDateTime(field.value) : null}
              disabled
            />
          )}
        />
      </Box>
      <RowWrapper sx={{ justifyContent: 'end' }}>
        <ActionFooterDetail
          isAutoSaveFetching={isAutoSaveFetching}
          handleSave={() => handleSaveDetailApolo(false)}
          viewOnly={!canEdit}
          onChange={(value) => {
            if (value) {
              handleSaveDetailApolo(value);
            }
          }}
        />
      </RowWrapper>
    </Box>
  );
};

export default ApoloPage;
