import { Box, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CurrencyLOV } from '@/configs/constants/lov';
import { formatDateTime } from '@/helpers/date';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ButtonClose from '../../../ButtonClose/ButtonClose';

import { useFacilityData } from './FacilityData.hooks';


const FacilityData = ({ facilityInformation }: { facilityInformation: any }) => {
  const {
    control,
    theme,
    watch,
    isViewOnly,
    handleSaveFacilityData,
    facilitySchema,
    financingType,
    subProductLibraryOptions,
    productLibraryOptions,
    productName,
    isValid,
    dataDelta,
    findDataMaster,
    productList,
    orderTypeList,
    mappingOrderTypeList,
    financingSegmentOptions,
    setValue,
    currencyList,
    productListDelta,
    financingSegmentList,
    facilityDataInformation,
  } = useFacilityData();

  const isIDC = [
    'KI Def IDC Subordinated',
    'KI dengan IDC 100%',
    'KI dengan IDC'
  ];
  const packageName = facilityInformation?.productType;
  const isIDCProductType = isIDC.includes(packageName);

  return (
    <>
      <Title title="Facility Data" sx={{ mb: theme.spacing(3) }} />
      <ColumnWrapper sx={{ gap: 3 }}>

        <SectionTitle
          isOpen
          title="Facility Data"
          subtitle={`Facility No: ${facilityInformation?.facilityNo ? facilityInformation?.facilityNo : '-'} | RM: ${facilityInformation?.relationshipManager ? facilityInformation?.relationshipManager : '-'} | Divisi: ${facilityInformation?.division ? facilityInformation?.division : '-'}`}
        >
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="financingCategory"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Financing Category"
                  placeholder="Financing Category"
                  type="dropdown"
                  isMandatory
                  disabled={isViewOnly}
                  dropdownList={financingType ?? []}
                  hasDataMaster={findDataMaster('financingCategory', financingType)}
                />
              }
            />

            <Controller
              name="productLibrary"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Product Library"
                  placeholder="Product Library"
                  type="dropdown"
                  disabled={isViewOnly}
                  dropdownList={productLibraryOptions ?? []}
                  hasDataMaster={findDataMaster('productLibrary', productLibraryOptions)}
                />
              }
            />

            <Controller
              name="subProductLibrary"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Sub Product Library"
                  placeholder="Sub Product Library"
                  type="dropdown"
                  disabled={isViewOnly}
                  dropdownList={subProductLibraryOptions ?? []}
                  hasDataMaster={findDataMaster('subProductLibrary', subProductLibraryOptions)}
                />
              }
            />

            <Controller
              name="packageName"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Product Name"
                  placeholder="Product Name"
                  type="dropdown"
                  dropdownList={productName ?? []}
                  disabled
                  hasDataMaster={findDataMaster('packageName', productName)}
                />
              }
            />

            <Controller
              name="financingSegment"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Financing Segment"
                  placeholder="Financing Segment"
                  type="dropdown"
                  isMandatory={!isViewOnly}
                  dropdownList={financingSegmentList ?? []}
                  disabled
                  hasDataMaster={findDataMaster('financingSegment', financingSegmentList)}
                />
              }
            />

            <Controller
              name="financingScheme"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Financing Scheme"
                  placeholder="Financing Scheme"
                  type="dropdown"
                  isMandatory={!isViewOnly}
                  dropdownList={facilitySchema ?? []}
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('financingScheme', facilitySchema)}
                />
              }
            />

            <Controller
              name="companyStatus"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Company Status"
                  placeholder="Company Status"
                  type="text"
                  disabled
                  hasDataMaster={findDataMaster('companyStatus')}
                />
              }
            />

            <Controller
              name="orderType"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Order Type"
                  placeholder="Order Type"
                  type="dropdown"
                  dropdownList={orderTypeList}
                  disabled
                  isMandatory
                  hasDataMaster={findDataMaster('orderStatus', mappingOrderTypeList)}
                />
              }
            />

            {
              watch('companyStatus') === 'New Customer (N)' ? (
                <Input
                  label="Order Status"
                  placeholder="Order Status"
                  type="dropdown"
                  value="NEW"
                  dropdownList={[{ label: 'New', value: 'NEW' }]}
                  disabled
                  isMandatory
                  hasDataMaster={findDataMaster('orderStatus', mappingOrderTypeList)}
                />
              ) : (
                <Controller
                  name="orderStatus"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      label="Order Status"
                      placeholder="Order Status"
                      type="dropdown"
                      dropdownList={mappingOrderTypeList ?? []}
                      disabled
                      isMandatory
                      hasDataMaster={findDataMaster('orderStatus', mappingOrderTypeList)}
                    />
                  }
                />
              )}

            <Controller
              name="mappingFinancingSegment"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="CORE Mapping Segmen Pembiayaan"
                  placeholder="CORE Mapping Segmen Pembiayaan"
                  type="dropdown"
                  dropdownList={financingSegmentOptions ?? []}
                  disabled
                  isMandatory
                  hasDataMaster={findDataMaster('mappingFinancingSegment', financingSegmentOptions)}
                />
              }
            />

            <Controller
              name="mappingProduct"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="CORE Mapping Product"
                  placeholder="CORE Mapping Product"
                  type="dropdown"
                  dropdownList={productList ?? []}
                  disabled={isViewOnly}
                  isMandatory
                  hasDataMaster={findDataMaster('mappingProduct', productListDelta)}
                />
              }
            />

            <Controller
              name="os"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="O/S"
                  placeholder="O/S"
                  type="number"
                  disabled
                  thousandSeparator=","
                  suffix=".00"
                  hasDataMaster={findDataMaster('os')}
                />
              }
            />

            <Controller
              name="orderValue"
              control={control}
              render={({ field }) => {
                const currentInputValue = watch('orderValue') ? parseFloat(watch('orderValue').toString().replace(/,/g, '')) : 0;
                const currentCurrency = watch('currencyOrderValue');
                const currentExchangeRate = watch('exchangeRate') ? parseFloat(watch('exchangeRate').toString().replace(/,/g, '')) : 1;

                // Gunakan data dari facilityDataInformation
                const existingData = (facilityDataInformation as any)?.data?.content;
                const existingOrderValue = existingData?.existingOrderValue ? parseFloat(existingData.existingOrderValue.toString().replace(/,/g, '')) : 0;
                const existingCurrency = existingData?.currencyOrderValue || 'IDR';

                // Hitung Existing Values (Konversi ke IDR & USD untuk tooltip)
                let existingUsdValue = 0;
                let existingIdrValue = 0;
                if (existingCurrency === 'USD') {
                  existingUsdValue = existingOrderValue;
                  existingIdrValue = existingUsdValue * (currentExchangeRate || 1);
                } else {
                  existingIdrValue = existingOrderValue;
                  existingUsdValue = currentExchangeRate > 0 ? existingIdrValue / currentExchangeRate : 0;
                }

                // Hitung Current Values (Berdasarkan input saat ini)
                let currentUsdValue = 0;
                let currentIdrValue = 0;
                if (currentCurrency === 'USD') {
                  currentUsdValue = currentInputValue;
                  currentIdrValue = currentUsdValue * (currentExchangeRate || 1);
                } else {
                  currentIdrValue = currentInputValue;
                  currentUsdValue = currentExchangeRate > 0 ? currentIdrValue / currentExchangeRate : 0;
                }

                // Hitung Selisih sesuai logika ModalFormFacility
                let idrDifference = 0;
                let usdDifference = 0;

                if (currentCurrency === 'USD') {
                  // Jika input USD, hitung selisih USD dulu, baru konversi ke IDR
                  usdDifference = currentUsdValue - existingUsdValue;
                  idrDifference = usdDifference * (currentExchangeRate || 1);
                } else {
                  // Jika input IDR, hitung selisih IDR dulu, baru konversi ke USD
                  idrDifference = currentIdrValue - existingIdrValue;
                  usdDifference = currentExchangeRate > 0 ? idrDifference / currentExchangeRate : 0;
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

                // Tooltip muncul jika tipe order berkaitan dengan existing
                const showTooltips = ['New From Existing', 'EXISTING', 'NEW_FROM_EXISTING_FACILITY'].includes(watch('orderType'));

                return (
                  <Box>
                    <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.75, mb: 1 }}>
                      <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                        Plafond
                      </TextStyle>
                      <TextStyle variant="body4" weight={600} color={theme.palette.error.main}>
                        *
                      </TextStyle>

                      {showTooltips && (
                        <Tooltip
                          placement="right"
                          slotProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: '#284A63',
                                borderRadius: '10px',
                                padding: '12px',
                                width: '300px',
                              },
                            },
                          }}
                          title={
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ color: 'white', fontWeight: 600 }}>Existing</span>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>IDR</span>
                                <span>{formatCurrency(existingIdrValue)}</span>
                              </Box>
                              {currentCurrency === 'USD' && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>USD</span>
                                  <span>{formatCurrency(existingUsdValue)}</span>
                                </Box>
                              )}
                              <Box sx={{ backgroundColor: '#666', height: '1px', my: 1 }} />
                              <span style={{ color: 'white', fontWeight: 600 }}>Selisih</span>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  {getDifferenceSymbol(idrDifference)}
                                  <span>IDR</span>
                                </Box>
                                <span>{formatCurrency(Math.abs(idrDifference))}</span>
                              </Box>
                              {currentCurrency === 'USD' && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {getDifferenceSymbol(usdDifference)}
                                    <span>USD</span>
                                  </Box>
                                  <span>{formatCurrency(Math.abs(usdDifference))}</span>
                                </Box>
                              )}
                            </Box>
                          }
                        >
                          <Box sx={{ cursor: 'pointer', display: 'flex' }}>
                            <Icon iconName="new-info" sx={{ '& path': { fill: '#D07C1B' } }} />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                    <Currency
                      label=""
                      placeholder="Plafond"
                      disabled={isViewOnly}
                      value={{
                        currency: watch('currencyOrderValue'),
                        value: watch('orderValue') as string,
                      }}
                      onChange={(val) => {
                        setValue('currencyOrderValue', val.currency);
                        setValue('orderValue', val.value);
                      }}
                      currencyList={currencyList}
                      suffix=".00"
                      hasDataMaster={findDataMaster('orderValue', currencyList)}
                    />
                  </Box>
                );
              }}
            />

            {
              watch('currencyOrderValue') === 'USD' && (
                <Controller
                  name="exchangeRate"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Currency
                        label="Exchange Rate"
                        placeholder="Exchange Rate"
                        disabled={isViewOnly}
                        isMandatory
                        value={{
                          currency: watch('currencyExchangeRate'),
                          value: watch('exchangeRate') as string,
                        }}
                        onChange={(val) => {
                          setValue('currencyExchangeRate', val.currency);
                          setValue('exchangeRate', val.value);
                        }}
                        disabledCurrency
                        currencyList={[{ label: 'IDR', value: 'IDR' }]}
                        suffix=".00"
                        hasDataMaster={findDataMaster('exchangeRate', currencyList)}
                      />
                    );
                  }
                  }
                />
              )
            }


            <Controller
              name="totalPlafondValue"
              control={control}
              render={({ field }) => {

                const getNumericValue = (val: any) => {
                  if (!val) return 0;
                  const strVal = val.toString().replace(/,/g, '');
                  return isNaN(parseFloat(strVal)) ? 0 : parseFloat(strVal);
                };

                const currentPlafondIDC = watch('plafondIDC');
                const currentTotalPlafondValue = watch('totalPlafondValue');

                let finalValue = currentTotalPlafondValue as string;

                if (isIDCProductType) {
                  const sum = getNumericValue(currentTotalPlafondValue) + getNumericValue(currentPlafondIDC);
                  finalValue = sum.toString();
                }

                return (
                  <Currency
                    label="Total Plafond (dalam Rp)"
                    placeholder="Total Plafond"
                    disabled
                    value={{
                      currency: 'IDR',
                      value: finalValue,
                    }}
                    currencyList={[{
                      label: 'IDR',
                      value: 'IDR',
                    },
                    ]}
                    suffix=".00"
                    hasDataMaster={findDataMaster('totalPlafondValue', currencyList)}
                  />
                );
              }}
            />

            <Controller
              name="alias"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Alias"
                  placeholder="Alias"
                  isMandatory
                  type="text"
                  disabled={isViewOnly}
                  hasDataMaster={findDataMaster('alias')}
                />
              }
            />

            <Controller
              name="facilityStatus"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Facility Status"
                  placeholder="Facility Status"
                  type="text"
                  disabled
                  hasDataMaster={findDataMaster('facilityStatus')}
                />
              }
            />

          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="modifiedBy"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Modified By"
                  placeholder="Modified By"
                  type="text"
                  disabled
                />
              }
            />

            <Controller
              name="modifiedDate"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Last Modified"
                  placeholder="Last Modified"
                  type="text"
                  value={field?.value ? formatDateTime(field?.value) : ''}
                  disabled
                />
              }
            />
          </Box>
        </SectionTitle>
      </ColumnWrapper>
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
        <ButtonClose handleSave={handleSaveFacilityData} isViewOnly={isViewOnly} />
      </RowWrapper>
    </>
  );
};
export default FacilityData;
