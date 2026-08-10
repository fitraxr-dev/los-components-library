import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import ModalOtherRelationDetail from './components/ModalOtherRelationDetail';
import { MODAL_OTHER_RELATION } from './TableOtherRelation.constants';
import useTableOtherRelation from './TableOtherRelation.hook';


const TableOtherRelat = () => {
  const theme = useTheme();
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    anomalyRow,
    tableData,
    tableHeader,
    isLoading,
    isAddButtonEnabled,
    totalPage,
    showAddButton,
    handleAddData,
  } = useTableOtherRelation();

  return (
    <>
      <SectionTitle title="Pihak Terkait Lainnya" isOpen>
        <BaseContainer>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage ?? 1}
            currentPage={page}
            isLoading={isLoading}
            anomalyRow={anomalyRow}
            handlePageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
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
        id={MODAL_OTHER_RELATION.OTHER_RELATION_DETAIL}
        component={ModalOtherRelationDetail}
      />
    </>
  );
};

export default TableOtherRelat;
