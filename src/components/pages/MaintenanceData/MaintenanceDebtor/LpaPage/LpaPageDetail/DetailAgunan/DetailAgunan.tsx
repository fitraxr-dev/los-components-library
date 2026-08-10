'use client';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Controller } from 'react-hook-form';

import { formatNumber } from '@/helpers/utils';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import FieldUploadDocument from './component/FieldUploadDocument';
import { tableHeaderBangunan, tableHeaderTanah } from './DetailAgunan.constant';
import useDetailAgunan from './DetailAgunan.hooks';


const DetailAgunan = () => {
  const theme = useTheme();
  const { control,
    watch,
    tableHeaderList,
    assetList,
    assetListLand,
    assetListBuilding,
    documentAsset,
    typeAgunan,
    tableHeaderListLand,
    tableHeaderListBuilding,
    typeProperty,
  } = useDetailAgunan();


  const currencyDropdownList = [
    {
      label: 'USD',
      value: 'USD',
    },
    {
      label: 'IDR',
      value: 'IDR',
    }
  ];

  return (
    <ColumnWrapper>
      <TextStyle variant="title2" weight={700} color={theme.palette.primary.main} sx={{ mb: theme.spacing(2) }}>
        {
          typeAgunan === 'LAND' ? 'Tanah' :
            typeAgunan === 'BUILDING' ? 'Bangunan' :
              typeAgunan === 'MACHINES_EQUIPMENT' ? 'Mesin' :
                typeAgunan === 'COMPLEMENTARY_FACILITIES' ? 'Sarana Pelengkap' :
                  typeAgunan === 'BOAT' ? 'Kapal' :
                    typeAgunan === 'VEHICLES' ? 'Kendaraan' :
                      typeAgunan === 'INVENTORY' ? 'Inventory' :
                        typeAgunan === 'LAND_BUILDING' ? 'Tanah & Bangunan' :
                          typeAgunan === 'MOVING_ASSETS' ? 'Asset Bergerak' :
                            typeAgunan === 'BUSINESS' ? 'Bisnis' : ''
        }
      </TextStyle>
      <SectionTitle
        title={
          typeAgunan === 'LAND' ? 'Tanah' :
            typeAgunan === 'BUILDING' ? 'Bangunan' :
              typeAgunan === 'MACHINES_EQUIPMENT' ? 'Mesin' :
                typeAgunan === 'COMPLEMENTARY_FACILITIES' ? 'Sarana Pelengkap' :
                  typeAgunan === 'BOAT' ? 'Kapal' :
                    typeAgunan === 'VEHICLES' ? 'Kendaraan' :
                      typeAgunan === 'INVENTORY' ? 'Inventory' :
                        typeAgunan === 'LAND_BUILDING' ? 'Tanah & Bangunan' :
                          typeAgunan === 'MOVING_ASSETS' ? 'Asset Bergerak' :
                            typeAgunan === 'BUSINESS' ? 'Bisnis' : ''
        }
        isOpen
      >
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(3),
          }}
        >
          <Controller
            disabled
            name="collateralDetailData.objectLocation"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Lokasi Objek"
                placeholder="Input Lokasi Objek"
                type="text"
              />
            )}
          />
          <Controller
            disabled
            name="collateralDetailData.coordinate"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Lokasi Koordinat"
                placeholder="Input Lokasi Koordinat"
                type="text"
              />
            )}
          />
          <Controller
            disabled
            control={control}
            name="collateralDetailData.marketValue"
            render={({ field: { onChange, ...field } }) => {
              return (
                <Currency
                  {...field}
                  label="Nilai Pasar"
                  placeholder="Nilai Pasar"
                  containerSx={{ flex: 1 }}
                  value={{
                    currency: watch('collateralDetailData.marketValueCurrencyCode'),
                    value: watch('collateralDetailData.marketValue.value') ?
                      watch('collateralDetailData.marketValue.value') :
                      watch('collateralDetailData.marketValue'),
                  }}
                  onChange={(val) => {
                    onChange({
                      currency: 'IDR',
                      value: formatNumber(val.value),
                    });
                  }}
                />
              );
            }}
          />

          <Controller
            disabled
            control={control}
            name="collateralDetailData.indicationLiquidationValue"
            render={({ field: { onChange, ...field } }) => {
              return (
                <Currency
                  {...field}
                  label="Indikasi nilai likuidasi"
                  placeholder="Indikasi nilai likuidasi"
                  containerSx={{ flex: 1 }}
                  currencyList={currencyDropdownList}
                  value={{
                    currency: watch('collateralDetailData.indicationLiquidationCurrencyCode'),
                    value: watch('collateralDetailData.indicationLiquidationValue.value') ?
                      watch('collateralDetailData.indicationLiquidationValue.value') :
                      watch('collateralDetailData.indicationLiquidationValue'),
                  }}
                  onChange={(val) => {
                    onChange({
                      currency: val.currency,
                      value: formatNumber(val.value),
                    });
                  }}
                />
              );
            }}
          />

          {watch('collateralDetailData.marketValueCurrencyCode') === 'USD' ? (
            <Controller
              disabled
              control={control}
              name="collateralDetailData.marketValueFxRateToIdr"
              render={({ field }) => {
                return (
                  <Currency
                    {...field}
                    label="Kurs"
                    placeholder="Kurs"
                    containerSx={{ flex: 1 }}
                    value={{
                      currency: 'IDR',
                      value: field.value,
                    }}
                    disabledCurrency
                    onChange={(val) => {
                      field.onChange(val.value);
                    }}
                  />
                );
              }}
            />
          ) : <Box sx={{ flex: 1 }} /> }
          {watch('collateralDetailData.indicationLiquidationCurrencyCode') === 'USD' ? (

            <Controller
              disabled
              control={control}
              name="collateralDetailData.indicationLiquidationFxRateToIdr"
              render={({ field }) => {
                return (
                  <Currency
                    {...field}
                    label="Kurs"
                    placeholder="Kurs"
                    containerSx={{ flex: 1 }}
                    disabledCurrency
                    value={{
                      currency: 'IDR',
                      value: field.value,
                    }}
                    onChange={(val) => {
                      field.onChange(val.value);
                    }}
                  />
                );
              }}
            />
          ) : <Box sx={{ flex: 1 }} />}
          { watch('collateralDetailData.marketValueCurrencyCode') === 'USD' ?
            (
              <Controller
                disabled
                control={control}
                name="collateralDetailData.nilaiPasarIdr"
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Currency
                      {...field}
                      label="nilai pasar (dalam Rp)"
                      placeholder="nilai pasar (dalam Rp)"
                      containerSx={{ flex: 1 }}
                      currencyList={currencyDropdownList}
                      value={{
                        currency: 'IDR',
                        value: watch('collateralDetailData.marketValueIdr'),
                      }}
                    />
                  );
                }}
              />
            ) : <Box sx={{ flex: 1 }} />}
          { watch('collateralDetailData.indicationLiquidationCurrencyCode') === 'USD' ? (
            <Controller
              disabled
              control={control}
              name="collateralDetailData.nilaiLikuidasiIdr"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Currency
                    {...field}
                    label="indikasi nilai likuidasi (dalam Rp)"
                    placeholder="indikasi nilai likuidasi (dalam Rp)"
                    containerSx={{ flex: 1 }}
                    currencyList={currencyDropdownList}
                    value={{
                      currency: 'IDR',
                      value: watch('collateralDetailData.indicationLiquidationIdr'),
                    }}
                  />
                );
              }}
            />
          ) : <Box sx={{ flex: 1 }} />}

          {
            typeAgunan === 'LAND_BUILDING' && (
              <Controller
                disabled
                control={control}
                name="collateralDetailData.propertyTypeRemark"
                render={({ field }) => (
                  <Input
                    {...field}
                    value={typeProperty.find((item) => item.value === field.value)?.value}
                    type="dropdown"
                    label="Jenis Properti"
                    placeholder="Jenis Properti"
                    dropdownList={typeProperty}
                  />
                )}
              />
            )
          }


          {
            typeAgunan === 'MOVING_ASSETS' || typeAgunan === 'BUSINESS' ? (
              <>
                <Controller
                  disabled
                  control={control}
                  name={typeAgunan === 'MOVING_ASSETS' ? 'collateralDetailData.detailLocation' : 'collateralDetailData.assesmentObject'}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="area"
                      label={typeAgunan === 'MOVING_ASSETS' ? 'Detail Lokasi' : 'Objek Penilaian'}
                      placeholder={typeAgunan === 'MOVING_ASSETS' ? 'Detail Lokasi' : 'Objek Penilaian'}
                      rows={4}
                    />
                  )}
                />

                <Controller
                  disabled
                  control={control}
                  name="collateralDetailData.proofOwnership"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="area"
                      rows={4}
                      label="Bukti Kepemilikan"
                      placeholder="Bukti Kepemilikan"
                    />
                  )}
                />
              </>
            )
              : null}

          {
            typeAgunan === 'MOVING_ASSETS' && (
              <Controller
                disabled
                control={control}
                name="collateralDetailData.assesmentObject"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="area"
                    rows={4}
                    label="Objek Penilaian Aset Bergerak"
                    placeholder="Objek Penilaian Aset Bergerak"
                  />
                )}
              />
            )
          }
        </Box>

        {
          typeAgunan === 'MOVING_ASSETS' || typeAgunan === 'BUSINESS' ? (
            <FieldUploadDocument document={documentAsset} />
          ) : (
            <BaseContainer
              sx={{
                maxWidth: '100%',
                padding: theme.spacing(2),
                shadow: 2,
              }}
            > {
                typeAgunan === 'LAND_BUILDING' ? (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'column', shadow: 2 }}>
                      <TextStyle variant="title2" weight={700} color={theme.palette.primary.main}>Tanah</TextStyle>
                      <Table
                        tableHeader={tableHeaderListLand}
                        tableData={assetListLand}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(2), mt: theme.spacing(5), shadow: 10 }}>
                      <TextStyle variant="title2" weight={700} color={theme.palette.primary.main}>Bangunan</TextStyle>
                      <Table
                        tableHeader={tableHeaderListBuilding}
                        tableData={assetListBuilding}
                      />
                    </Box>
                  </>
                ) : (
                  <Table
                    tableHeader={tableHeaderList}
                    tableData={assetList}
                  />
                )
              }
            </BaseContainer>
          )
        }

      </SectionTitle>
    </ColumnWrapper>
  );
};

export default DetailAgunan;
