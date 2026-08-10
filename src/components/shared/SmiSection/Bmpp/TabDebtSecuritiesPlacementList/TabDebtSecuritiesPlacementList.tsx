import React from 'react';

import { Box, TableCell, useTheme } from '@mui/material';

import { formatDate } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import TableGroup from './components/TableGroup';
import { tableHeader, tableHeaderGroup } from './TabDebtSecuritiesPlacementList.constants';
import useMupBmppDebtSecurities from './TabDebtSecuritiesPlacementList.hook';

import type { TabDebtSecuritiesPlacementListProps } from './TabDebtSecuritiesPlacementList.types';


const TabDebtSecuritiesPlacementList = (props: TabDebtSecuritiesPlacementListProps) => {
  const {
    module,
    process,
    handleNext,
    debtorName,
    handleOnClickInquiry,
    isPemda,
    withTableDebtorInformation = false,
    tableDataDebtor,
    tableDataGroup,
    isTableDataDebtorLoading,
    isTableDataGroupLoading,
    isUseGetMasterDetail = false,
  } = props;
  const theme = useTheme();

  const {
    hasTableGroupData,
    totalNominalInIdr,
  } = useMupBmppDebtSecurities(props);

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Button
        sx={{ width: '14vw' }}
        disabled
        onClick={handleOnClickInquiry}
      >
        Inquiry Surat Utang
      </Button>
      {withTableDebtorInformation && (
        <TableDebtorInformation module={module} process={process} isUseGetMasterDetail={isUseGetMasterDetail} />
      )}
      <BaseContainer sx={{ gap: theme.spacing(3), px: theme.spacing(2) }}>
        <Box
          sx={{
            borderBottom: '0.02vw solid',
            borderColor: theme.palette.custom.gray30,
            display: 'grid',
            gridTemplateColumns: '15% 1fr',
            py: 1,
          }}
        >
          <TextStyle
            variant="body3"
            color={theme.palette.custom.gray30}
          >
            Data as of
          </TextStyle>
          <TextStyle
            variant="body3"
            color={theme.palette.custom.gray30}
          >
            {`: ${formatDate(new Date())}`}
          </TextStyle>
        </Box>

        <SectionTitle title={debtorName} isOpen>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isTableDataDebtorLoading}
              tableHeader={tableHeader}
              tableData={tableDataDebtor}
              handlePageChange={() => { }}
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
                    >
                      {totalNominalInIdr}
                    </TextStyle>
                  </TableCell>
                </>
              )}
            />
          </BaseContainer>
        </SectionTitle>
        {!isPemda && (
          <>
            {hasTableGroupData && tableDataGroup?.map((group, index) => (
              <TableGroup
                key={group.groupId}
                idx={index + 1}
                tableHeader={tableHeaderGroup}
                tableData={group.debtSecuritiesMemberList}
                data={group}
                isLoading={isTableDataGroupLoading}
              />
            ))}
          </>
        )}

      </BaseContainer>

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabDebtSecuritiesPlacementList;
