import { TableCell, useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import useTableShareholder from './TableShareholder.hook';


const TableShareholder = (props: SmiComponentProps) => {
  const theme = useTheme();
  const {
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    shareholderPage,
    handleAddShareholder,
    tableDataShareholder,
    tableHeaderShareholder,
    totalPercentage,
    totalShares,
    showFooter,
  } = useTableShareholder(props);

  const { module } = props;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <SectionTitle title="Shareholder" />
      <BaseContainer>
        <Table
          tableHeader={tableHeaderShareholder}
          tableData={tableDataShareholder}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          renderAdditonalRow={() => (
            !module?.includes(TypeModule.CREDIT_CHECKING) && module !== TypeModule.MIP ?
              <>
                <TableCell colSpan={4}>
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
                    {totalShares}
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
              </> : null
          )}
          footer={showFooter ? <TableFooter onClick={handleAddShareholder} /> : null}
        />
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TableShareholder;
