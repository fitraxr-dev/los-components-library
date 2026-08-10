import React from 'react';

import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeader } from './TableFinancingFacilityOtherBankSummary.constants';
import useTableFinancingFacilityOtherBankSummary from './TableFinancingFacilityOtherBankSummary.hook';


const TableFinancingFacilityOtherBankSummary = () => {
  const theme = useTheme();

  const {
    otherBankSummaryData,
    isLoading,
    totalPlafond,
    totalOutstanding,
  } = useTableFinancingFacilityOtherBankSummary();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          maxHeight="42vh"
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={otherBankSummaryData}
          renderAdditonalRow={() => (
            <>
              <TableCell colSpan={2}>
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
                  IDR {totalPlafond}
                </TextStyle>
              </TableCell>
              <TableCell>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  IDR {totalOutstanding}
                </TextStyle>
              </TableCell>
            </>
          )}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TableFinancingFacilityOtherBankSummary;
