'use client';
import { useEffect } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { toDateStringNumber } from '@/helpers/date';
import { multiplyNominalValues } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';


import { modal } from '../../FinancingOverview.constants';

import useModalFormFacility from './ModalFormFacility.hook';
import SyariahForm from './SyariahForm/SyariahForm';


const ModalFormFacility = NiceModal.create((
  { existing, id, onSuccess }: any) => {
  const theme = useTheme();
  const modalId = modal.FORM_FACILITY;
  const modal_mip = useModal(modalId);
  const { facilityId } = useIdentity();


  const {
    masintonForm,
    orderTypeList,
    financingSegmentList,
    productList,
    financingFacilityDataSyariah,
    projectList,
    projectDetail,
    governmentMandateList,
    disabledSave,
    onChangeSyariahForm,
    handleSubmit,
    masintonChange,
    masintonMultiChange,
    masintonReset,
    currencyDropdownList,
    isLoadingSave,
    syariahComponentConfig,
  } = useModalFormFacility({ existing, id, onSuccess });


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
    currencyOutstanding,
    mappingOrderType,
    mappingProduct,
    mappingFinancingSegment,
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
      title={title}
      isOpen={modal_mip.visible}
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
            regex={null}
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
            regex={null}
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
            regex={null}
          />

          {
            financingSegment.value !== 'SYARIAH' && (

              <>
                <Input
                  label="Masa penarikan"
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
                  onChange= {(val) => {
                    masintonChange('orderValue', val.value);
                  }}
                  onCurrencyChange= {(val) => {
                    if (val.currency === 'IDR') {
                      masintonMultiChange({
                        currencyOrderValue: val,
                        exchangeRate: '',
                        orderValueAfterExchangeRate: '',
                      });
                    } else {
                      masintonMultiChange({
                        currencyOrderValue: val,
                        exchangeRate: currencyDropdownList.find((dt) => dt.value === val)?.rate || '',
                      });
                    }
                  }}
                  error={orderValue.error}
                  helperText={orderValue.error && orderValue.errorMessage}
                />

                {
                  currencyOrderValue.value === 'USD' ? (
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
                  ) : null
                }

                <Input
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
                  label="Rate"
                  placeholder="Rate"
                  containerSx={{ flex: 1 }}
                  value={rates.value}
                  onChange={(val) => masintonChange('rates', val)}

                  error={rates.error}
                  helperText={rates.error && rates.errorMessage}
                  regex={null}
                />

                <Input
                  label="Masa Tenggang"
                  placeholder="Input Masa Tenggang"
                  containerSx={{ flex: 1 }}
                  value={gracePeriod.value}
                  onChange={(val) => masintonChange('gracePeriod', val)}

                  error={gracePeriod.error}
                  helperText={gracePeriod.error && gracePeriod.errorMessage}
                  regex={null}
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
              </>
            )
          }


          { financingSegment.value !== 'SYARIAH' && existing === true ?
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
                dropdownList={governmentMandateList}
                value="Kolektibilitas"
                disabled={true}
              />

              {currencyOutstanding.value === 'USD' ?
                <Currency
                  label="O/S (Dalam rp)"
                  placeholder="0.00"
                  value={{ currency: 'IDR', value: multiplyNominalValues(outstanding.value, exchangeRate.value) }}
                  disabled
                  disabledCurrency
                /> : null}
            </> : null}

          { financingSegment.value !== 'SYARIAH' ?
            <>
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
            :

            <>
              <Input
                label="Tujuan Pembiayaan"
                placeholder="Input Tujuan Pembiayaan"
                containerSx={{ flex: 1 }}
                value={financingObjectives.value}
                onChange={(val) => masintonChange('financingObjectives', val)}
                error={financingObjectives.error}
                helperText={financingObjectives.error && financingObjectives.errorMessage}
                regex={null}
              />

              {renderDebiturInput()}

              <SyariahForm
                paymentScheme={product.value}
                onChangeSyariahForm={onChangeSyariahForm}
                financingFacilityData={financingFacilityDataSyariah}
                existing={existing}
                facilityId={facilityId}
                syariahComponentConfig={syariahComponentConfig}
              />
            </>
          }


        </Box>

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
            value={projectList?.find((p) => p.name === projectId.value) ?? null}
            onChange={(val) => masintonChange('projectId', val?.label ?? '')}
            disabled={existing}
          />

          <Input
            disabled
            label="Lokasi Proyek (Provinsi)"
            type="text"
            placeholder="Provinsi"
            containerSx={{ flex: 1 }}
            value={projectDetail?.provinceLabel}
          />

          <Currency
            label="Nilai Proyek"
            placeholder="Nilai Proyek"
            containerSx={{ flex: 1 }}
            value={{
              currency: projectDetail?.curValue || 'IDR',
              value: projectDetail?.value,
            }}
            disabled
          />

          <Input
            label="Lokasi Proyek (Kota - Kabupaten)"
            type="text"
            placeholder="Kota/Kabupaten"
            containerSx={{ flex: 1 }}
            value={projectDetail?.cityLabel}
            disabled
          />

          {
            projectDetail.curValue === 'USD' ? (
              <Currency
                label="Exchange Rate"
                placeholder="Exchange Rate"
                containerSx={{ flex: 1 }}
                value={{ currency: projectDetail?.curExchangeRate, value: projectDetail?.exchangeRate }}
                disabled
              />
            ) : null
          }

          {
            financingSegment.value !== 'SYARIAH' ? (
              <Input
                label="Sektor yang dibiayai "
                type="text"
                placeholder="Sektor yang dibiayai "
                containerSx={{ flex: 1 }}
                value={projectDetail?.sectorLabel}
                disabled
              />
            ) : null
          }


          <Input
            label="Lokasi Proyek (Kecamatan)"
            type="text"
            placeholder="Kecamatan"
            containerSx={{ flex: 1 }}
            value={projectDetail?.districtLabel}
            disabled
          />

          {
            projectDetail.curValue === 'USD' ? (
              <>
                <Currency
                  label="Nilai Proyek (dalam Rupiah)"
                  placeholder="Nilai Proyek"
                  containerSx={{ flex: 1 }}
                  value={{
                    currency: 'IDR',
                    value: projectDetail?.valueInIdr,
                  }}
                  disabled
                />
                <Box sx={{ flex: 1 }} />
              </>
            ) : null
          }
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
          disabled={disabledSave}
          isLoading={isLoadingSave}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default ModalFormFacility;
