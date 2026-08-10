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


import { MODALPK } from '../../PK.constants';

import useModalFormFacilityPengajuanPerikatan from './ModalFormFacilityPengajuanPerikatan.hook';


const ModalFormFacilityPengajuanPerikatan = NiceModal.create((
  { existing, id }: any) => {
  const theme = useTheme();
  const modalId = MODALPK.FORM_FACILITY_PENGAJUAN_PERIKATAN;
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
    isLoadingSave,
    setProductModule,
    formatMappingProductSegment,
    onChangeSyariahForm,
    financingFacilityDataSyariah,
  } = useModalFormFacilityPengajuanPerikatan({ existing, id });

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
    profitSharingExpectations,
    gracePeriod,
    providingFacilities,
    portionPaymentPeriod,
    portionPurchasePeriod,
    governmentMandate,
    financingObjectives,
    characteristic,
    outstanding,
    mappingOrderType,
    currencyOutstanding,
    mappingFinancingSegment,
    mappingProduct,
  } = masintonForm;
  existing = existing || orderType.value === 'NEW_FROM_EXISTING_FACILITY';

  const renderDebiturInput = () => {
    switch (product?.value) {
      case 'AL_IJARAH':
        return (
          <Input
            label="Penyewa/Musta'jir"
            type="text"
            containerSx={{ flex: 1 }}
            value={debtorName?.value}
            disabled
          />
        );
      case 'AL_IJARAH_MAUSHUFA_FI_AL_DZIMMAH_IMFZ':
        return (
          <Input
            label="Penyewa/Musta'jir"
            type="text"
            containerSx={{ flex: 1 }}
            value={debtorName?.value}
            disabled
          />
        );
      case 'AL_IJARAH_MUNTAHIYYA_BI_AL_TAMLIK_IMBT':
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

  const title = existing
    ? 'Add Fasilitas Pembiayaan Eksisting'
    : facilityId
      ? 'Edit Fasilitas Pembiayaan'
      : 'Add New Fasilitas Pembiayaan';


  return (
    <SectionModal
      customHeader={
        <RowWrapper
          sx={{
            borderBottom: '0.1vw solid',
            borderColor: theme.palette.custom.gray30,
            justifyContent: 'center',
            marginBottom: theme.spacing(4),
            p: 1,
          }}
        >
          <TextStyle variant="body1" weight={600} color={theme.palette.primary.main}>
            {title}
          </TextStyle>
        </RowWrapper>
      }
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        {/* Informasi Fasilitas */}
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
            isMandatory
            label="Order Type"
            type="dropdown"
            placeholder="Choose Order Type"
            containerSx={{ flex: 1 }}
            dropdownList={orderTypeList}
            value={orderType.value}
            onChange={(val) => masintonChange('orderType', val)}
            error={orderType.error}
            helperText={orderType.error && orderType.errorMessage}
            regex={null}
          />
          <Input
            label="Segmen Pembiayaan"
            type="dropdown"
            placeholder="Choose Segmen Pembiayaan"
            containerSx={{ flex: 1 }}
            dropdownList={financingSegmentList}
            value={financingSegment.value}
            onChange={(val) => {
              setProductModule(`product${val.toLowerCase()}`);
              const coreMappingValue =
                val === 'SYARIAH' ? 'SYARIAH' : (val ? 'KONVEN' : '');
              formatMappingProductSegment(coreMappingValue);
              masintonMultiChange({
                financingSegment: val,
                mappingFinancingSegment: coreMappingValue,
                mappingProduct: '',
                product: '',
              });
            }}
            disabled
            error={financingSegment.error}
            helperText={financingSegment.error && financingSegment.errorMessage}
            regex={null}
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
            regex={null}
          />
          <Input
            isMandatory
            label="CORE Mapping Segmen Pembiayaan"
            type="dropdown"
            placeholder="Choose CORE Mapping Segmen Pembiayaan"
            containerSx={{ flex: 1 }}
            dropdownList={mappingFinancingSegmentList}
            value={mappingFinancingSegment.value}
            onChange={(val) => {
              formatMappingProductSegment(val);
              masintonMultiChange({
                mappingFinancingSegment: val,
                mappingProduct: '',
              });
            }}
            disabled={!!financingSegment.value}
            error={mappingFinancingSegment.error}
            helperText={mappingFinancingSegment.error && mappingFinancingSegment.errorMessage}
            regex={null}
          />


          {/* KONVEN */}
          {
            financingSegment.value !== 'SYARIAH' ? (
              <>
                <Input
                  isMandatory
                  label="Jangka Waktu"
                  placeholder="Input Jangka Waktu"
                  containerSx={{ flex: 1 }}
                  value={timePeriod.value}
                  onChange={(val) => masintonChange('timePeriod', val)}
                  error={timePeriod.error}
                  helperText={timePeriod.error && timePeriod.errorMessage}
                  regex={null}
                />
                <Input
                  isMandatory
                  label="Produk"
                  type="dropdown"
                  placeholder="Choose Produk"
                  containerSx={{ flex: 1 }}
                  dropdownList={productList}
                  value={product.value}
                  onChange={(val) => masintonChange('product', val)}
                  disabled={existing}
                  error={product.error}
                  helperText={product.error && product.errorMessage}
                  regex={null}
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
                  regex={null}
                />
                <Input
                  isMandatory
                  label="Masa Penarikan"
                  placeholder="Input Masa Penarikan"
                  containerSx={{ flex: 1 }}
                  value={withdrawalPeriod.value}
                  onChange={(val) => masintonChange('withdrawalPeriod', val)}
                  error={withdrawalPeriod.error}
                  helperText={withdrawalPeriod.error && withdrawalPeriod.errorMessage}
                  regex={null}
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
                <Input
                  isMandatory
                  label="Masa Tenggang"
                  placeholder="Input Masa Tenggang"
                  containerSx={{ flex: 1 }}
                  value={gracePeriod.value}
                  onChange={(val) => masintonChange('gracePeriod', val)}

                  error={gracePeriod.error}
                  helperText={gracePeriod.error && gracePeriod.errorMessage}
                  regex={null}
                />


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
                <Input
                  isMandatory
                  label="Rates"
                  placeholder="Rates"
                  containerSx={{ flex: 1 }}
                  value={rates.value}
                  onChange={(val) => masintonChange('rates', val)}

                  error={rates.error}
                  helperText={rates.error && rates.errorMessage}
                  regex={null}
                />


                <Currency
                  isMandatory
                  label="Nominal Pembiayaan (dalam Rp)"
                  placeholder="Nilai Pembiayaan"
                  containerSx={{ flex: 1 }}
                  value={{ currency: 'IDR', value: orderValueAfterExchangeRate.value }}
                  onChange={(val) => masintonChange('orderValueAfterExchangeRate', val?.value)}
                  disabled
                />
                <Input
                  isMandatory
                  label="Jaminan / Penugasan Pemerintah"
                  placeholder="Choose Jaminan / Penugasan Pemerintah"
                  type="dropdown"
                  containerSx={{ flex: 1 }}
                  dropdownList={governmentMandateList}
                  value={governmentMandate.value}
                  onChange={(val) => masintonChange('governmentMandate', val)}
                  error={governmentMandate.error}
                  helperText={governmentMandate.error && governmentMandate.errorMessage}
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
                  regex={null}
                />
                <Input
                  label="O/S"
                  placeholder="Input O/S"
                  type="text"
                  containerSx={{ flex: 1 }}
                  value={outstanding.value}
                  disabled
                />


                <Input
                  label="Kolektibilitas"
                  placeholder="Kolektibilitas"
                  type="text"
                  containerSx={{ flex: 1 }}
                  dropdownList={governmentMandateList}
                  value="Kolektibilitas"
                  disabled={true}
                />

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
              </>
            ) : (
              <>
                {/* SYARIAH */}
                <Input
                  isMandatory
                  label="Skema Pembiayaan"
                  placeholder="Choose Skema Pembiayaan"
                  type="dropdown"
                  containerSx={{ flex: 1 }}
                  dropdownList={productList}
                  value={product.value}
                  onChange={(val) => masintonChange('product', val)}
                  disabled={existing}
                  error={product.error}
                  helperText={product.error && product.errorMessage}
                  regex={null}
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
                  regex={null}
                />

                <Input
                  label="O/S"
                  placeholder="Input O/S"
                  type="text"
                  containerSx={{ flex: 1 }}
                  value={outstanding.value}
                  disabled
                />

                {renderDebiturInput()}

                <SyariahForm
                  paymentScheme={product.value}
                  onChangeSyariahForm={onChangeSyariahForm}
                  financingFacilityData={financingFacilityDataSyariah}
                  existing={existing}
                  facilityId={id}
                />
              </>
            )
          }
        </Box>

        {/* Informasi Proyek */}
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
          <Input
            isMandatory
            label="Nama Proyek"
            type="dropdown"
            placeholder="Choose Nama Proyek"
            containerSx={{ flex: 1 }}
            // dropdownList={projectList}
            value={projectId.value}
            onChange={(val) => masintonChange('projectId', val)}
            error={orderType.error}
            helperText={orderType.error && orderType.errorMessage}
            regex={null}
            disabled={existing}
          />
          <Input
            disabled
            label="Lokasi Proyek (Provinsi)"
            type="dropdown"
            placeholder="Provinsi"
            containerSx={{ flex: 1 }}
            value={projectDetail?.provinceLabel}
            onChange={(val) => masintonChange('orderType', val)}
          />


          <Input
            disabled
            label="Nilai Proyek"
            type="text"
            placeholder="Nilai Proyek"
            containerSx={{ flex: 1 }}
            value={projectDetail?.provinceLabel}
            onChange={(val) => masintonChange('orderType', val)}
          />
          <Input
            label="Lokasi Proyek (Kota - Kabupaten)"
            type="dropdown"
            placeholder="Kota - Kabupaten"
            containerSx={{ flex: 1 }}
            value={projectDetail?.cityLabel}
            disabled
          />

          <Input
            label="Sektor yang dibiayai "
            type="text"
            placeholder="Sektor yang dibiayai "
            containerSx={{ flex: 1 }}
            value={projectDetail?.districtLabel}
            disabled
          />
          <Input
            label="Lokasi Proyek (Kecamatan)"
            type="dropdown"
            placeholder="Kecamatan"
            containerSx={{ flex: 1 }}
            value={projectDetail?.districtLabel}
            disabled
          />
        </Box>
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
          isLoading={isLoadingSave}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default ModalFormFacilityPengajuanPerikatan;
