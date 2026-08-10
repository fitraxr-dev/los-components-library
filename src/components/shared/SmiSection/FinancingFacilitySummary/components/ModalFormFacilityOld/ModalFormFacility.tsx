'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { multiplyNominalValues } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

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
  const { facilityId } = useIdentity();
  const theme = useTheme();
  const modalId = modal.PAYMENT_FACILITY_FORM;
  const { visible } = useModal(modalId);

  const {
    financingSegmentList,
    masintonForm,
    orderTypeList,
    orderTypeListExisting,
    productList,
    projectDetail,
    projectList,
    handleSubmit,
    masintonChange,
    masintonReplace,
    existing,
  } = useModalFormFacility(props);

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
  } = masintonForm;

  const isExisting = existing || orderType.value === 'NEW_FROM_EXISTING_FACILITY';
  const title = isExisting
    ? 'Add Fasilitas Pembiayaan Eksisting'
    : facilityId
      ? 'Edit Fasilitas Pembiayaan'
      : 'Add New Fasilitas Pembiayaan';

  const isMandatoryEmpty =
    !orderType.value ||
    !product.value ||
    !financingSegment.value ||
    !orderValue.value ||
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
            isMandatory
            label="Order Type"
            type="dropdown"
            placeholder="Choose Order Status"
            containerSx={{ flex: 1 }}
            dropdownList={existing ? orderTypeListExisting : orderTypeList}
            value={orderType.value}
            onChange={(val) => masintonChange('orderType', val)}
            disabled
            error={orderType.error}
            helperText={orderType.error && orderType.errorMessage}
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
          />

          <Currency
            isMandatory
            label="Nominal Pengajuan"
            placeholder="Input Nominal Pengajuan"
            containerSx={{ flex: 1 }}
            value={{ currency: currencyOrderValue.value, value: orderValue.value }}
            onChange={(val) => {
              const newMasintonForm = structuredClone(masintonForm);
              newMasintonForm.orderValue.value = val.value;
              newMasintonForm.currencyOrderValue.value = val.currency;
              masintonReplace(newMasintonForm);
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
                  label="Nilai Pengajuan (dalam Rupiah)"
                  placeholder="Nilai Pengajuan"
                  containerSx={{ flex: 1 }}
                  value={{ currency: 'IDR', value: orderValueAfterExchangeRate.value }}
                  onChange={(val) => masintonChange('orderValueAfterExchangeRate', val)}
                  disabled
                />
              </>
            ) : null
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
          <Input
            label="Nama Proyek"
            type="dropdown"
            placeholder="Choose Nama Proyek"
            dropdownList={projectList}
            value={projectId.value}
            onChange={(val) => masintonChange('projectId', val)}
            disabled={existing}
          />

          <Input
            disabled
            label="Lokasi Proyek (Provinsi)"
            type="text"
            placeholder="Provinsi"
            containerSx={{ flex: 1 }}
            value={projectDetail.provinceLabel}
            onChange={(val) => masintonChange('orderType', val)}
          />

          <Currency
            label="Nilai Proyek"
            placeholder="Nilai Proyek"
            containerSx={{ flex: 1 }}
            value={{
              currency: projectDetail.curValue,
              value: projectDetail.value2,
            }}
            disabled
          />

          <Input
            label="Lokasi Proyek (Kota - Kabupaten)"
            type="text"
            placeholder="Kota/Kabupaten"
            containerSx={{ flex: 1 }}
            value={projectDetail.cityLabel}
            disabled
          />

          {
            projectDetail.curValue === 'USD' ? (
              <Currency
                label="Exchange Rate"
                placeholder="Exchange Rate"
                containerSx={{ flex: 1 }}
                value={{ currency: 'IDR', value: projectDetail.exchangeRate }}
                disabled
              />
            ) : null
          }

          <>
            {
              projectDetail.curValue !== 'USD' ? (
                <Box sx={{ flex: 1 }} />
              ) : null
            }
            <Input
              label="Lokasi Proyek (Kecamatan)"
              type="text"
              placeholder="Kecamatan"
              containerSx={{ flex: 1 }}
              value={projectDetail.districtLabel}
              disabled
            />
          </>

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
          disabled={isMandatoryEmpty}
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
