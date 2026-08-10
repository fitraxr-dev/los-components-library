import { ModalDef } from '@ebay/nice-modal-react';
import { TableCell, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ModalShareholderDetail from './components/ModalShareholderDetail';
import { MODAL_SHAREHOLDER } from './TableShareholder.constants';
import useTableShareholder from './TableShareholder.hook';


const TableShareholder = () => {
  const theme = useTheme();
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
    totalShares,
    totalPercentage,
    isBussiness,
    anomalyRow,
    isLoading,
    isAddButtonEnabled,
    showAddButton,
    handleAddData,
  } = useTableShareholder();

  return (
    <>
      <SectionTitle title="Shareholder" isOpen>
        <BaseContainer>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={pageSize}
            anomalyRow={anomalyRow}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            renderAdditonalRow={() => (
              <>
                {isBussiness ? (
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
                  </>
                ) : null}
              </>
            )}
            footer={(
              showAddButton &&
              <RowWrapper
                sx={{ justifyContent: 'end', mb: 2 }}
              >
                <Button
                  variant="outlined"
                  startIcon="add-2"
                  startIconSx={{ fontSize: theme.spacing(3) }}
                  sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                  onClick={() => handleAddData()}
                  disabled={!isAddButtonEnabled}
                >
                  Add New
                </Button>
              </RowWrapper>
            )}
          />
        </BaseContainer>
      </SectionTitle>
      <ModalDef
        id={MODAL_SHAREHOLDER.SHAREHOLDER_DETAIL}
        component={ModalShareholderDetail}
      />
    </>
  );
};

export default TableShareholder;
