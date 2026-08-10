import React, { useState } from 'react';

import { Box, TableCell, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Currency from '@/components/shared/Currency';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Input from '@/components/shared/Input';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import SectionTitleFacilites from './SectionTitleFacilites';
import { tableGroupHeader, tableHeader } from './TabExistingFacilities.constants';
import useTabExistingFacilitiesList from './TabExistingFacilities.hook';
import TableGroup from './TableGroup';

import type { TabExistingFacilitiesProps } from './TabExistingFacilitiesList.types';


const TabExistingFacilitiesList = (props: TabExistingFacilitiesProps) => {
  const {
    id,
    debtorName,
    viewOnly = false,
    isPemda,
    isIndividual,
    groupOptionsList,
    calculationId,
    detailGroup } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();

  const {
    control,
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
    watch,
    groupData,
  } = useTabExistingFacilitiesList(props);

  const isTableEmpty = !tableDebtorExistingData;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
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
            title={isIndividual ? debtorName : detailGroup?.groupName}
            isOpen
            rightComponent={
              <Box display="flex" flexDirection="column" gap={theme.spacing(2)}>
                <Controller
                  name="currencyValue"
                  control={control}
                  render={({ field, formState }) => (
                    <Currency
                      isMandatory={!isTableEmpty}
                      disabled
                      label="Exchange Rate (in IDR)"
                      placeholder="Input Exchange Rate"
                      value={{ currency: 'IDR', value: exchangeRateExisting?.data?.exchangeRate?.replaceAll('.00', '') }}
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

            { isIndividual &&
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                isLoading={isDebtorExistingLoading}
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
            }
          </SectionTitleFacilites>

          { !isPemda && isIndividual &&
          <SectionTitle title="Fasilitas Existing Group" sx={{ mt: 3 }} isOpen>
            <BaseContainer sx={{ boxShadow: 7 }}>
              { hasTableGroupData ?
                <TableGroup
                  isLoading={false}
                  tableHeader={tableGroupHeader}
                  calculationId={calculationId}
                  // tableDataGroup={tableDataGroup}
                  data={groupOptionsList}
                  withAddButton={false}
                  handleOpenAddModal={() => {}}
                  isAllProduct={isAllProduct}
                  debtorId={id}
                  bmppDetailData={bmppDetailData}
                  isIndividual={isIndividual}
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

          { !isPemda && !isIndividual &&
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                isLoading={isDebtorExistingLoading}
                tableHeader={tableGroupHeader}
                tableData={!isTableEmpty ? tableDebtorExistingData : []}
                totalPage={totalPageDebtor ?? 1}
                currentPage={noPage}
                handlePageChange={setNoPage}
                onPageSizeChange={setItemPerPage}
                renderAdditonalRow={() => (
                  <>
                    <TableCell colSpan={9}>
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
          }
        </Box>
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TabExistingFacilitiesList;
