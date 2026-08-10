import React, { useState } from 'react';

import { Box, TableCell, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Input from '@/components/shared/Input';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { mockGroupData } from './__mock_data__';
import SectionTitleFacilites from './SectionTitleFacilites';
import { tableGroupHeader, tableHeader } from './TabExistingFacilities.constants';
import useTabExistingFacilitiesList from './TabExistingFacilities.hook';
import TableGroup from './TableGroup';

import type { TabExistingFacilitiesProps } from './TabExistingFacilitiesList.types';


const TabExistingFacilitiesList = (props: TabExistingFacilitiesProps) => {
  const {
    debtorId,
    module,
    process,
    debtorName,
    viewOnly = false,
    withTableDebtorInformation = false,
    isPemda,
    isMipBmpp,
    isTableDataDebtorLoading,
    groupOptionsList,
    disableExchangeRate = false,
    hideActionButton = false,
    isUseGetMasterDetail = false,
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();

  const {
    control,
    handleOnSave,
    hasTableGroupData,
    isAllProduct,
    setIsAllProduct,
    isDebtorExistingLoading,
    tableDebtorExistingData,
    bmppDetailData,
    dataAsOfDate,
    noPage,
    setItemPerPage,
    setNoPage,
    totalPageDebtor,
    additionalDataDebtor,
    exchangeRateExisting,
    exchangeRateFromCurrency,
    watch,
    groupData,
  } = useTabExistingFacilitiesList(props);

  const isTableEmpty = !tableDebtorExistingData;
  const exchangeRateValue = watch()?.currencyValue?.value as string | number | null | undefined;
  const isActionDisabled = exchangeRateValue === null ||
    exchangeRateValue === undefined ||
    (typeof exchangeRateValue === 'string' && exchangeRateValue === '');

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      {withTableDebtorInformation && (
        <TableDebtorInformation module={module} process={process} isUseGetMasterDetail={isUseGetMasterDetail} />
      )}
      <BaseContainer sx={{ gap: theme.spacing(3), px: theme.spacing(2) }}>
        <Box
          sx={{
            borderBottom: '0.02vw solid',
            borderColor: theme.palette.custom.gray30,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            py: 1,
          }}
        >
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle
              variant="body3"
              color={theme.palette.custom.gray30}
            >
              Data as of
            </TextStyle>
          </ColumnWrapper>

          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle
              variant="body3"
              color={theme.palette.custom.gray30}
            >
              : {dataAsOfDate}
            </TextStyle>
          </ColumnWrapper>

          <ColumnWrapper></ColumnWrapper>

          <ColumnWrapper
            sx={{
              alignItems: 'end',
              display: 'flex',
              gap: theme.spacing(1),
            }}
          >
            <RowWrapper sx={{ position: 'relative' }}>
              <Input
                type="checkbox"
                size="small"
                inputSx={{ color: theme.palette.primary.main, fontWeight: 500 }}
                checkboxList={[{ label: 'All Product', value: 'checked' }]}
                value={isAllProduct}
                disabled={viewOnly}
                onChange={(data) => {
                  setIsAllProduct(data);
                }}
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 14 },
                  'div': { marginTop: 0.12 },
                  gap: 0,
                }}
              />
              <PopupInfoInput
                status={Boolean(anchorEl)}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                sx={{ alignItems: 'center', marginRight: 1, top: 0 }}
                content={
                  <Box sx={{ bgcolor: '#284A63', height: '100%', width: '100%' }}>
                    <ul
                      style={{
                        color: '#FFF',
                        margin: '0px',
                        paddingBlock: '10px',
                        paddingInline: '20px',
                      }}
                    >
                      <TextStyle variant="body5" color={theme.palette.white.main}>
                        Uncheck untuk menampilkan produk yang sudah dipilih
                      </TextStyle>
                    </ul>
                  </Box>
                }
              />
            </RowWrapper>
          </ColumnWrapper>
        </Box>
        <Box>
          <SectionTitleFacilites
            title={debtorName}
            isOpen
            rightComponent={
              <Box display="flex" flexDirection="column" gap={theme.spacing(2)}>
                <Controller
                  name="currencyValue"
                  control={control}
                  render={({ field, formState }) => (
                    <Currency
                      isMandatory={false}
                      disabled={isTableEmpty || viewOnly || disableExchangeRate}
                      disabledCurrency
                      label="Exchange Rate (in IDR)"
                      placeholder="Input Exchange Rate"
                      value={{ currency: 'IDR', value: exchangeRateFromCurrency ?? exchangeRateExisting?.data?.exchangeRate?.replaceAll('.00', '') }}
                      onChange={(val) => {
                        field.onChange(val);
                      }}
                      error={!!formState.errors.currencyValue}
                      helperText={formState.errors.currencyValue?.message}
                    />
                  )}
                />
              </Box>
            }
          >

            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                isLoading={isTableDataDebtorLoading || isDebtorExistingLoading}
                tableHeader={tableHeader}
                tableData={!isTableEmpty ? tableDebtorExistingData : []}
                totalPage={totalPageDebtor ?? 1}
                currentPage={noPage}
                handlePageChange={setNoPage}
                onPageSizeChange={setItemPerPage}
                renderAdditonalRow={() => (
                  <>
                    <TableCell colSpan={8}>
                      <TextStyle
                        variant="body4"
                        weight={600}
                        color={theme.palette.primary.main}
                      >
                        Total
                      </TextStyle>
                    </TableCell>
                    <TableCell>
                      <TextStyle
                        variant="body4"
                        weight={600}
                        color={theme.palette.primary.main}
                        sx={{ float: 'right', whiteSpace: 'nowrap' }}
                      >
                        {additionalDataDebtor?.totalPlafondExistingInIdr ? `IDR ${additionalDataDebtor?.totalPlafondExistingInIdr}` : '-'}
                      </TextStyle>
                    </TableCell>
                    <TableCell>
                      <TextStyle
                        variant="body4"
                        weight={600}
                        color={theme.palette.primary.main}
                        sx={{ float: 'right', whiteSpace: 'nowrap' }}
                      >
                        {additionalDataDebtor?.totalOutstanding ? `IDR ${additionalDataDebtor?.totalOutstanding}` : '-'}
                      </TextStyle>
                    </TableCell>
                    <TableCell>
                      <TextStyle
                        variant="body4"
                        weight={600}
                        color={theme.palette.primary.main}
                        sx={{ float: 'right', whiteSpace: 'nowrap' }}
                      >
                        {additionalDataDebtor?.totalLeewayUnfiltered ? `IDR ${additionalDataDebtor?.totalLeewayUnfiltered}` : '-'}
                      </TextStyle>
                    </TableCell>
                  </>
                )}
              />
            </BaseContainer>
          </SectionTitleFacilites>

          { !isPemda &&
          <SectionTitle title="Fasilitas Existing Group" isOpen>
            <BaseContainer sx={{ boxShadow: 7 }}>
              { hasTableGroupData ?
                <TableGroup
                  isLoading={isTableDataDebtorLoading}
                  tableHeader={tableGroupHeader}
                  // tableDataGroup={tableDataGroup}
                  data={groupOptionsList}
                  withAddButton={false}
                  handleOpenAddModal={() => {}}
                  isMipBmpp={isMipBmpp}
                  isAllProduct={isAllProduct}
                  debtorId={debtorId}
                  bmppDetailData={bmppDetailData}
                  groupDataFallback={groupData?.contents}
                />
                :
                <Box
                  sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    margin: theme.spacing(8),
                  }}
                >
                  <EmptyPlaceholder status="data" />
                </Box>
              }
            </BaseContainer>
          </SectionTitle>
          }
        </Box>
      </BaseContainer>
      {!hideActionButton && (
        <RowWrapper sx={{ justifyContent: 'end', py: theme.spacing(3) }}>
          <Button
            disabled={isActionDisabled}
            onClick={handleOnSave}
          >
            {viewOnly ? 'Next' : 'Save'}
          </Button>
        </RowWrapper>
      )}
    </ColumnWrapper>
  );
};

export default TabExistingFacilitiesList;
