'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

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

import { modal } from '../../TablePaymentFacility.constants';

import useModalFormFacility from './ModalFormFacility.hook';
import SyariahForm from './SyariahForm/SyariahForm';


const ModalFormFacility = NiceModal.create((props: SmiComponentProps) => {
  const { facilityId } = useIdentity();
  const theme = useTheme();
  const modalId = modal.PAYMENT_FACILITY_FORM;
  const { visible } = useModal(modalId);

  const {
    setProjectField,
    financingSegmentList,
    masintonForm,
    orderTypeList,
    productList,
    projectDetail,
    projectList,
    handleSubmit,
    masintonChange,
    masintonReplace,
    existing,
    onChangeSyariahForm,
    financingFacilityData,
    currencyDropdownList,
    governmentMandateList,
    syariahFormMandatoryEmpty,
    isOrderValueUnchanged,
    syariahComponentConfig,
    hasSyariahMappingError,
    masintonMultiChange,
    financingFacilityDataSyariah,
  } = useModalFormFacility(props);

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
    timePeriod,
    rates,
    gracePeriod,
    outstanding,
    currencyOutstanding,
    financingObjectives,
    governmentMandate,
  } = masintonForm;

  const isExisting = existing;

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

  const title = isExisting
    ? 'Add Fasilitas Pembiayaan Eksisting'
    : facilityId
      ? 'Edit Fasilitas Pembiayaan'
      : 'Add New Fasilitas Pembiayaan';

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING' || financingFacilityData?.orderType === 'New From Existing';

  const isMandatoryEmpty =
    (!showTooltips && !orderType.value) ||
    (!showTooltips && !product.value) ||
    (!showTooltips && !financingSegment.value) ||
    financingSegment.value !== 'SYARIAH' && !orderValue.value ||
    financingSegment.value === 'SYARIAH' && (!showTooltips && !financingObjectives.value) ||
    financingSegment.value === 'SYARIAH' && syariahFormMandatoryEmpty ||
    !currencyOrderValue.value;


  return (
    <SectionModal
      title={title}
      isOpen={visible}
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
            isMandatory={!showTooltips}
            label="Order Type"
            type="dropdown"
            placeholder="Choose Order Status"
            containerSx={{ flex: 1 }}
            dropdownList={orderTypeList}
            value={orderType.value}
            onChange={(val) => masintonChange('orderType', val)}
            disabled
            error={orderType.error}
            helperText={orderType.error && orderType.errorMessage}
          />

          <Input
            isMandatory={!showTooltips}
            label="Segmen Pembiayaan"
            type="dropdown"
            placeholder="Choose Segmen Pembiayaan"
            containerSx={{ flex: 1 }}
            dropdownList={financingSegmentList}
            value={financingSegment.value}
            onChange={(val) => masintonChange('financingSegment', val)}
            error={financingSegment.error}
            helperText={financingSegment.error && financingSegment.errorMessage}
            disabled={showTooltips}
          />

          <Input
            isMandatory={!showTooltips}
            label={financingSegment.value !== 'SYARIAH' ? 'Produk' : 'Skema Pembiayaan'}
            type="dropdown"
            placeholder={financingSegment.value !== 'SYARIAH' ? 'Choose Produk' : 'Choose Skema pembiayaan'}
            containerSx={{ flex: 1 }}
            dropdownList={productList}
            value={product.value}
            onChange={(val) => masintonChange('product', val)}
            error={product.error || hasSyariahMappingError}
            helperText={
              product.error && product.errorMessage
                ? product.errorMessage
                : hasSyariahMappingError
                  ? 'Skema belum dimapping, mohon kontak Admin'
                  : ''
            }
            disabled={showTooltips}
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
            </> : null
          }

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
            dropdownList={projectList || []}
            value={projectList?.find((dt) => dt.id === projectId.value)}
            onInputChange={(v) => setProjectField(v)}
            onChange={(v) => masintonChange('projectId', v.id)}
          />

          <Input
            disabled
            label="Lokasi Proyek (Provinsi)"
            type="text"
            placeholder="Provinsi"
            containerSx={{ flex: 1 }}
            value={projectDetail?.provinceLabel}
            onChange={(val) => masintonChange('orderType', val)}
          />

          <Currency
            currencyList={currencyDropdownList}
            label="Nilai Proyek"
            placeholder="Nilai Proyek"
            containerSx={{ flex: 1 }}
            value={{
              currency: projectDetail?.curValue,
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
            projectDetail?.curValue === 'USD' ? (
              <Currency
                currencyList={currencyDropdownList}
                label="Exchange Rate"
                placeholder="Exchange Rate"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: projectDetail?.exchangeRate }}
                disabled
              />
            ) : null
          }

          <>
            {
              projectDetail?.curValue !== 'USD' ? (
                <Box sx={{ flex: 1 }} />
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
          </>

          {
            projectDetail?.curValue === 'USD' ? (
              <>
                <Currency
                  currencyList={currencyDropdownList}
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
      </ColumnWrapper >

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          disabled={isMandatoryEmpty}
          onClick={() => handleSubmit()}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal >
  );
},
);

export default ModalFormFacility;
