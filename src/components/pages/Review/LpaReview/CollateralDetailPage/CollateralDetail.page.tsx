'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import FormUploadDocument from '@/components/shared/SmiComponent/FormUploadDocument';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { label, modal, type } from './CollateralDetail.constants';
import useCollateralDetail from './CollateralDetail.hook';
import ModalBoat from './components/ModalBoat';
import ModalBuilding from './components/ModalBuilding';
import ModalComplementaryFacilities from './components/ModalComplementaryFacilities';
import ModalInventory from './components/ModalInventory';
import ModalLand from './components/ModalLand';
import ModalMachineEquipment from './components/ModalMachineEquipment';
import ModalVehicles from './components/ModalVehicles';


const DebtorInformationPage = () => {
  const theme = useTheme();


  const {
    viewOnly,
    typeProperty,
    tableHeader,
    tableHeaderBuildingForLandBuilding,
    id,
    processId,
    collateralList,
    additionalInfoContainer,
    setadditionalInfoContainer,
    isLoading,
    handleCloseButton,
    data,
    watchField,
    collateralType,
    handleSaveLpaDetail,
    handleSubmit,
    typeBuilding,
    methods,
    control,
    currencyDropdownList,
    setValue,
    formState,
  } = useCollateralDetail();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Detail Agunan" />

        <SectionTitle title={label[collateralType]} isOpen sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              mb: collateralType === type.LAND_BUILDING ? 3 : 0,
            }}
          >

            <Controller
              name="objectLocation"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Lokasi Objek"
                  placeholder="Input Lokasi Objek"
                  disabled={viewOnly}
                />
              )}
            />

            <Controller
              control={control}
              name="coordinate"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Lokasi Koordinat"
                  placeholder="Input Lokasi Koordinat"
                  disabled={viewOnly}
                />
              )}
            />

            {/* Left Column - Market Value Section */}
            <Controller
              control={control}
              name="marketValue"
              render={({ field }) => (
                <Currency
                  currencyList={currencyDropdownList}
                  label="Nilai Pasar"
                  placeholder="Input Nilai Pasar"
                  containerSx={{ flex: 1 }}
                  value={{ currency: watchField.marketValueCurrencyCode, value: field.value }}
                  onCurrencyChange={(val) => {
                    setValue('marketValueCurrencyCode', val);
                  }}
                  onChange={(val) => {
                    field.onChange(val.value);
                    // Calculate market value in IDR when value or currency changes
                    if (watchField.marketValueCurrencyCode === 'USD' && watchField.marketValueFxRateToIdr) {
                      const marketValue = parseFloat((val.value || '0').replace(/,/g, ''));
                      const exchangeRate = parseFloat((watchField.marketValueFxRateToIdr || '1').replace(/,/g, ''));
                      const calculatedValue = marketValue * exchangeRate;
                      setValue('marketValueIdr', calculatedValue.toString());
                    } else if (watchField.marketValueCurrencyCode === 'IDR') {
                      setValue('marketValueIdr', val.value || '0');
                    }
                  }}
                  disabled={viewOnly}
                />
              )}
            />

            {/* Right Column - Indication Liquidation Value Section */}
            <Controller
              control={control}
              name="indicationLiquidationValue"
              render={({ field }) => (
                <Currency
                  currencyList={currencyDropdownList}
                  label="Indikasi Nilai Likuidasi"
                  placeholder="Input Indikasi Nilai Likuidasi"
                  containerSx={{ flex: 1 }}
                  value={{ currency: watchField.indicationLiquidationCurrencyCode, value: field.value }}
                  onCurrencyChange={(val) => {
                    setValue('indicationLiquidationCurrencyCode', val);
                  }}
                  onChange={(val) => {
                    field.onChange(val.value);
                    // Calculate liquidation value in IDR when value or currency changes
                    if (watchField.indicationLiquidationCurrencyCode === 'USD' && watchField.indicationLiquidationFxRateToIdr) {
                      const liquidationValue = parseFloat((val.value || '0').replace(/,/g, ''));
                      const exchangeRate = parseFloat((watchField.indicationLiquidationFxRateToIdr || '1').replace(/,/g, ''));
                      const calculatedValue = liquidationValue * exchangeRate;
                      setValue('indicationLiquidationIdr', calculatedValue.toString());
                    } else if (watchField.indicationLiquidationCurrencyCode === 'IDR') {
                      setValue('indicationLiquidationIdr', val.value || '0');
                    }
                  }}
                  disabled={viewOnly}
                />
              )}
            />

            {/* Left Column - Exchange Rate for Market Value */}
            {watchField.marketValueCurrencyCode === 'USD' ? (
              <Controller
                control={control}
                name="marketValueFxRateToIdr"
                render={({ field }) => (
                  <Currency
                    currencyList={currencyDropdownList}
                    label="Kurs"
                    placeholder="Kurs"
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: field.value }}
                    disabledCurrency
                    onChange={(val) => {
                      field.onChange(val.value);
                      // Recalculate market value in IDR when exchange rate changes
                      if (watchField.marketValue) {
                        const marketValue = parseFloat((watchField.marketValue || '0').replace(/,/g, ''));
                        const exchangeRate = parseFloat((val.value || '1').replace(/,/g, ''));
                        const calculatedValue = marketValue * exchangeRate;
                        setValue('marketValueIdr', calculatedValue.toString());
                      }
                    }}
                    disabled={viewOnly}
                  />
                )}
              />
            ) : (
              <Box sx={{ flex: 1 }} />
            )}

            {/* Right Column - Exchange Rate for Liquidation Value */}
            {watchField.indicationLiquidationCurrencyCode === 'USD' ? (
              <Controller
                control={control}
                name="indicationLiquidationFxRateToIdr"
                render={({ field }) => (
                  <Currency
                    currencyList={currencyDropdownList}
                    label="Kurs"
                    placeholder="Kurs"
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: field.value }}
                    disabledCurrency
                    onChange={(val) => {
                      field.onChange(val.value);
                      // Recalculate liquidation value in IDR when exchange rate changes
                      if (watchField.indicationLiquidationValue) {
                        const liquidationValue = parseFloat((watchField.indicationLiquidationValue || '0').replace(/,/g, ''));
                        const exchangeRate = parseFloat((val.value || '1').replace(/,/g, ''));
                        const calculatedValue = liquidationValue * exchangeRate;
                        setValue('indicationLiquidationIdr', calculatedValue.toString());
                      }
                    }}
                    disabled={viewOnly}
                  />
                )}
              />
            ) : (
              <Box sx={{ flex: 1 }} />
            )}

            {/* Left Column - Market Value in IDR */}
            {watchField.marketValueCurrencyCode === 'USD' ? (
              <Controller
                control={control}
                name="marketValueIdr"
                render={({ field }) => (
                  <Currency
                    currencyList={currencyDropdownList}
                    label="Nilai Pasar (dalam Rp)"
                    placeholder="Nilai Pasar"
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: field.value }}
                    disabledCurrency
                    onChange={(val) => {
                      field.onChange(val.value);
                    }}
                    disabled
                  />
                )}
              />
            ) : (
              <Box sx={{ flex: 1 }} />
            )}

            {/* Right Column - Liquidation Value in IDR */}
            {watchField.indicationLiquidationCurrencyCode === 'USD' ? (
              <Controller
                control={control}
                name="indicationLiquidationIdr"
                render={({ field }) => (
                  <Currency
                    currencyList={currencyDropdownList}
                    label="Indikasi Nilai Likuidasi (dalam Rp)"
                    placeholder="Nilai Likuidasi"
                    containerSx={{ flex: 1 }}
                    value={{ currency: 'IDR', value: field.value }}
                    disabledCurrency
                    onChange={(val) => {
                      field.onChange(val.value);
                    }}
                    disabled
                  />
                )}
              />
            ) : (
              <Box sx={{ flex: 1 }} />
            )}

            {(collateralType === type.BUILDING) && (
              <Controller
                control={control}
                name="buildingTypeRemark"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="dropdown"
                    label="Jenis Bangunan"
                    placeholder="Jenis Bangunan"
                    dropdownList={typeBuilding}
                    disabled={viewOnly}
                  />
                )}
              />
            )}

            {(collateralType === type.BUILDING && watchField.buildingTypeRemark === 'OTHERS') && (
              <Controller
                control={control}
                name="buildingTypeOtherRemark"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Lainnya"
                    placeholder="Lainnya"
                    disabled={viewOnly}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}

            {(collateralType === type.LAND_BUILDING) && (
              <Controller
                control={control}
                name="propertyTypeRemark"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="dropdown"
                    label="Jenis Properti"
                    placeholder="Jenis Properti"
                    dropdownList={typeProperty}
                    disabled={viewOnly}
                  />
                )}
              />
            )}

            {(collateralType === type.LAND_BUILDING && watchField.propertyTypeRemark === 'OTHERS') && (
              <Controller
                control={control}
                name="buildingTypeOtherRemark"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Lainnya"
                    placeholder="Lainnya"
                    disabled={viewOnly}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}

            {collateralType === type.MOVING_ASSETS && (
              <>
                <Controller
                  control={control}
                  name="detailLocation"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Detail Lokasi"
                      placeholder="Input Detail Lokasi"
                      disabled={viewOnly}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="proofOwnership"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Bukti Kepemilikan"
                      placeholder="Input Bukti Kepemilikan"
                      disabled={viewOnly}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="assesmentObject"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Objek Penilaian Aset Bergerak"
                      placeholder="Input Objek Penilaian"
                      disabled={viewOnly}
                    />
                  )}
                />
              </>
            )}

            {collateralType === type.BUSINESS && (
              <>
                <Controller
                  control={control}
                  name="assesmentObject"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Objek Penilaian"
                      placeholder="Input Objek Penilaian"
                      disabled={viewOnly}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="proofOwnership"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="area"
                      label="Bukti Kepemilikan"
                      placeholder="Input Bukti Kepemilikan"
                      disabled={viewOnly}
                    />
                  )}
                />
              </>
            )}
          </Box>

          {collateralType !== type.MOVING_ASSETS
            && collateralType !== type.BUSINESS
            && (
              <>
                {collateralType === type.LAND_BUILDING && (
                  <TextStyle variant="body4" weight={500} sx={{ fontSize: '1vw' }} >
                    {label[type.LAND]}
                  </TextStyle>
                )}
                <Box sx={{ mb: collateralType === type.LAND_BUILDING ? 3 : 0 }}>
                  <Table
                    isPaper
                    tableHeader={tableHeader[collateralType] ?? []}
                    tableData={Array.isArray(collateralList) ? collateralList[0]?.contents : collateralList?.contents}
                    footer={!viewOnly &&
                      <TableFooter
                        onClick={() => NiceModal.show(modal[collateralType] === modal.LAND_BUILDING ? modal.LAND :
                          modal[collateralType], { id: null, parentId: id, processId }
                        )}
                      />}
                  />
                </Box>

                {collateralType === type.LAND_BUILDING && (
                  <>
                    <TextStyle variant="body4" weight={500} sx={{ fontSize: '1vw' }} >
                      {label[type.BUILDING]}
                    </TextStyle>
                    <Table
                      isPaper
                      tableHeader={tableHeaderBuildingForLandBuilding}
                      tableData={collateralList[1]?.contents}
                      footer={!viewOnly &&
                        <TableFooter
                          onClick={() => !isLoading
                            && NiceModal.show(modal.BUILDING,
                              { id: null, parentId: id, processId })}
                        />}
                    />
                  </>
                )}
              </>
            )}
        </SectionTitle>
        <SectionTitle title="Additional Information" />
        <WordEditor
          isReadOnly={viewOnly}
          container={additionalInfoContainer}
          setContainer={setadditionalInfoContainer}
          // isLoading={isFetchLoading || isSaveLoading}
          initialValue={data?.description}
        />

        {(collateralType === type.MOVING_ASSETS || collateralType === type.BUSINESS) && (
          <ColumnWrapper
            sx={{
              gap: 3,
            }}
          >
            <RowWrapper
              sx={{
                borderBottom: '0.1vw solid',
                borderColor: theme.palette.custom.gray30,
                justifyContent: 'center',
                py: 3,
              }}
            >
              <TextStyle variant="body1" color={theme.palette.primary.main} sx={{ justifyContent: 'center' }}>
                Upload Dokumen
              </TextStyle>
            </RowWrapper>
            <FormProvider {...methods} >
              <FormUploadDocument isMandatory={false} />
            </FormProvider>
          </ColumnWrapper>
        )}

        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          {viewOnly ?
            <Button
              isLoading={isLoading}
              onClick={handleCloseButton}
            >
              Close
            </Button> :
            <Button
              isLoading={isLoading}
              onClick={handleSubmit(handleSaveLpaDetail)}
              disabled={!formState.isValid}
            >
              Save
            </Button>}

        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={modal.LAND}
        component={ModalLand}
      />
      <ModalDef
        id={modal.BUILDING}
        component={ModalBuilding}
      />
      <ModalDef
        id={modal.MACHINES_EQUIPMENT}
        component={ModalMachineEquipment}
      />
      <ModalDef
        id={modal.COMPLEMENTARY_FACILITIES}
        component={ModalComplementaryFacilities}
      />
      <ModalDef
        id={modal.BOAT}
        component={ModalBoat}
      />
      <ModalDef
        id={modal.INVENTORY}
        component={ModalInventory}
      />
      <ModalDef
        id={modal.VEHICLES}
        component={ModalVehicles}
      />
    </>
  );
};

export default DebtorInformationPage;
