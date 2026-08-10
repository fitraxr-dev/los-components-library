'use client';

import React from 'react';

import { CircularProgress, Paper, useTheme } from '@mui/material';

import { TypeProcess } from '@/enums/Module';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SyariahForm from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalDetailFacility/SyariahForm/SyariahForm';
import SyariahFormEditable from '@/components/shared/SmiTable/TablePaymentFacility/components/ModalFormFacility/SyariahForm/SyariahForm';
import TextStyle from '@/components/shared/TextStyle';

import useLimitAnak from './LimitAnak.hook';


const DataSection = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        p: theme.spacing(3),
      }}
    >
      {title && (
        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ mb: 2, py: theme.spacing(1) }}
        >
          {title}
        </TextStyle>
      )}
      {children}
    </Paper>
  );
};

const MappingInfo = ({
  isDetail,
  mappingFormData,
  handleMappingChange,
  orderTypeOptions,
  financingSegmentOptions,
  mappingProductSyariahOptions,
  isSaving,
  findDataDelta,
  newFromExisting,
}: any) => {
  const theme = useTheme();

  if (isDetail) {
    const mappingData = [
      {
        hasDataMaster: findDataDelta('mappingOrderType', orderTypeOptions),
        label: 'Mapping Order Type',
        value: mappingFormData.mappingOrderType?.label || '-',
      },
      {
        label: 'CORE Mapping Segment Pembiayaan',
        value: mappingFormData.mappingFinancingSegment?.label || '-',
      },
      {
        hasDataMaster: findDataDelta('coreMappingProduct', mappingProductSyariahOptions),
        label: 'CORE Mapping Produk',
        value: mappingFormData.mappingProduct?.label || '-',
      },
      {
        hasDataMaster: findDataDelta('os'),
        label: 'O/S',
        value: mappingFormData.os || '-',
      },
    ];

    return (
      <div style={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {mappingData.map((item, idx) => (
          <Cell key={idx} title={item.label} value={item.value} hasDataMaster={item.hasDataMaster} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <Autocomplete
        label="Mapping Order Type"
        placeholder="Pilih Mapping Order Type"
        dropdownList={orderTypeOptions || []}
        value={mappingFormData.mappingOrderType || null}
        onChange={(val: any) => handleMappingChange('mappingOrderType', val)}
        isLoading={false}
        disabled
        hasDataMaster={findDataDelta('mappingOrderType', orderTypeOptions)}
      />
      <Autocomplete
        label="CORE Mapping Segment Pembiayaan"
        placeholder="Pilih Segment Pembiayaan"
        dropdownList={financingSegmentOptions || []}
        value={mappingFormData.mappingFinancingSegment || null}
        onChange={(val: any) => handleMappingChange('mappingFinancingSegment', val)}
        isLoading={false}
        disabled
        hasDataMaster={findDataDelta('financingSegment', financingSegmentOptions)}
      />
      <Autocomplete
        label="CORE Mapping Produk"
        placeholder="Pilih Produk Syariah"
        dropdownList={mappingProductSyariahOptions || []}
        value={mappingFormData.mappingProduct || null}
        onChange={(val: any) => handleMappingChange('mappingProduct', val)}
        isLoading={false}
        disabled={
          isSaving ||
          newFromExisting ||
          mappingFormData.mappingOrderType?.value === 'New From Existing'
        }
        hasDataMaster={findDataDelta('coreMappingProduct', mappingProductSyariahOptions)}
      />
      <Input
        type="number"
        label="O/S"
        placeholder="Masukkan O/S"
        value={mappingFormData.os !== null ? String(mappingFormData.os) : ''}
        onValueChange={(values: any) => handleMappingChange('os', values?.floatValue ?? 0)}
        containerSx={{ flex: 1 }}
        thousandSeparator=","
        decimalScale={2}
        hasDataMaster={findDataDelta('os')}
        disabled
      />
    </div>
  );
};

const ProjectInfo = ({
  isDetail,
  isEdit,
  limitAnakData,
  mappingFormData,
  projectData,
  projectList,
  setProjectField,
  handleMappingChange,
  currencyDropdownList,
}: any) => {
  const theme = useTheme();

  if (!projectData || projectData.length === 0) return null;

  if (isDetail) {
    return (
      <DataSection title="Informasi Proyek">
        <div style={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {projectData.map((item: any) => (
            <Cell key={`${item.label}-${item.value}`} title={item.label} value={item.value} />
          ))}
        </div>
      </DataSection>
    );
  }

  const projectDetail = limitAnakData?.projects?.[0] || {};
  const selectedProject = projectList?.find((p: any) => Number(p.id) === Number(mappingFormData.projectId));

  const projectDataMap = {
    cityLabel: selectedProject?.cityLabel || projectDetail?.cityLabel || '-',
    curValue: selectedProject?.currency || projectDetail?.currency || 'IDR',
    districtLabel: selectedProject?.districtLabel || projectDetail?.districtLabel || '-',
    exchangeRate: selectedProject?.exchangeRate || projectDetail?.exchangeRate || null,
    provinceLabel: selectedProject?.provinceLabel || projectDetail?.provinceLabel || '-',
    value: selectedProject?.projectValue || projectDetail?.projectValue || '-',
    valueInIdr: selectedProject?.projectValueInIdr || projectDetail?.projectValueInIdr || '-',
  };

  return (
    <DataSection title="Informasi Proyek">
      <div style={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <Input disabled label="Nama Proyek" placeholder="Nama Proyek" value={projectDetail?.projectName || selectedProject?.name || '-'} />
        <Input disabled label="Lokasi Proyek (Provinsi)" placeholder="Provinsi" value={projectDataMap.provinceLabel} />
        <Currency
          currencyList={currencyDropdownList}
          label="Nilai Proyek"
          value={{ currency: projectDataMap.curValue, value: projectDataMap.value }}
          disabled
        />
        <Input disabled label="Lokasi Proyek (Kota - Kabupaten)" placeholder="Kota/Kabupaten" value={projectDataMap.cityLabel} />

        {projectDataMap.curValue === 'USD' && (
          <Currency
            currencyList={currencyDropdownList}
            label="Exchange Rate"
            value={{ currency: 'IDR', value: projectDataMap.exchangeRate }}
            disabled
          />
        )}

        <div style={{ display: 'grid', gridColumn: projectDataMap.curValue === 'USD' ? 'auto' : '2 / 3' }}>
          <Input disabled label="Lokasi Proyek (Kecamatan)" placeholder="Kecamatan" value={projectDataMap.districtLabel} />
        </div>

        {projectDataMap.curValue === 'USD' && (
          <Currency
            currencyList={currencyDropdownList}
            label="Nilai Proyek (dalam Rupiah)"
            value={{ currency: 'IDR', value: projectDataMap.valueInIdr }}
            disabled
          />
        )}
      </div>
    </DataSection>
  );
};

const LimitAnak = () => {
  const theme = useTheme();
  const {
    currencyDropdownList,
    financingSegmentOptions,
    findDataDelta,
    floatingReferenceOptions,
    handleCancel,
    handleMappingChange,
    handleSave,
    idFacilitySyariah,
    isAutoSaveFetching,
    isDetail,
    isEdit,
    isHidden,
    isLoading,
    isMandatoryEmpty,
    isSaving,
    isSyariah,
    limitAnakData,
    mappingFormData,
    mappingProductSyariahOptions,
    modul,
    onChangeSyariahForm,
    orderTypeOptions,
    projectData,
    projectList,
    rateTypeOptions,
    setProjectField,
    syariahComponentConfig,
    newFromExisting,
  } = useLimitAnak();

  if (isLoading) {
    return (
      <ColumnWrapper sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <CircularProgress size={40} />
      </ColumnWrapper>
    );
  }

  return (
    <ColumnWrapper display="flex" flexDirection="column" gap={3}>
      <MappingInfo
        isDetail={isDetail}
        isSaving={isSaving}
        mappingFormData={mappingFormData}
        handleMappingChange={handleMappingChange}
        orderTypeOptions={orderTypeOptions}
        financingSegmentOptions={financingSegmentOptions}
        mappingProductSyariahOptions={mappingProductSyariahOptions}
        findDataDelta={findDataDelta}
        newFromExisting={newFromExisting}
      />

      <ColumnWrapper gap={2}>
        {isEdit ? (
          <DataSection title="Informasi Fasilitas">
            <ColumnWrapper display="flex" flexDirection="column" gap={2}>
              {isSyariah && (
                <div style={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: theme.spacing(1) }}>
                  <Autocomplete
                    label="Tipe Rate"
                    placeholder="Pilih Tipe Rate"
                    dropdownList={rateTypeOptions || []}
                    value={mappingFormData.rateType || null}
                    onChange={(val) => handleMappingChange('rateType', val)}
                    disabled={newFromExisting}
                  />
                  <Autocomplete
                    isMandatory={!newFromExisting && mappingFormData.rateType?.id?.toUpperCase() === 'FLOATING'}
                    label="Referensi Floating"
                    placeholder="Pilih Referensi Floating"
                    dropdownList={floatingReferenceOptions || []}
                    value={
                      floatingReferenceOptions?.find((opt: any) => opt.id === mappingFormData.floatingReference) || null
                    }
                    onChange={(val) => handleMappingChange('floatingReference', val)}
                    error={
                      !newFromExisting &&
                      mappingFormData.rateType?.id?.toUpperCase() === 'FLOATING' &&
                      !mappingFormData.floatingReference
                    }
                    helperText={
                      !newFromExisting &&
                        mappingFormData.rateType?.id?.toUpperCase() === 'FLOATING' &&
                        !mappingFormData.floatingReference
                        ? 'Referensi Floating wajib diisi'
                        : ''
                    }
                    disabled={newFromExisting}
                  />
                  <Input
                    label="Alias Fasilitas Anak"
                    placeholder="Masukkan Alias Fasilitas Anak"
                    value={mappingFormData.childFacilityAlias}
                    onChange={(val) => handleMappingChange('childFacilityAlias', val)}
                    error={
                      mappingFormData.childFacilityAlias &&
                      !/^[a-zA-Z0-9 ]*$/.test(mappingFormData.childFacilityAlias)
                    }
                    helperText={
                      mappingFormData.childFacilityAlias &&
                        !/^[a-zA-Z0-9 ]*$/.test(mappingFormData.childFacilityAlias)
                        ? 'Alias Fasilitas Anak hanya bisa input angka dan huruf'
                        : ''
                    }
                    disabled={newFromExisting}
                  />
                  <div />
                </div >
              )}
              <Input
                isMandatory
                label="Tujuan Pembiayaan"
                placeholder="Tujuan Pembiayaan"
                value={mappingFormData.financingObjectives}
                onChange={(val) => handleMappingChange('financingObjectives', val)}
                error={!mappingFormData.financingObjectives}
                helperText={!mappingFormData.financingObjectives ? 'Tujuan Pembiayaan wajib diisi' : ''}
                disabled={newFromExisting}
              />
              <SyariahFormEditable
                paymentScheme={limitAnakData?.product || ''}
                onChangeSyariahForm={onChangeSyariahForm}
                financingFacilityData={limitAnakData}
                module={modul}
                process={TypeProcess.MAINTENANCE_CUSTOMER}
                syariahComponentConfig={syariahComponentConfig}
                facilityId={idFacilitySyariah}
                disabled={newFromExisting}
              />
            </ColumnWrapper >
          </DataSection >
        ) : (
          <ColumnWrapper display="flex" flexDirection="column" gap={2}>
            <div style={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: theme.spacing(1) }}>
              <Cell
                title="Tipe Rate"
                value={mappingFormData.rateType?.label || '-'}
                hasDataMaster={findDataDelta('rateType', rateTypeOptions)}
              />
              <Cell
                title="Referensi Floating"
                value={mappingFormData.floatingReference || '-'}
                hasDataMaster={findDataDelta('floatingReference')}
              />
              <Cell
                title="Alias Fasilitas Anak"
                value={mappingFormData.childFacilityAlias || '-'}
                hasDataMaster={findDataDelta('childFacilityAlias')}
              />

            </div>

            <SyariahForm paymentScheme={limitAnakData?.product} financingFacilityData={limitAnakData} />
          </ColumnWrapper>

        )}
      </ColumnWrapper >

      <ProjectInfo
        isDetail={isDetail}
        isEdit={isEdit}
        limitAnakData={limitAnakData}
        mappingFormData={mappingFormData}
        projectData={projectData}
        projectList={projectList}
        setProjectField={setProjectField}
        handleMappingChange={handleMappingChange}
        currencyDropdownList={currencyDropdownList}
      />

      <RowWrapper sx={{ justifyContent: 'end', mt: 3 }}>
        <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }} disabled={isSaving}>
          {(isHidden || isDetail || newFromExisting) ? 'Close' : 'Cancel'}
        </Button>
        {!isHidden && !isDetail && !newFromExisting && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isLoading || isSaving || isAutoSaveFetching || isMandatoryEmpty}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper >
  );
};

export default LimitAnak;
