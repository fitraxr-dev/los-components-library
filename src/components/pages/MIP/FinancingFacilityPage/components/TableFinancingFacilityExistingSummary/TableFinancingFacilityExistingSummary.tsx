import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeader } from './TableFinancingFacilityExistingSummary.constants';
import useTableFinancingFacilityExistingSummary from './TableFinancingFacilityExistingSummary.hook';


interface TableFinancingFacilityExistingSummaryProps {
  itemPerPage: number;
  noPage: number;
}

const TableFinancingFacilityExistingSummary = ({ itemPerPage, noPage }: TableFinancingFacilityExistingSummaryProps) => {
  const theme = useTheme();
  const {
    isLoading,
    summaryData,
    totalOutstanding,
    totalPlafond,
  } = useTableFinancingFacilityExistingSummary({
    itemPerPage,
    noPage,
  });

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          maxHeight="42vh"
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={summaryData}
          totalPage={1}
          currentPage={1}
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
                  {`IDR ${totalPlafond.idr}`}
                </TextStyle>
              </TableCell>
              <TableCell>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.main}
                >
                  {`IDR ${totalOutstanding.idr}`}
                </TextStyle>
              </TableCell>
            </>
          )}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TableFinancingFacilityExistingSummary;
