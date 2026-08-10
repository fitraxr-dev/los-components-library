import { useState } from 'react';

import { Box, TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Input from '@/components/shared/Input';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import TableGroup from './components/TableGroup';
import useTabProposedFacilitiesList from './TabProposedFacilitiesList.hook';

import type { TabProposedFacilitiesListProps } from './TabProposedFacilitiesList.types';


const TabProposedFacilitiesList = (props: TabProposedFacilitiesListProps) => {
  const {
    debtorName,
    viewOnly,
    tableHeaderDebtor,
    tableHeaderGroup,
    isPemda,
    id,
    groupOptionsList,
    isIndividual,
    detailGroup,
    calculationId,
  } = props;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const {
    isAllProduct,
    setIsAllProduct,
    tableDataDebtorProposed,
    dataAsOfDate,
    hasTableGroupData,
    totalPageDebtor,
    noPage,
    setNoPage,
    setItemPerPage,
    additionalDataDebtor,
    bmppDetailData,
    isDebtorproposedLoading,
    groupData,
  } = useTabProposedFacilitiesList(props);

  const isTableEmpty = !tableDataDebtorProposed;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <BaseContainer
        sx={{
          boxShadow: 7,
          gap: theme.spacing(3),
          px: theme.spacing(2),
        }}
      >
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
              {`: ${dataAsOfDate}`}
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

        { isIndividual &&
        <SectionTitle title={debtorName} isOpen>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isDebtorproposedLoading}
              tableHeader={tableHeaderDebtor}
              tableData={!isTableEmpty ? tableDataDebtorProposed : []}
              totalPage={totalPageDebtor?.totalPage ?? 1}
              currentPage={noPage}
              handlePageChange={setNoPage}
              onPageSizeChange={setItemPerPage}
              renderAdditonalRow={() => (
                <>
                  <TableCell colSpan={7}>
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
                      {additionalDataDebtor?.total ? `IDR ${additionalDataDebtor?.total}` : '-'}
                    </TextStyle>
                  </TableCell>
                </>
              )}
            />

          </BaseContainer>
        </SectionTitle>
        }

        { !isPemda && isIndividual &&
          <SectionTitle title="Fasilitas Usulan Group" isOpen>
            <BaseContainer sx={{ boxShadow: 7 }}>
              { hasTableGroupData ?
                <TableGroup
                  isLoading={false}
                  tableHeader={tableHeaderGroup}
                  // tableDataGroup={tableDataGroup}
                  data={groupOptionsList}
                  isAllProduct={isAllProduct}
                  debtorId={id}
                  bmppDetailData={bmppDetailData}
                  calculationId={calculationId}
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
        <SectionTitle title={detailGroup?.groupName} isOpen>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isDebtorproposedLoading}
              tableHeader={tableHeaderGroup}
              tableData={!isTableEmpty ? tableDataDebtorProposed : []}
              totalPage={totalPageDebtor?.totalPage ?? 1}
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
                      {additionalDataDebtor?.total ? `IDR ${additionalDataDebtor?.total}` : '-'}
                    </TextStyle>
                  </TableCell>
                </>
              )}
            />
          </BaseContainer>
        </SectionTitle>
        }

      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TabProposedFacilitiesList;
