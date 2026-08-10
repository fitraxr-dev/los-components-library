'use client';
import { useEffect } from 'react';

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

import { modal } from '../TablePaymentFacility.constants';

import useModalFormFacility from './ModalFormFacility.hook';


const ModalFormFacility = NiceModal.create((props: SmiComponentProps) => {
  const theme = useTheme();
  const { facilityId } = useIdentity();
  const modalId = modal.PAYMENT_FACILITY_FORM;
  const { visible } = useModal(modalId);


  const {
    masintonForm,
    orderTypeList,
    financingSegmentList,
    productList,
    projectList,
    projectDetail,
    governmentMandateList,
    handleSubmit,
    masintonChange,
    masintonMultiChange,
    masintonReset,
    existing,
  } = useModalFormFacility(props);

  useEffect(() => {
    return () => masintonReset();
  }, []);

  const {
    orderType,
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
    currencyOutstanding,
  } = masintonForm;

  const isExisting = existing || orderType.value === 'NEW_FROM_EXISTING_FACILITY';
  const title = isExisting
    ? 'Add Fasilitas Pembiayaan Eksisting'
    : facilityId
      ? 'Edit Fasilitas Pembiayaan'
      : 'Add New Fasilitas Pembiayaan';


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
            label="Jangka Waktu"
            placeholder="Input Jangka Waktu"
            containerSx={{ flex: 1 }}
            value={timePeriod.value}
            onChange={(val) => masintonChange('timePeriod', val)}

            error={timePeriod.error}
            helperText={timePeriod.error && timePeriod.errorMessage}
            regex={null}
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
                  onChange={(val) => masintonChange('orderValueAfterExchangeRate', val.value)}
                  disabled
                />
              </>
            ) : null
          }

          {
            financingSegment.value !== 'SYARIAH' ? (
              <>
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

                {existing === true ?
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

              </>
            ) : (
              <>
                <Input
                  label="Ekspektasi Bagi Hasil"
                  placeholder="Input Ekspektasi Bagi Hasil"
                  containerSx={{ flex: 1 }}
                  value={profitSharingExpectations.value}
                  onChange={(val) => masintonChange('profitSharingExpectations', val)}
                  disabled={existing}
                  error={profitSharingExpectations.error}
                  helperText={profitSharingExpectations.error && profitSharingExpectations.errorMessage}
                  regex={null}
                />
                <Input
                  label="Masa Tenggang"
                  placeholder="Input Masa Tenggang"
                  containerSx={{ flex: 1 }}
                  value={gracePeriod.value}
                  onChange={(val) => masintonChange('gracePeriod', val)}
                  disabled={existing}
                  error={gracePeriod.error}
                  helperText={gracePeriod.error && gracePeriod.errorMessage}
                  regex={null}
                />
                <Input
                  label="Periode Pembelian Porsi"
                  placeholder="Input Periode Pemberian Porsi"
                  containerSx={{ flex: 1 }}
                  value={portionPurchasePeriod.value}
                  onChange={(val) => masintonChange('portionPurchasePeriod', val)}
                  disabled={existing}
                  error={portionPurchasePeriod.error}
                  helperText={portionPurchasePeriod.error && portionPurchasePeriod.errorMessage}
                  regex={null}
                />
                <Input
                  label="Pemberi fasilitas"
                  placeholder="Input Pemberi fasilitas"
                  containerSx={{ flex: 1 }}
                  value={providingFacilities.value}
                  onChange={(val) => masintonChange('providingFacilities', val)}
                  disabled={existing}
                  error={providingFacilities.error}
                  helperText={providingFacilities.error && providingFacilities.errorMessage}
                />
                <Input
                  label="Periode Pembayaran Porsi"
                  placeholder="Input Periode Pembayaran Porsi"
                  containerSx={{ flex: 1 }}
                  value={portionPaymentPeriod.value}
                  onChange={(val) => masintonChange('portionPaymentPeriod', val)}
                  disabled={existing}
                  error={portionPaymentPeriod.error}
                  helperText={portionPaymentPeriod.error && portionPaymentPeriod.errorMessage}
                  regex={null}
                />
                <Input
                  label="Jaminan / Penugasan pemerintah"
                  placeholder="Input Jaminan / Penugasan pemerintah"
                  type="dropdown"
                  containerSx={{ flex: 1 }}
                  dropdownList={governmentMandateList}
                  value={governmentMandate.value}
                  onChange={(val) => masintonChange('governmentMandate', val)}
                  disabled={existing}
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
                  disabled={existing}
                  error={financingObjectives.error}
                  helperText={financingObjectives.error && financingObjectives.errorMessage}
                  regex={null}
                />
                <Input
                  label="Sifat / Bentuk"
                  placeholder="Input Sifat / Bentuk"
                  containerSx={{ flex: 1 }}
                  value={characteristic.value}
                  onChange={(val) => masintonChange('characteristic', val)}
                  disabled={existing}
                  error={characteristic.error}
                  helperText={characteristic.error && characteristic.errorMessage}
                  regex={null}
                />
              </>
            )
          }
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
            value={projectId.value}
            onChange={(val) => masintonChange('projectId', val?.label)}
            disabled={existing}
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
            projectDetail?.curValue === 'USD' ? (
              <Currency
                label="Exchange Rate"
                placeholder="Exchange Rate"
                containerSx={{ flex: 1 }}
                value={{ currency: projectDetail?.curExchangeRate, value: projectDetail?.exchangeRate }}
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
                  label="Nilai Proyek (dalam Rupiah)"
                  placeholder="Nilai Proyek"
                  containerSx={{ flex: 1 }}
                  value={{
                    currency: 'IDR',
                    value: multiplyNominalValues(projectDetail?.value, projectDetail?.exchangeRate),
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
          onClick={() => handleSubmit()}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default ModalFormFacility;
