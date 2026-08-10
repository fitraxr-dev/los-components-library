'use client';
import { useMemo } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Controller } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';
import { formatNumber } from '@/helpers/utils';
import useApp from '@/hooks/useApp';

import SectionTitle from '@/components/pages/MaintenanceData/MaintenanceProyek/SectionTitleMP/SectionTitle';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';


import ActionButtonsProyek from '../../components/ActionButtonsProyek/actionButtonsProyek';
import AddEditProjectPhase from '../../components/AddEditProjectPhase/AddEditProjectPhase';
import AddFacilityProject from '../../components/AddFacilityProject/AddFacilityProject';
import ChooseMemberProject from '../../components/AddFacilityProject/ChooseMemberProject';
import AddProjectMember from '../../components/AddProjectMember/AddProjectMember';
import Currency from '../../components/common/Currency/Currency';
import UseActionButtonsProyek from '../../hooks/useActionButtonsProyek';
import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import UseProjectInformation from './ProjectInformation.hooks';


const ProjectInformation = () => {

  const searchParams = useSearchParams();
  const statusFromQuery = searchParams?.get('status');
  const [{ currentRole }] = useApp();

  const {
    cityOptionsMapped,
    control,
    currencyOptions,
    detailProyek,
    districtOptionsMapped,
    handleAddProjectMember,
    handleAddProjectPhase,
    handleChooseMemberProject,
    handleSave,
    handleSubmit,
    isCreatePage,
    isDisableField,
    isAutoSaveFetching,
    isEditPage,
    isLoadingProjectFacility,
    isLoadingProjectMember,
    isLoadingProjectPhase,
    isSaveLoading,
    isValid,
    kategoriProyekOptions,
    sektorYangDibiayaiOptions,
    klasifikasiProyekOptions,
    postalCodeOptionsMapped,
    projectFacilityData,
    projectFacilityFilter,
    projectFacilityFilterContentList,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilitySearchByOptions,
    projectMemberData,
    projectMemberDataMapped,
    projectMemberFilter,
    projectMemberFilterContentList,
    projectMemberPage,
    projectMemberPageSize,
    projectMemberSearchByOptions,
    projectPhaseData,
    projectPhaseFilter,
    projectPhaseFilterContentList,
    projectPhasePage,
    projectPhasePageSize,
    projectPhaseSearchByOptions,
    provinceOptionsMapped,
    router,
    satuanOutputProyekOptions,
    setProjectFacilityFilter,
    setProjectFacilityPage,
    setProjectFacilityPageSize,
    setProjectMemberFilter,
    setProjectMemberPage,
    setProjectMemberPageSize,
    setProjectPhaseFilter,
    setProjectPhasePage,
    setProjectPhasePageSize,
    setValue,
    sectionStates,
    setSectionStates,
    submitDisable,
    tableHeaderProjectFacility,
    tableHeaderProjectMember,
    tableHeaderProjectPhase,
    theme,
    title,
    villageOptionsMapped,
    watch,
    bucketProcessId,
  } = UseProjectInformation();

  const getPreviousValue = (fieldData, isDateField = false, isCurrencyField = false) => {
    // console.log('getPreviousValue called with:', { fieldData, isDateField, isCurrencyField });

    if (!fieldData?.updated) {
      // console.log('Field not updated, returning empty string');
      return '';
    }

    const previousValue = fieldData?.previousValue;
    // console.log('previousValue:', previousValue);

    if (isDateField && previousValue) {
      try {
        const date = new Date(previousValue);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (error) {
        return previousValue;
      }
    }

    if (isCurrencyField && previousValue && typeof previousValue === 'object') {
      const { currency, value } = previousValue;
      console.log('Currency field:', { currency, value });
      if (currency && value !== null && value !== undefined) {
        const result = value.toString();
        console.log('Returning formatted value:', result);
        return result;
      }
      return '';
    }

    return previousValue;
  };
  const shouldHideActionButtons = statusFromQuery === 'CANCELED' || statusFromQuery === 'REJECTED';

  const dataAsOfProjectInformation = useMemo(() => {
    return detailProyek ? formatDateTime(detailProyek?.data?.content?.projectInformation?.modifiedDate) : '-';
  }, [detailProyek?.data?.content?.projectInformation?.modifiedDate]);

  const dataAsOfProjectPhase = useMemo(() => {
    return projectPhaseData?.data?.additionalData?.lastUpdate ? formatDateTime(projectPhaseData?.data?.additionalData?.lastUpdate) : '-';
  }, [projectPhaseData?.data?.additionalData?.lastUpdate]);

  const dataAsOfProjectMember = useMemo(() => {
    return projectMemberData?.data?.additionalData?.lastUpdate ? formatDateTime(projectMemberData?.data?.additionalData?.lastUpdate) : '-';
  }, [projectMemberData?.data?.additionalData?.lastUpdate]);

  const dataAsOfProjectFacility = useMemo(() => {
    return projectFacilityData?.data?.additionalData?.lastUpdate ? formatDateTime(projectFacilityData?.data?.additionalData?.lastUpdate) : '-';
  }, [projectFacilityData?.data?.additionalData?.lastUpdate]);

  // const { actions, handleSubmitModal, handleClose } = UseActionButtonsProyek();
  const { actions, handleSubmitModal, handleClose } = UseActionButtonsProyek(bucketProcessId);

  return (
    <>
      <ColumnWrapper>
        <RowWrapper sx={{ marginBottom: 5 }}>
          <Title
            title={`${title} Project`}
          />
        </RowWrapper>
        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle isOpen title="Project Information" >
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                py: 2,
              }}
            >
              <Controller
                name="id"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="ID Project"
                    placeholder="ID Project"
                    type="text"
                    disabled
                  />
                }
              />

              <Controller
                name="projectInformation.name"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Nama Proyek"
                    placeholder="Input Nama Proyek"
                    type="text"
                    disabled={isDisableField}
                    isMandatory

                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.projectInformation?.name)}
                  />
                }
              />

              <Controller
                name="projectInformation.startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Project Start Date"
                    placeholder="Choose Project Start Date"
                    type="date"
                    disabled={isDisableField}
                    isMandatory
                    hasDataMaster={
                      getPreviousValue(detailProyek?.data?.content?.projectInformation?.startDate, true)
                    }
                  />
                )}
              />

              <Controller
                name="projectInformation.endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Project End Date"
                    placeholder="Choose Project End Date"
                    type="date"
                    disabled={isDisableField || !watch('projectInformation.startDate')}
                    minDate={watch('projectInformation.startDate')}
                    isMandatory
                    hasDataMaster={
                      getPreviousValue(detailProyek?.data?.content?.projectInformation?.endDate, true)
                    }
                  />
                )}
              />


              <Controller
                name="projectInformation.sector"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Sektor Yang Dibiayai"
                    placeholder="Pilih Sektor"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={sektorYangDibiayaiOptions}
                    hasDataMaster={
                      getPreviousValue(detailProyek?.data?.content?.projectInformation?.sector)
                    }
                  />
                )}
              />


              <Controller
                control={control}
                name="projectInformation.value"
                render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                  const _error = error as unknown as { value: { message: string } };
                  const exchangeRate = watch('projectInformation.exchangeRate.value') || 1;
                  const currentCurrency = watch('projectInformation.value.currency');

                  return (
                    <Currency
                      {...field}
                      label="Nilai Proyek"
                      placeholder="Input Nilai Proyek"
                      containerSx={{ flex: 1 }}
                      currencyList={currencyOptions}
                      value={{
                        currency: watch('projectInformation.value.currency'),
                        value: watch('projectInformation.value.value'),
                      }}
                      onChange={(val) => {
                        // Handle empty or invalid values
                        const cleanValue = val.value === '' || val.value === null || val.value === undefined ? null : val.value;

                        onChange({
                          currency: val.currency,
                          value: cleanValue !== null ? formatNumber(cleanValue) : null,
                        });

                        // Reset exchange rate when currency changes
                        if (val.currency !== currentCurrency) {
                          setValue('projectInformation.exchangeRate.value', null);
                        }

                        if (val.currency === 'IDR' && cleanValue !== null) {
                          setValue('projectInformation.valueInIdr.value', cleanValue);
                        } else if (val.currency === 'USD' && cleanValue !== null) {
                          // Menggunakan exchange rate dinamis dari form
                          const numericExchangeRate = parseFloat(exchangeRate.toString().replace(/,/g, ''));
                          const numericValue = parseFloat(cleanValue.toString().replace(/,/g, ''));
                          const calculatedValue = numericValue * numericExchangeRate;
                          setValue('projectInformation.valueInIdr.value', calculatedValue);
                        } else {
                          // Reset valueInIdr if value is null/empty
                          setValue('projectInformation.valueInIdr.value', null);
                        }
                      }}
                      disabled={isDisableField}
                      error={!!error}
                      isMandatory={true}
                      helperText={invalid ? _error?.value?.message : ''}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content
                        ?.projectInformation?.value, false, true)}
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="projectInformation.exchangeRate"
                render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                  const _error = error as unknown as { value: { message: string } };
                  const projectValue = watch('projectInformation.value.value');
                  const projectCurrency = watch('projectInformation.value.currency');
                  const isExchangeRateDisabled = isDisableField || projectCurrency === 'IDR';

                  return (
                    <Currency
                      {...field}
                      label="Exchange Rate"
                      placeholder="Input Exchange Rate Dari Nilai Proyek"
                      containerSx={{ flex: 1 }}
                      value={{
                        currency: 'IDR',
                        value: projectCurrency === 'IDR' ? '1' : (watch('projectInformation.exchangeRate.value') || ''),
                      }}
                      onChange={(val) => {
                        // Handle empty or invalid values
                        const cleanValue = val.value === '' || val.value === null || val.value === undefined ? null : val.value;

                        onChange({
                          currency: val.currency,
                          value: cleanValue !== null ? formatNumber(cleanValue) : null,
                        });

                        // Recalculate valueInIdr when exchange rate changes
                        if (projectCurrency === 'USD' && projectValue && cleanValue !== null) {
                          const numericProjectValue = parseFloat(projectValue.toString().replace(/,/g, ''));
                          const numericExchangeRate = parseFloat(cleanValue.toString().replace(/,/g, ''));
                          const calculatedValue = numericProjectValue * numericExchangeRate;
                          setValue('projectInformation.valueInIdr.value', calculatedValue);
                        } else if (cleanValue === null) {
                          // Reset valueInIdr if exchange rate is empty
                          setValue('projectInformation.valueInIdr.value', null);
                        }
                      }}
                      disabled={isExchangeRateDisabled}
                      error={!!error}
                      isMandatory={true}
                      helperText={invalid ? _error?.value?.message : ''}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content
                        ?.projectInformation?.exchangeRate, false, true)}
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name="projectInformation.valueInIdr"
                render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
                  const _error = error as unknown as { value: { message: string } };
                  const watchedValue = watch('projectInformation.valueInIdr.value');

                  return (
                    <Currency
                      {...field}
                      label="Nilai Proyek (dalam Rp)"
                      placeholder="Nominal"
                      containerSx={{ flex: 1 }}
                      currencyList={currencyOptions}
                      value={{
                        currency: 'IDR',
                        value: watchedValue || '', // default value
                      }}
                      onChange={(val) => {
                        const numericValue = parseFloat(val.value.toString().replace(/,/g, ''));
                        onChange({
                          currency: val.currency,
                          value: isNaN(numericValue) ? 0 : formatNumber(val.value),
                        });
                      }}
                      disabled
                      disabledCurrency
                      // error={!!error}
                      // helperText={invalid ? _error?.value?.message : ''}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content
                        ?.projectInformation?.valueInIdr, false, true)}
                    />
                  );
                }}
              />

              <Controller
                name="projectInformation.classification"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Klasifikasi Proyek"
                    placeholder="Choose Klasifikasi Proyek"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={klasifikasiProyekOptions}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.projectInformation?.classification)}
                  />
                }
              />

              <Controller
                name="projectInformation.category"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Kategori Proyek"
                    placeholder="Choose Kategori Proyek"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={kategoriProyekOptions}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.projectInformation?.category)}
                  />
                }
              />

              <Controller
                name="projectInformation.output"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Output Proyek"
                    placeholder="Input Output Proyek"
                    type="area"
                    disabled={isDisableField}
                    isMandatory

                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.projectInformation?.output)}
                  />
                }
              />

              <Controller
                name="projectInformation.outputUnit"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Satuan Output Proyek"
                    placeholder="Input Satuan Output Proyek"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={satuanOutputProyekOptions}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.projectInformation?.outputUnit)}
                  />
                }
              />
              <Box sx={{ gridColumn: 'span 2' }}>
                <Controller
                  name="projectInformation.description"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label="Project Description"
                      placeholder="Input Project Description"
                      type="area"
                      disabled={isDisableField}
                      isMandatory
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content?.projectInformation?.description)}
                    />
                  }
                />
              </Box>
            </Box>
          </SectionTitle>


          <SectionTitle isOpen title="Alamat Proyek">
            <Box display="flex" alignItems="center" py={2} gap={1}>
              <TextStyle variant="body4" weight={600}>
                {`Data as of : ${dataAsOfProjectInformation}`}
              </TextStyle>
              <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
                py: 2,
              }}
            >
              <Box sx={{ gridColumn: 'span 2' }}>
                <Controller
                  name="projectInformation.projectAddress.address"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label="Project Location - Address"
                      placeholder="Input Project Location - Address"
                      type="area"
                      disabled={isDisableField}
                      isMandatory
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content
                        ?.projectInformation?.projectAddress?.address)}
                    />
                  }
                />
              </Box>
              <Controller
                name="projectInformation.projectAddress.province"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Lokasi Proyek (Provinsi)"
                    placeholder="Choose Lokasi Proyek (Provinsi)"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={provinceOptionsMapped}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.projectInformation?.projectAddress?.province)}
                  />
                }
              />

              <Controller
                name="projectInformation.projectAddress.city"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Lokasi Proyek (Kota-Kabupaten)"
                    placeholder="Choose Lokasi Proyek (Kota-Kabupaten)"
                    type="dropdown"
                    isMandatory
                    disabled={isDisableField}
                    dropdownList={cityOptionsMapped}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.projectInformation?.projectAddress?.city)}
                  />
                }
              />

              <Controller
                name="projectInformation.projectAddress.district"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Lokasi Proyek (Kecamatan)"
                    placeholder="Choose Lokasi Proyek (Kecamatan)"
                    type="dropdown"
                    disabled={isDisableField}
                    dropdownList={districtOptionsMapped}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.projectInformation?.projectAddress?.district)}
                  />
                }
              />

              <Controller
                name="projectInformation.projectAddress.village"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Lokasi Proyek (Kelurahan)"
                    placeholder="Choose Lokasi Proyek (Kelurahan)"
                    type="dropdown"
                    disabled={isDisableField}
                    dropdownList={villageOptionsMapped}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.projectInformation?.projectAddress?.village)}
                  />
                }
              />

              <Controller
                name="projectInformation.projectAddress.postalCode"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Postal Code"
                    placeholder="Choose Postal Code"
                    type="dropdown"
                    disabled={isDisableField}
                    dropdownList={postalCodeOptionsMapped}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content
                      ?.projectInformation?.projectAddress?.postalCode)}
                  />
                }
              />

            </Box>
          </SectionTitle>
          <SectionTitle
            isOpen={sectionStates.projectPhase}
            title="Project Phase"
            onToggle={() => setSectionStates((prev) => ({
              ...prev,
              projectPhase: !prev.projectPhase,
            }))}
          >
            <Box display="flex" alignItems="center" py={2} gap={1}>
              <TextStyle variant="body4" weight={600}>
                {`Data as of : ${dataAsOfProjectPhase}`}
              </TextStyle>
              <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </Box>
            <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box width="45vw">
                <Input
                  type="search"
                  value={projectPhaseFilter}
                  onChange={setProjectPhaseFilter}
                  placeholder="Pencarian"
                  dropdownList={projectPhaseSearchByOptions}
                  contentList={projectPhaseFilterContentList}
                />
              </Box>

              <Button
                onClick={handleAddProjectPhase}
                disabled={isDisableField || !isEditPage}
              >
                Add Project Phase
              </Button>

            </RowWrapper>
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                tableHeader={tableHeaderProjectPhase}
                isLoading={isLoadingProjectPhase}
                tableData={projectPhaseData?.data?.contents}
                totalPage={projectPhaseData?.data?.page?.totalPage}
                currentPage={projectPhasePage}
                pageSize={projectPhasePageSize}
                handlePageChange={setProjectPhasePage}
                onPageSizeChange={setProjectPhasePageSize}
              />
            </BaseContainer>
          </SectionTitle>
          <SectionTitle
            isOpen={sectionStates.projectMember}
            title="List Member Project"
            onToggle={() => setSectionStates((prev) => ({
              ...prev,
              projectMember: !prev.projectMember,
            }))}
          >
            <Box display="flex" alignItems="center" py={2} gap={1}>
              <TextStyle variant="body4" weight={600}>
                {`Data as of : ${dataAsOfProjectMember}`}
              </TextStyle>
              <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </Box>
            <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box width="45vw">
                <Input
                  type="search"
                  value={projectMemberFilter}
                  onChange={setProjectMemberFilter}
                  placeholder="Pencarian"
                  dropdownList={projectMemberSearchByOptions}
                  contentList={projectMemberFilterContentList}
                />
              </Box>

              <Button
                onClick={handleAddProjectMember}
                disabled={isDisableField || !isEditPage}
              >
                Add Project Member
              </Button>

            </RowWrapper>
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                tableHeader={tableHeaderProjectMember}
                isLoading={isLoadingProjectMember}
                tableData={projectMemberDataMapped}
                totalPage={projectMemberData?.data?.page?.totalPage}
                currentPage={projectMemberPage}
                pageSize={projectMemberPageSize}
                handlePageChange={setProjectMemberPage}
                onPageSizeChange={setProjectMemberPageSize}
              />
            </BaseContainer>
          </SectionTitle>
          <SectionTitle
            isOpen={sectionStates.projectFacility}
            title="List Facility Project"
            onToggle={() => setSectionStates((prev) => ({
              ...prev,
              projectFacility: !prev.projectFacility,
            }))}
          >
            <Box display="flex" alignItems="center" py={2} gap={1}>
              <TextStyle variant="body4" weight={600}>
                {`Data as of : ${dataAsOfProjectFacility}`}
              </TextStyle>
              <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </Box>
            <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box width="45vw">
                <Input
                  type="search"
                  value={projectFacilityFilter}
                  onChange={setProjectFacilityFilter}
                  placeholder="Pencarian"
                  dropdownList={projectFacilitySearchByOptions}
                  contentList={projectFacilityFilterContentList}
                />
              </Box>

              <Button
                onClick={handleChooseMemberProject}
                disabled={isDisableField || !isEditPage}
              >
                Add Facility Project
              </Button>

            </RowWrapper>
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                tableHeader={tableHeaderProjectFacility}
                isLoading={isLoadingProjectFacility}
                tableData={projectFacilityData?.data?.contents}
                totalPage={projectFacilityData?.data?.page?.totalPage}
                currentPage={projectFacilityPage}
                pageSize={projectFacilityPageSize}
                handlePageChange={setProjectFacilityPage}
                onPageSizeChange={setProjectFacilityPageSize}
              />
            </BaseContainer>
          </SectionTitle>
        </ColumnWrapper>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            py: 2,
          }}
        >
          <Controller
            name="projectInformation.modifiedBy"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                value={field.value || ''}
                label="Modified By"
                placeholder="Modified By"
                type="text"
                disabled
              />
            }
          />

          <Controller
            name="projectInformation.modifiedDate"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                value={field.value || ''}
                label="Last Modified"
                placeholder="Last Modified"
                type="text"
                disabled
              />
            }
          />
        </Box>
        {isCreatePage ? (
          <RowWrapper marginTop={5} justifyContent="end" gap={theme.spacing(2)}>
            <Button
              variant="outlined"
              onClick={() => { router.back(); }}
            >
              Close
            </Button>
            <Button
              isLoading={isSaveLoading}
              onClick={handleSubmit(handleSave)}
              disabled={!isValid}
            >
              Save
            </Button>
          </RowWrapper>
        ) : (
          <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
            {!shouldHideActionButtons && (
              <ActionButtonsProyek
                actions={actions?.action || {}}
                handleSave={handleSave}
                isAutoSaveFetching={isAutoSaveFetching}
                handleOpenSubmitModal={handleSubmitModal}
                isSubmitDisable={!submitDisable}
                isSubmitLoading={false}
                viewOnly={false}
                onClose={handleClose}
                currentRole={currentRole}
              />
            )}
          </RowWrapper>
        )}
      </ColumnWrapper>
      <ModalDef
        id={MODAL.ADD_EDIT_PROJECT_PHASE_MODAL}
        component={AddEditProjectPhase}
      />
      <ModalDef
        id={MODAL.ADD_PROJECT_MEMBER_MODAL}
        component={AddProjectMember}
      />
      <ModalDef
        id={MODAL.ADD_CHOOSE_MEMBER_PROJECT_MODAL}
        component={ChooseMemberProject}
      />
      <ModalDef
        id={MODAL.ADD_FACILITY_PROJECT_MODAL}
        component={AddFacilityProject}
      />
    </>
  );
};

export default ProjectInformation;
