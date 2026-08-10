'use client';
import { useEffect } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { toDateStringNumber } from '@/helpers/date';
import { multiplyNominalValues } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import SyariahForm from '@/components/pages/MIP/FinancingOverviewPage/components/ModalFormFacility/SyariahForm/SyariahForm';
import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';


import { MODAL_FINANCING } from '../../FacilityOverview.constants';

import useModalFormFacility from './ModalFormFacility.hook';


const ModalFormFacility = NiceModal.create((
  { existing, id, module, process, isPKLS }: any) => {
  const theme = useTheme();
  const modalId = MODAL_FINANCING.FORM_FACILITY;
  const modal = useModal(modalId);
  const { facilityId } = useIdentity();


  const {
    masintonForm,
    orderTypeList,
    financingSegmentList,
    mappingFinancingSegmentList,
    mapOrderTypeList,
    productList,
    mappingProductList,
    projectList,
    projectDetail,
    governmentMandateList,
    handleSubmit,
    masintonChange,
    masintonMultiChange,
    masintonReset,
    financingPk,
    disabledSave,
    isAutoSaveFetching,
    isLoadingSave,
    financingFacilityDataSyariah,
    onChangeSyariahForm,
  } = useModalFormFacility({ existing, id, module, process });

  useEffect(() => {
    return () => masintonReset();
  }, []);

  const {
    orderType,
    debtorName,
    financingSegment,
    product,
    orderValue,
    currencyOrderValue,
    exchangeRate,
    orderValueAfterExchangeRate,
    remark,
    projectId,
    withdrawalPeriod,
    rates,
    timePeriod,
    gracePeriod,
    governmentMandate,
    financingObjectives,
    outstanding,
    mappingOrderType,
    currencyOutstanding,
    mappingFinancingSegment,
    mappingProduct,
  } = masintonForm;
  existing = existing || orderType.value === 'NEW_FROM_EXISTING_FACILITY';
  const title = existing
    ? 'Add Fasilitas Pembiayaan Eksisting'
    : facilityId
      ? 'Edit Fasilitas Pembiayaan'
      : 'Add New Fasilitas Pembiayaan';


  const renderDebiturInput = () => {
    switch (product?.value) {
      case 'AL_IJARAH':
      case 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH':
      case 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK':
        return (
          <Input
            label="Penyewa/Musta'jir"
            type="text"
            containerSx={{ flex: 1 }}
            value={debtorName?.value}
            disabled
          />
        );
      case 'AL_MUDHARABAH':
        return (
          <Input
            label="Mudharib/Nasabah"
            type="text"
            containerSx={{ flex: 1 }}
            value={debtorName?.value}
            disabled
          />
        );
      default:
        return (
          <Input
            label="Mitra Syarik SMI"
            type="text"
            containerSx={{ flex: 1 }}
            value={debtorName?.value}
            disabled
          />
        );
    }
  };

  return (
    <SectionModal
      title={title}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ py: theme.spacing(1) }}
        >
          Informasi Fasilitas:
        </TextStyle>

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            disabled
            label="Order Type"
            type="dropdown"
            placeholder="Choose Order Status"
            containerSx={{ flex: 1 }}
            dropdownList={orderTypeList}
            value={orderType.value}
            onChange={(val) => masintonChange('orderType', val)}
            error={orderType.error}
            helperText={orderType.error && orderType.errorMessage}
          />
          <Input
            isMandatory
            label="Mapping Order Type"
            type="dropdown"
            placeholder="Choose Mapping Order Type"
            containerSx={{ flex: 1 }}
            dropdownList={mapOrderTypeList}
            value={mappingOrderType.value}
            onChange={(val) => masintonChange('mappingOrderType', val)}
            error={mappingOrderType.error}
            helperText={mappingOrderType.error && mappingOrderType.errorMessage}
          />
          <Input
            isMandatory
            label="Segmen Pembiayaan"
            type="dropdown"
            placeholder="Choose Segmen Pembiayaan"
            containerSx={{ flex: 1 }}
            dropdownList={financingSegmentList}
            value={financingSegment.value}
            onChange={(val) => masintonChange('financingSegment', val)}
            disabled={existing}
            error={financingSegment.error}
            helperText={financingSegment.error && financingSegment.errorMessage}
          />
          <Input
            isMandatory
            label="CORE Mapping Segmen Pembiayaan"
            type="dropdown"
            placeholder="Input CORE Mapping Segmen Pembiayaan"
            containerSx={{ flex: 1 }}
            dropdownList={mappingFinancingSegmentList}
            value={mappingFinancingSegment.value}
            onChange={(val) => masintonChange('mappingFinancingSegment', val)}
            error={mappingFinancingSegment.error}
            helperText={mappingFinancingSegment.error && mappingFinancingSegment.errorMessage}
          />
          <Input
            isMandatory
            label={financingSegment.value !== 'SYARIAH' ? 'Produk' : 'Skema Pembiayaan'}
            type="dropdown"
            placeholder={financingSegment.value !== 'SYARIAH' ? 'Choose Produk' : 'Choose Skema Pembiayaan'}
            containerSx={{ flex: 1 }}
            dropdownList={productList}
            value={product.value}
            onChange={(val) => masintonChange('product', val)}
            disabled={existing}
            error={product.error}
            helperText={product.error && product.errorMessage}
          />
          <Input
            isMandatory
            label="CORE Mapping Produk"
            type="dropdown"
            placeholder="Choose CORE Mapping Produk"
            containerSx={{ flex: 1 }}
            dropdownList={mappingProductList}
            value={mappingProduct.value}
            onChange={(val) => masintonChange('mappingProduct', val)}
            disabled={existing}
            error={mappingProduct.error}
            helperText={mappingProduct.error && mappingProduct.errorMessage}
          />

          {financingSegment.value !== 'SYARIAH' ? (
            <>
              <Input
                label="Masa penarikan"
                placeholder="Input Masa Penarikan"
                containerSx={{ flex: 1 }}
                value={withdrawalPeriod.value}
                onChange={(val) => masintonChange('withdrawalPeriod', val)}
                error={withdrawalPeriod.error}
                helperText={withdrawalPeriod.error && withdrawalPeriod.errorMessage}
              />
              <Currency
                isMandatory
                label="Nominal Pembiayaan"
                placeholder="Input Nominal Pembiayaan"
                containerSx={{ flex: 1 }}
                value={{ currency: currencyOrderValue.value, value: orderValue.value }}
                onChange={(val) => {
                  masintonMultiChange({
                    currencyOrderValue: val.currency,
                    orderValue: val.value,
                  });
                }}
                error={orderValue.error}
                helperText={orderValue.error && orderValue.errorMessage}
              />

              {currencyOrderValue.value === 'USD' && (
                <>
                  <Currency
                    isMandatory
                    label="Exchange Rate"
                    placeholder="Exchange Rate"
                    value={{ currency: 'IDR', value: exchangeRate.value }}
                    onChange={(val) => masintonChange('exchangeRate', val.value)}
                    error={exchangeRate.error}
                    helperText={exchangeRate.error && exchangeRate.errorMessage}
                    disabledCurrency
                  />
                  <Currency
                    label="Nilai Pembiayaan (dalam Rp)"
                    placeholder="Nilai Pembiayaan"
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: orderValueAfterExchangeRate.value }}
                    onChange={(val) => masintonChange('orderValueAfterExchangeRate', val?.value)}
                    disabled
                  />
                </>
              )}

              <Input
                label="Jangka Waktu"
                placeholder="Input Jangka Waktu"
                containerSx={{ flex: 1 }}
                value={timePeriod.value}
                onChange={(val) => masintonChange('timePeriod', val)}
                error={timePeriod.error}
                helperText={timePeriod.error && timePeriod.errorMessage}
              />
              <Input
                label="Rate"
                placeholder="Rate"
                containerSx={{ flex: 1 }}
                value={rates.value}
                onChange={(val) => masintonChange('rates', val)}
                error={rates.error}
                helperText={rates.error && rates.errorMessage}
              />
              <Input
                label="Masa Tenggang"
                placeholder="Input Masa Tenggang"
                containerSx={{ flex: 1 }}
                value={gracePeriod.value}
                onChange={(val) => masintonChange('gracePeriod', val)}
                error={gracePeriod.error}
                helperText={gracePeriod.error && gracePeriod.errorMessage}
              />
              <Input
                isMandatory
                label="Tujuan Pembiayaan"
                placeholder="Input Tujuan Pembiayaan"
                containerSx={{ flex: 1 }}
                value={financingObjectives.value}
                onChange={(val) => masintonChange('financingObjectives', val)}
                error={financingObjectives.error}
                helperText={financingObjectives.error && financingObjectives.errorMessage}
              />
            </>
          ) : (
            <>
              <Input
                isMandatory
                label="Tujuan Pembiayaan"
                placeholder="Input Tujuan Pembiayaan"
                containerSx={{ flex: 1 }}
                value={financingObjectives.value}
                onChange={(val) => masintonChange('financingObjectives', val)}
                disabled={existing}
                error={financingObjectives.error}
                helperText={financingObjectives.error && financingObjectives.errorMessage}
              />
              {renderDebiturInput()}

              <SyariahForm
                paymentScheme={product.value}
                onChangeSyariahForm={onChangeSyariahForm}
                financingFacilityData={financingFacilityDataSyariah}
                existing={existing}
                facilityId={facilityId}
              />
            </>
          )}

          {financingSegment.value !== 'SYARIAH' && (
            <Input
              label="Jaminan/Penugasan pemerintah"
              placeholder="Input Jaminan/Penugasan pemerintah"
              type="dropdown"
              containerSx={{ flex: 1 }}
              dropdownList={governmentMandateList}
              value={governmentMandate.value}
              onChange={(val) => masintonChange('governmentMandate', val)}
              error={governmentMandate.error}
              helperText={governmentMandate.error && governmentMandate.errorMessage}
            />
          )}

          {existing && financingSegment.value !== 'SYARIAH' && (
            <>
              <Currency
                label="O/S"
                placeholder="0.00"
                value={{ currency: currencyOutstanding.value, value: outstanding.value }}
                disabled
                disabledCurrency
              />
              <Input
                label="Kolektibilitas"
                placeholder="Kolektibilitas"
                type="text"
                containerSx={{ flex: 1 }}
                value="Kolektibilitas"
                disabled
              />
              {currencyOutstanding.value === 'USD' && (
                <Currency
                  label="O/S (Dalam rp)"
                  placeholder="0.00"
                  value={{ currency: 'IDR', value: multiplyNominalValues(outstanding.value, exchangeRate.value) }}
                  disabled
                  disabledCurrency
                />
              )}
            </>
          )}
        </Box>

        <Input
          type="area"
          label="Keterangan"
          placeholder="Input Keterangan"
          containerSx={{ flex: 1 }}
          rows={4}
          multiline
          value={remark.value}
          onChange={(val) => masintonChange('remark', val)}
        />

        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ py: theme.spacing(1) }}
        >
          Informasi Proyek:
        </TextStyle>

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Autocomplete
            label="Nama Proyek"
            placeholder="Choose Nama Proyek"
            dropdownList={projectList}
            value={projectList?.find((p) => p.label === projectId.value) || null}
            onChange={(val) => masintonChange('projectId', val?.label || '')}
            disabled={existing}
          />
          <Input
            disabled
            label="Lokasi Proyek (Provinsi)"
            type="text"
            placeholder="Provinsi"
            containerSx={{ flex: 1 }}
            value={projectDetail?.provinceLabel || ''}
          />
          <Currency
            label="Nilai Proyek"
            placeholder="Nilai Proyek"
            containerSx={{ flex: 1 }}
            value={{
              currency: projectDetail?.curValue || 'IDR',
              value: projectDetail?.value || '',
            }}
            disabled
          />
          <Input
            label="Lokasi Proyek (Kota - Kabupaten)"
            type="text"
            placeholder="Kota/Kabupaten"
            containerSx={{ flex: 1 }}
            value={projectDetail?.cityLabel || ''}
            disabled
          />
          {projectDetail?.curValue === 'USD' && (
            <Currency
              label="Exchange Rate"
              placeholder="Exchange Rate"
              containerSx={{ flex: 1 }}
              value={{ currency: projectDetail?.curExchangeRate || 'IDR', value: projectDetail?.exchangeRate || '' }}
              disabled
            />
          )}
          <Input
            label="Sektor yang dibiayai"
            type="text"
            placeholder="Sektor yang dibiayai"
            containerSx={{ flex: 1 }}
            value={projectDetail?.sectorLabel || ''}
            disabled
          />
          <Input
            label="Lokasi Proyek (Kecamatan)"
            type="text"
            placeholder="Kecamatan"
            containerSx={{ flex: 1 }}
            value={projectDetail?.districtLabel || ''}
            disabled
          />
          {projectDetail?.curValue === 'USD' && (
            <>
              <Currency
                label="Nilai Proyek (dalam Rupiah)"
                placeholder="Nilai Proyek"
                containerSx={{ flex: 1 }}
                value={{
                  currency: 'IDR',
                  value: projectDetail?.valueInIdr || '',
                }}
                disabled
              />
              <Box sx={{ flex: 1 }} />
            </>
          )}
        </Box>

        {/* Informasi PK */}
        {/* {!isPKLS && (
          <>
            <TextStyle
              variant="body3"
              weight={600}
              color={theme.palette.primary.main}
              sx={{ py: theme.spacing(1) }}
            >
              Informasi PK:
            </TextStyle>

            <Box
              sx={{
                display: 'grid',
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Input
                label="Tanggal Update Data"
                type="text"
                placeholder="Tanggal Update Data"
                value={financingPk?.modifiedDate ? toDateStringNumber(financingPk?.modifiedDate) : '-'}
                disabled
              />
              <Input
                label="Last PK Number"
                type="text"
                placeholder="Last PK Number"
                value={financingPk?.lastPkNumber ?? '-'}
                disabled
              />
            </Box>
          </>
        )} */}
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={disabledSave || isAutoSaveFetching}
          isLoading={isLoadingSave}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default ModalFormFacility;
