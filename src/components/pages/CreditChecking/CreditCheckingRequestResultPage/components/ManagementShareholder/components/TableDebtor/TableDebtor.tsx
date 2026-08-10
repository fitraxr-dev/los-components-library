import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import ModalDebtorDetail from './components/ModalDebtorDetail';
import useTableDebtor from './TableDebtor.hook';


const TableDebtor = () => {
  const theme = useTheme();
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
    isLoading,
    anomalyRow,
    showAddButton,
    isAddButtonEnabled,
    handleAddData,
  } = useTableDebtor();

  return (
    <>
      <SectionTitle title="Customer" isOpen>
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
        id="DEBTOR_DETAIL"
        component={ModalDebtorDetail}
      />
    </>
  );
};

export default TableDebtor;
