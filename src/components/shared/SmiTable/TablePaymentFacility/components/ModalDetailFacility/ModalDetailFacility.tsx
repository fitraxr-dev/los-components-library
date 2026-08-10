import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Checkbox, Tooltip, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../TablePaymentFacility.constants';

import useDetailFacility from './ModalDetailFacility.hook';
import SyariahForm from './SyariahForm/SyariahForm';


const ModalDetailFacility = NiceModal.create((props: SmiComponentProps) => {

  const theme = useTheme();
  const modalId = modal.PAYMENT_FACILITY_DETAIL;
  const { visible } = useModal(modalId);
  const {
    currencyDropdownList,
    financingFacilityData,
    isSyariah,
    facilityData,
    projectData,
  } = useDetailFacility(props);

  const showTooltips = financingFacilityData?.orderType === 'NEW_FROM_EXISTING_FACILITY' || financingFacilityData?.orderType === 'EXISTING' || financingFacilityData?.orderType === 'New From Existing';

  return (
    <SectionModal
      title="Detail Fasilitas Pembiayaan"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '65vw',
      }}
    >
      <ColumnWrapper display="flex" flexDirection="column" gap="32px">

        {isSyariah ?
          <SyariahForm
            paymentScheme={financingFacilityData.product}
            financingFacilityData={financingFacilityData}
          /> :
          <ColumnWrapper>
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
                gridGap: theme.spacing(2),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              {facilityData.map((item, index) => {
                if (item.label === 'Nominal Pengajuan') {
                  return (
                    <Cell
                      key={index}
                      titleNode={
                        <>
                          <TextStyle variant="body4" weight={600} color={theme.palette.custom.text}>
                            {item.label}
                          </TextStyle>
                          <TextStyle variant="body4" weight={600} color={theme.palette.error.main} sx={{ ml: 0.5 }}>
                            *
                          </TextStyle>
                          {showTooltips && (
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
                                  const existingOrderValue = financingFacilityData?.existingOrderValue ?
                                    parseFloat(financingFacilityData.existingOrderValue.toString().replace(/,/g, '')) : 0;
                                  const totalOrderValue = financingFacilityData?.totalOrderValue ? parseFloat(financingFacilityData.totalOrderValue.toString().replace(/,/g, '')) : 0;
                                  const totalForeignOrderValue = financingFacilityData?.totalForeignOrderValue ? parseFloat(financingFacilityData.totalForeignOrderValue.toString().replace(/,/g, '')) : 0;
                                  const plafondDifference = financingFacilityData?.plafondDifference ? parseFloat(financingFacilityData.plafondDifference.toString().replace(/,/g, '')) : 0;
                                  const currencyOrderValue = financingFacilityData?.currencyOrderValue;

                                  // Get exchange rate from get-list-by-module API with currency module
                                  const usdExchangeRate = currencyDropdownList?.find((item) =>
                                    item.value === 'USD')?.rate;
                                  const exchangeRateFromApi = usdExchangeRate ?
                                    parseFloat(usdExchangeRate.toString().replace(/,/g, '')) : 1;

                                  // Use existingOrderValue for existing value
                                  const existingIdrValue = existingOrderValue;
                                  const existingUsdValue = exchangeRateFromApi > 0 ?
                                    existingOrderValue / exchangeRateFromApi : 0;

                                  let currentIdrValue = 0;
                                  let currentUsdValue = 0;
                                  let idrDifference = 0;
                                  let usdDifference = 0;

                                  if (currencyOrderValue === 'IDR') {
                                  // If current currency is IDR
                                    currentIdrValue = totalOrderValue;
                                    currentUsdValue = exchangeRateFromApi > 0 ?
                                      totalOrderValue / exchangeRateFromApi : 0;

                                    // IDR difference: existingOrderValue - orderValue
                                    idrDifference = totalOrderValue - existingOrderValue;
                                    // USD difference: existingUsdValue - currentUsdValue
                                    usdDifference = currentUsdValue - existingUsdValue;
                                  } else {
                                  // If current currency is USD
                                    currentUsdValue = totalForeignOrderValue;
                                    currentIdrValue = exchangeRateFromApi > 0 ?
                                      totalForeignOrderValue * exchangeRateFromApi : 0;

                                    // USD difference: existingUsdValue - orderValue
                                    usdDifference = totalForeignOrderValue - existingUsdValue;
                                    // IDR difference: existingIdrValue - curresntIdrValue
                                    idrDifference = currentIdrValue - existingOrderValue;
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
                                          {formatCurrency(existingIdrValue)}
                                        </span>
                                      </Box>

                                      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'white', fontSize: '14px' }}>USD</span>
                                        <span style={{ color: 'white', fontSize: '14px' }}>
                                          {formatCurrency(existingUsdValue)}
                                        </span>
                                      </Box>

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
                                          {getDifferenceSymbol(idrDifference)}
                                          <span style={{ color: 'white', fontSize: '14px' }}>IDR</span>
                                        </Box>
                                        <span style={{ color: 'white', fontSize: '14px' }}>
                                          {formatCurrency(Math.abs(idrDifference))}
                                        </span>
                                      </Box>

                                      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                        <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
                                          {getDifferenceSymbol(usdDifference)}
                                          <span style={{ color: 'white', fontSize: '14px' }}>USD</span>
                                        </Box>
                                        <span style={{ color: 'white', fontSize: '14px' }}>
                                          {formatCurrency(Math.abs(usdDifference))}
                                        </span>
                                      </Box>
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
                        </>
                      }
                      value={
                        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                          {showTooltips && (
                            <Checkbox
                              checked={(() => {
                                if (!financingFacilityData?.existingOrderValue) return false;

                                const normalizeValue = (value: string) => {
                                  if (!value) return '0';
                                  const numValue = parseFloat(value.replace(/,/g, ''));
                                  return isNaN(numValue) ? '0' : numValue.toString();
                                };

                                const existingOrderValue = normalizeValue(
                                  financingFacilityData.existingOrderValue.toString()
                                );
                                const orderValue = normalizeValue(
                                  financingFacilityData.orderValue?.toString() || '0'
                                );
                                const orderValueAfterExchangeRate = normalizeValue(
                                  financingFacilityData.orderValueAfterExchangeRate?.toString() || '0'
                                );

                                // Get currency values
                                const existingCurrency = financingFacilityData?.currencyOrderValue;
                                const currentCurrency = financingFacilityData?.currencyOrderValueAfterExchangeRate;

                                const isOrderValueDifferent = existingOrderValue !== orderValue;
                                const isOrderValueAfterExchangeRateDifferent =
                                existingOrderValue !== orderValueAfterExchangeRate;
                                const isCurrencyDifferent = existingCurrency !== currentCurrency;

                                // Checkbox checked if there is ANY change; unchecked if all equal
                                return isOrderValueDifferent ||
                              isOrderValueAfterExchangeRateDifferent ||
                              isCurrencyDifferent;
                              })()}
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
                          <span>{item.value}</span>
                        </Box>
                      }
                    />
                  );
                }
                return <Cell key={index} title={item.label} value={item.value} />;
              })}
            </Box>

            {/* Legend for Checkbox */}
            {showTooltips && (
              <Box
                sx={{
                  backgroundColor: '#FFF8F0',
                  border: `1px solid ${'#FFF8F0'}`,
                  borderRadius: 1,
                  mt: 2,
                  p: 2,
                }}
              >
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
                  <Icon
                    iconName="new-info"
                    sx={{
                      '& path': { fill: '#D07C1B' },
                    }}
                  />
                  <TextStyle variant="body4" color="#D07C1B" sx={{ lineHeight: 1.5 }}>
                    {(() => {
                      if (!financingFacilityData?.existingOrderValue) {
                        return 'Checkbox pada Nominal Pengajuan tidak aktif tanpa perubahan nominal dari nilai existing';
                      }
                      const normalizeValue = (value: string) => {
                        if (!value) return '0';
                        const numValue = parseFloat(value.replace(/,/g, ''));
                        return isNaN(numValue) ? '0' : numValue.toString();
                      };
                      const existingOrderValue = normalizeValue(
                        financingFacilityData.existingOrderValue.toString()
                      );
                      const orderValue = normalizeValue(
                        financingFacilityData.orderValue?.toString() || '0'
                      );
                      const orderValueAfterExchangeRate = normalizeValue(
                        financingFacilityData.orderValueAfterExchangeRate?.toString() || '0'
                      );
                      const existingCurrency = financingFacilityData?.currencyOrderValue;
                      const currentCurrency = financingFacilityData?.currencyOrderValueAfterExchangeRate;
                      const isOrderValueDifferent = existingOrderValue !== orderValue;
                      const isOrderValueAfterExchangeRateDifferent = existingOrderValue !== orderValueAfterExchangeRate;
                      const isCurrencyDifferent = existingCurrency !== currentCurrency;
                      const anyChecked =
                        isOrderValueDifferent ||
                        isOrderValueAfterExchangeRateDifferent ||
                        isCurrencyDifferent;
                      return anyChecked
                        ? 'Checkbox pada Nominal Pengajuan aktif apabila terdapat perubahan nominal dari nilai existing'
                        : 'Checkbox pada Nominal Pengajuan tidak aktif tanpa perubahan nominal dari nilai existing';
                    })()}
                  </TextStyle>
                </Box>
              </Box>
            )}
          </ColumnWrapper>
        }


        <ColumnWrapper>
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
              gridGap: theme.spacing(2),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {projectData.map((item, index) =>
              <Cell key={index} title={item.label} value={item.value} />,
            )}
          </Box>
        </ColumnWrapper>
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal >
  );
});

export default ModalDetailFacility;
