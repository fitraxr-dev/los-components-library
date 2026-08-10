import React from 'react';

import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeader } from './TableAccountInformationOtherBankSummary.constants';
import useTableFinancingFacilityOtherBankSummary from './TableAccountInformationOtherBankSummary.hook';


const TableAccountInformationOtherBankSummary = () => {
  const theme = useTheme();

  const {
    otherBankSummaryData,
    isLoading,
    totalGrand,
    totalPercentage,
  } = useTableFinancingFacilityOtherBankSummary();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <SectionTitle title="Summary Informasi Rekening" sx={{ marginBottom: theme.spacing(3) }} isOpen>
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
                    IDR {totalGrand}
                  </TextStyle>
                </TableCell>
                <TableCell>
                  <TextStyle
                    variant="body4"
                    weight={600}
                    color={theme.palette.primary.main}
                  >
                    {totalPercentage}%
                  </TextStyle>
                </TableCell>
              </>
            )}
          />
        </BaseContainer>
      </SectionTitle>
    </ColumnWrapper>
  );
};

export default TableAccountInformationOtherBankSummary;
