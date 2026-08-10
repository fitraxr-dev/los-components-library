'use client';
//* in-use for modul
// Pipeline = default
// Pkls
// MIP
// MUP
// RISALAH_RAPAT
// SPFP
// Pengajuan Perikatan/Engagement Agreement
//* in-use for module and process
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Checkbox, Tooltip, useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../TablePaymentFacility.constants';

import InformasiSindikasi from './InformasiSindikasiTab/InformasiSindikasiTab';
import useModalFormFacility from './ModalFormFacility.hook';
import SyariahForm from './SyariahForm/SyariahForm';


const ModalFormFacility = NiceModal.create((props: SmiComponentProps) => {
  const { facilityId } = useIdentity();
  const theme = useTheme();
  const modalId = modal.PAYMENT_FACILITY_FORM;
  const { visible } = useModal(modalId);
  const { module, process } = props;

  const {
    setProjectField,
    financingSegmentList,
    floatingReferenceOptions,
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
    isAutoSaveFetching,
    isOrderValueUnchanged,
    syariahComponentConfig,
    hasSyariahMappingError,
    mappingFinancingSegmentList,
    mappingProductList,
    mapOrderTypeList,
    paymentScheme,
    rateTypeOptions,
    method,
    container,
    setContainer,
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
    financingObjectives,
    governmentMandate,
    withdrawalPeriod,
    timePeriod,
    rates,
    gracePeriod,
    mappingOrderType,
    mappingFinancingSegment,
    mappingProduct,
    rateType,
    floatingReference,
    childFacilityAlias,
  } = masintonForm;

  const isExisting = existing;
  const title = isExisting
    ? 'Add Fasilitas Pembiayaan Eksisting'
    : facilityId
      ? 'Edit Fasilitas Pembiayaan'
      : 'Add New Fasilitas Pembiayaan';

  const showTooltips =
    existing ||
    financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' ||
    financingFacilityData?.orderType === 'EXISTING' ||
    financingFacilityData?.orderType === 'New From Existing' ||
    masintonForm.orderType.value === 'NEW_FROM_EXISTING_FACILITY' ||
    masintonForm.orderType.value === 'EXISTING' ||
    masintonForm.orderType.value === 'New From Existing';

  // Whitelist module and process
  const additionalFieldsWhitelist = [
    { module: TypeModule.MIP, process: TypeProcess.MIP },
    { module: TypeModule.MUP, process: TypeProcess.MUP },
    { module: TypeModule.RISALAH_RAPAT, process: TypeProcess.RISALAH_RAPAT },
    { module: TypeModule.SPFP, process: TypeProcess.SPFP },
    { module: TypeModule.ENGAGEMENT_AGREEMENT, process: TypeProcess.ENGAGEMENT_AGREEMENT },
    { module: TypeModule.LPS, process: TypeProcess.LPS_CORE },
  ];

  const showAdditionalFields = additionalFieldsWhitelist.some(
    (item) => item.module === module && item.process === process
  );
  // Add field Core mapping product, Order type, Core mapping segmen pembiayaan
  const coreMappingProcesses = [TypeProcess.ENGAGEMENT_AGREEMENT, TypeProcess.LPS_CORE];
  const isCoreMappingProcess = coreMappingProcesses.includes(process as TypeProcess);

  const isAliasInvalid = childFacilityAlias.value && !/^[a-zA-Z0-9 ]*$/.test(childFacilityAlias.value);

  const isMandatoryEmpty =
    (!showTooltips && !orderType.value) ||
    (!showTooltips && !product.value) ||
    (!showTooltips && !financingSegment.value) ||
    financingSegment.value !== 'SYARIAH' && !orderValue.value ||
    (showAdditionalFields && financingSegment.value !== 'SYARIAH' && !financingObjectives.value) ||
    financingSegment.value === 'SYARIAH' && (!showTooltips && !financingObjectives.value) ||
    financingSegment.value === 'SYARIAH' && syariahFormMandatoryEmpty ||
    !currencyOrderValue.value ||
    (isCoreMappingProcess &&
      (!mappingOrderType.value ||
        !mappingFinancingSegment.value ||
        !mappingProduct.value ||
        (financingSegment.value === 'SYARIAH' &&
          ((rateType.value?.toUpperCase() === 'FLOATING' && !floatingReference.value) || isAliasInvalid))));
  return (
    <SectionModal
      title={title}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <FormProvider {...method}>
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

            {isCoreMappingProcess && (
              <Input
                isMandatory
                label="Mapping Order Type"
                type="dropdown"
                placeholder="Choose Mapping Order Type"
                containerSx={{ flex: 1 }}
                dropdownList={financingSegment.value === 'SYARIAH' ? orderTypeList : mapOrderTypeList}
                value={mappingOrderType.value}
                disabled={orderType.value && orderType.value !== 'NEW' ? false : true}
                onChange={(val) => masintonChange('mappingOrderType', val)}
                error={mappingOrderType.error}
                helperText={mappingOrderType.error && mappingOrderType.errorMessage}
              />
            )}

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

            {isCoreMappingProcess && (
              <Input
                isMandatory
                label="CORE Mapping Segmen Pembiayaan"
                type="dropdown"
                placeholder="Input CORE Mapping Segmen Pembiayaan"
                containerSx={{ flex: 1 }}
                dropdownList={financingSegmentList}
                value={mappingFinancingSegment.value}
                onChange={(val) => masintonChange('mappingFinancingSegment', val)}
                error={mappingFinancingSegment.error}
                helperText={mappingFinancingSegment.error && mappingFinancingSegment.errorMessage}
              />
            )}
            <Input
              isMandatory={!showTooltips}
              label={financingSegment.value !== 'SYARIAH' ? 'Produk' : 'Skema pembiayaan'}
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
            {isCoreMappingProcess && (
              <Input
                isMandatory
                label="CORE Mapping Produk"
                type="dropdown"
                placeholder="Choose CORE Mapping Produk"
                containerSx={{ flex: 1 }}
                dropdownList={mappingProductList}
                value={mappingProduct.value}
                onChange={(val) => masintonChange('mappingProduct', val)}
                // disabled={existing}
                error={mappingProduct.error}
                helperText={mappingProduct.error && mappingProduct.errorMessage}
              />
            )}

            {isCoreMappingProcess && financingSegment.value === 'SYARIAH' && (
              <>
                <Autocomplete
                  label="Tipe Rate"
                  placeholder="Choose Tipe Rate"
                  dropdownList={rateTypeOptions || []}
                  value={
                    rateTypeOptions?.find((opt: any) => opt.id?.toUpperCase() === rateType.value?.toUpperCase()) || null
                  }
                  onChange={(val) => masintonChange('rateType', val?.id || '')}
                  error={rateType.error}
                  helperText={rateType.error && rateType.errorMessage}
                />
                <Autocomplete
                  isMandatory={rateType.value?.toUpperCase() === 'FLOATING'}
                  label="Referensi Floating"
                  placeholder="Pilih Referensi Floating"
                  dropdownList={floatingReferenceOptions || []}
                  value={
                    floatingReferenceOptions?.find((opt: any) => opt.id === floatingReference.value) || null
                  }
                  onChange={(val) => masintonChange('floatingReference', val?.id || '')}
                  error={rateType.value?.toUpperCase() === 'FLOATING' && floatingReference.error}
                  helperText={
                    rateType.value?.toUpperCase() === 'FLOATING' &&
                    floatingReference.error &&
                    floatingReference.errorMessage
                  }
                />
                <Input
                  label="Alias Fasilitas Anak"
                  placeholder="Input Alias Fasilitas Anak"
                  containerSx={{ flex: 1 }}
                  value={childFacilityAlias.value}
                  onChange={(val) => masintonChange('childFacilityAlias', val)}
                  error={childFacilityAlias.error || isAliasInvalid}
                  helperText={
                    (childFacilityAlias.error && childFacilityAlias.errorMessage) ||
                    (isAliasInvalid ? 'Alias Fasilitas Anak hanya bisa input angka dan huruf' : '')
                  }
                />
              </>
            )}
            {financingSegment.value !== 'SYARIAH' &&
              <>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                    <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                      Nominal Pengajuan
                    </TextStyle>
                    <TextStyle variant="body4" weight={600} color={theme.palette.error.main}>
                      *
                    </TextStyle>
                    {(existing || facilityId) && showTooltips && (
                      <Tooltip
                        slotProps={{
                          tooltip: {
                            sx: {
                              '& .MuiTooltip-arrow': {
                                color: '#284A63',
                              },
                              backgroundColor: '#284A63',
                              borderRadius: '10px',
                              gap: '8px',
                              height: 'auto',
                              maxWidth: '300px',
                              minHeight: '80px',
                              opacity: 1,
                              overflow: 'hidden',
                              padding: '12px',
                              width: '300px',
                              wordWrap: 'break-word',
                            },
                          },
                        }}
                        title={
                          (() => {
                            const currentInputValue = orderValue.value ? parseFloat(orderValue.value.toString().replace(/,/g, '')) : 0;
                            const currentCurrency = currencyOrderValue.value;

                            let usdDifference = 0;
                            let idrDifference = 0;
                            let existingUsdValue = 0;
                            let existingIdrValue = 0;
                            let currentUsdValue = 0;
                            let currentIdrValue = 0;

                            if ((existing || facilityId) && financingFacilityData) {
                              const rawExistingValue = financingFacilityData?.existingOrderValue?.toString();
                              const existingOrderValue = (rawExistingValue && rawExistingValue !== 'null') ?
                                parseFloat(rawExistingValue.replace(/,/g, '')) : 0;

                              const existingCurrency = financingFacilityData?.currencyOrderValue;

                              const existingExchangeRate = (exchangeRate.value && exchangeRate.value !== '0') ?
                                parseFloat(exchangeRate.value.toString().replace(/,/g, '')) : 1;

                              if (existingCurrency === 'USD') {
                                // If existing record is in USD, then existingOrderValue is already USD
                                existingUsdValue = existingOrderValue;
                                existingIdrValue = existingExchangeRate > 0 ?
                                  existingOrderValue * existingExchangeRate : 0;
                              } else {
                                // If existing record is in IDR (default), then existingOrderValue is IDR
                                existingIdrValue = existingOrderValue;
                                existingUsdValue = existingExchangeRate > 0 ?
                                  existingOrderValue / existingExchangeRate : 0;
                              }

                              if (currentCurrency === 'USD') {
                                currentUsdValue = currentInputValue;
                                currentIdrValue = existingExchangeRate > 0 ?
                                  currentInputValue * existingExchangeRate : 0;
                              } else {
                                currentIdrValue = currentInputValue;
                                currentUsdValue = existingExchangeRate > 0 ?
                                  currentInputValue / existingExchangeRate : 0;
                              }

                              // Calculate differences using exchange rate from API (not input exchange rate)
                              if (currentCurrency === 'USD') {
                                // If current currency is USD, difference USD = current - existing USD
                                usdDifference = currentUsdValue - existingUsdValue;
                                // Difference IDR = difference USD * exchange rate from API
                                idrDifference = usdDifference * existingExchangeRate;
                              } else {
                                // If current currency is IDR, difference IDR = current - existing IDR
                                idrDifference = currentIdrValue - existingIdrValue;
                                // Difference USD = difference IDR / exchange rate from API
                                usdDifference = existingExchangeRate > 0 ? idrDifference / existingExchangeRate : 0;
                              }
                            }

                            const formatCurrency = (value: number) => {
                              if (isNaN(value) || !isFinite(value)) return '0';
                              return Math.round(value).toLocaleString('id-ID');
                            };

                            const getDifferenceSymbol = (diff: number) => {
                              if (diff > 0) return <span style={{ color: '#4CAF50', fontSize: '14px' }}>▲</span>;
                              if (diff < 0) return <span style={{ color: '#FF0000', fontSize: '14px' }}>▼</span>;
                              return <span style={{ color: 'white', fontSize: '14px' }}>-</span>;
                            };

                            return (
                              <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: '14px', gap: '8px' }}>
                                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'white', fontSize: '14px' }}>Existing</span>
                                </Box>

                                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'white', fontSize: '14px' }}>IDR</span>
                                  <span style={{ color: 'white', fontSize: '14px' }}>
                                    {(existing || facilityId) && financingFacilityData?.orderValue ? formatCurrency(existingIdrValue) : '-'}
                                  </span>
                                </Box>

                                {currencyOrderValue.value === 'USD' && (
                                  <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'white', fontSize: '14px' }}>USD</span>
                                    <span style={{ color: 'white', fontSize: '14px' }}>
                                      {(existing || facilityId) && financingFacilityData?.orderValue ? formatCurrency(existingUsdValue) : '-'}
                                    </span>
                                  </Box>
                                )}

                                <Box
                                  sx={{
                                    backgroundColor: '#666',
                                    height: '1px',
                                    my: 1,
                                    width: '100%',
                                  }}
                                />

                                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'white', fontSize: '14px' }}>Selisih</span>
                                </Box>

                                <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                                    {(existing || facilityId) &&
                                      getDifferenceSymbol(idrDifference)}
                                    <span style={{ color: 'white', fontSize: '14px' }}>IDR</span>
                                  </Box>
                                  <span style={{ color: 'white', fontSize: '14px' }}>
                                    {(existing || facilityId) && financingFacilityData?.orderValue ? formatCurrency(Math.abs(idrDifference)) : '-'}
                                  </span>
                                </Box>

                                {currencyOrderValue.value === 'USD' && (
                                  <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                                      {(existing || facilityId) &&
                                        getDifferenceSymbol(usdDifference)}
                                      <span style={{ color: 'white', fontSize: '14px' }}>USD</span>
                                    </Box>
                                    <span style={{ color: 'white', fontSize: '14px' }}>
                                      {(existing || facilityId) && financingFacilityData?.orderValue ? formatCurrency(Math.abs(usdDifference)) : '-'}
                                    </span>
                                  </Box>
                                )}
                              </Box>
                            );
                          })()
                        }
                        placement="right"
                      >
                        <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }}>
                          <Icon
                            iconName="new-info"
                            sx={{
                              '& path': { fill: '#D07C1B' },
                            }}
                          />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                  <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
                    {(existing || facilityId) && showTooltips && (
                      <Checkbox
                        checked={!isOrderValueUnchanged}
                        disabled
                        sx={{
                          '&.Mui-checked.Mui-disabled': {
                            color: '#D07C1B',
                          },
                          '&.Mui-disabled': {
                            color: '#D07C1B',
                          },
                        }}
                      />
                    )}
                    <Currency
                      currencyList={currencyDropdownList}
                      isMandatory={false}
                      label=""
                      placeholder="Input Nominal Pengajuan"
                      containerSx={{ flex: 1 }}
                      value={{ currency: currencyOrderValue.value, value: orderValue.value }}
                      onCurrencyChange={(val) => {
                        const newMasintonForm = structuredClone(masintonForm);
                        newMasintonForm.currencyOrderValue.value = val;
                        const exchangeRateFromApi = financingFacilityData?.exchangeRate;
                        const fallbackRate = currencyDropdownList?.find((dt) => dt.value === val)?.rate;
                        newMasintonForm.exchangeRate.value = exchangeRateFromApi || fallbackRate;
                        masintonReplace(newMasintonForm);
                      }}
                      onChange={(val) => {
                        const newMasintonForm = structuredClone(masintonForm);
                        newMasintonForm.orderValue.value = val.value;
                        masintonReplace(newMasintonForm);
                      }}
                      error={orderValue.error}
                      helperText={orderValue.error && orderValue.errorMessage}
                    />
                  </RowWrapper>
                </Box>
                {
                  currencyOrderValue.value === 'USD' ? (
                    <>
                      <Currency
                        currencyList={currencyDropdownList}
                        isMandatory={true}
                        label="Exchange Rate"
                        placeholder="Exchange Rate"
                        value={{ currency: 'IDR', value: exchangeRate.value }}
                        onChange={(val) => masintonChange('exchangeRate', val.value)}
                        error={exchangeRate.error}
                        helperText={exchangeRate.error && exchangeRate.errorMessage}
                        disabledCurrency
                      />

                      <Currency
                        currencyList={currencyDropdownList}
                        label="Nilai Pengajuan (dalam Rupiah)"
                        placeholder="Nilai Pengajuan"
                        containerSx={{ flex: 1 }}
                        value={{ currency: 'IDR', value: orderValueAfterExchangeRate.value }}
                        disabled
                      />
                    </>
                  ) : null
                }

                {showAdditionalFields && (
                  <>
                    <Input
                      label="Masa Penarikan"
                      placeholder="Input Masa Penarikan"
                      containerSx={{ flex: 1 }}
                      value={withdrawalPeriod.value}
                      onChange={(val) => masintonChange('withdrawalPeriod', val)}
                      error={withdrawalPeriod.error}
                      helperText={withdrawalPeriod.error && withdrawalPeriod.errorMessage}
                    />

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
                      placeholder="Input Rate"
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
                )}
              </>
            }
            {financingSegment.value !== 'SYARIAH' && (
              <>
                {/* Legend for Checkbox - Full Width */}
                {(existing || facilityId) && showTooltips && (
                  <Box
                    sx={{
                      backgroundColor: '#FFF8F0',
                      border: `1px solid ${'#FFF8F0'}`,
                      borderRadius: 1,
                      gridColumn: '1 / -1', // Span full width in grid
                      mt: 1,
                      p: 2,
                    }}
                  >
                    <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                      <Icon
                        iconName="new-info"
                        sx={{
                          '& path': { fill: '#D07C1B' },
                          color: '#D07C1B',
                        }}
                      />
                      <TextStyle variant="body4" color="#D07C1B" sx={{ lineHeight: 1.5 }}>
                        {(!isOrderValueUnchanged)
                          ? 'Checkbox pada Nominal Pengajuan aktif apabila terdapat perubahan nominal dari nilai existing'
                          : 'Checkbox pada Nominal Pengajuan tidak aktif tanpa perubahan nominal dari nilai existing'}
                      </TextStyle>
                    </Box>
                  </Box>
                )}

                <Input
                  label="Jaminan / Penugasan Pemerintah"
                  placeholder="Input Jaminan / Penugasan Pemerintah"
                  type="dropdown"
                  containerSx={{ flex: 1 }}
                  dropdownList={governmentMandateList}
                  value={governmentMandate.value}
                  onChange={(val) => masintonChange('governmentMandate', val)}
                  disabled={isExisting}
                  error={governmentMandate.error}
                  helperText={governmentMandate.error && governmentMandate.errorMessage}
                />

                <Box sx={{ flex: 1 }} />
              </>
            )}

            {financingSegment.value === 'SYARIAH' &&
              <Input
                isMandatory={!showTooltips}
                label="Tujuan Pembiayaan"
                type="text"
                placeholder="Tujuan Pembiayaan"
                containerSx={{ flex: 1 }}
                value={financingObjectives.value}
                onChange={(val) => masintonChange('financingObjectives', val)}
                error={financingObjectives.error}
                helperText={financingObjectives.error && financingObjectives.errorMessage}
              />
            }
          </Box>

          {financingSegment.value !== 'SYARIAH' && (
            <>
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
          )}

          {
            financingSegment.value === 'SYARIAH' &&
            <SyariahForm
              paymentScheme={paymentScheme}
              onChangeSyariahForm={onChangeSyariahForm}
              financingFacilityData={financingFacilityData}
              module={module}
              process={process}
              existing={existing}
              facilityId={facilityId}
              syariahComponentConfig={syariahComponentConfig}
            />
          }

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
              value={projectList?.find((dt) => Number(dt.id) === Number(projectId.value))}
              onInputChange={(v) => setProjectField(v)}
              onChange={(v) => masintonChange('projectId', v.id)}
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
              currencyList={currencyDropdownList}
              label="Nilai Proyek"
              placeholder="Nilai Proyek"
              containerSx={{ flex: 1 }}
              value={{
                currency: projectDetail.curValue,
                value: projectDetail.value,
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
                  currencyList={currencyDropdownList}
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

          <InformasiSindikasi container={container} setContainer={setContainer} />
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
            // disabled={isMandatoryEmpty || isAutoSaveFetching}
            onClick={() => handleSubmit()}
          >
            {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
          </Button>
        </RowWrapper>
      </FormProvider>
    </SectionModal >
  );
},
);

export default ModalFormFacility;
