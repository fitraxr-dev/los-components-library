'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import AddBusinessSummaryModal from './components/addBusinessSummaryModal/AddBusinessSummaryModal';
import EditBusinessSummaryModal from './components/editBusinessSummaryModal/EditBusinessSummaryModal';
import { useProcess } from './Process.hook';


const ProcessPage = () => {
  const { push, reset } = useBreadcrumbs();
  const {
    businessSummaryData,
    isLoading,
    isMaker,
    isViewOnly,
    handleSave,
    handleNext,
    handleClose,
    handleCancel,
    handleAdd,
    handleEdit,
    handlePageSizeChange,
    handlePageChange,
    tableHeader,
    tableData,
    tablePage,
    pageSize,
    routeId,
    routeMode,
    routeProcessId,
    routeSubModule,
    routeCode,
    description,
    page,
    totalPage,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
  } = useProcess();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-bar', label: 'Mapping Business Call & Business Call Summary' });
    push({ label: 'Process' });
  }, [push, reset]);

  return (
    <ColumnWrapper>
      <Title title="Process - Mapping Business Call & Business Call Summary" />

      <SectionTitle title="Process" isOpen={true} hideToggle={true} />
      <BaseContainer sx={{ boxShadow: 7, mb: 3 }}>
        <ColumnWrapper>
          <RowWrapper sx={{ gap: 2, my: 2 }}>
            <Box width="50%">
              <Input
                type="text"
                label="Type Business Call"
                value={routeCode || ''}
                placeholder="Enter parameter name"
                disabled
              />
            </Box>
            <Box width="50%">
              <Input
                type="text"
                label="Kategori Business Call"
                value={description || ''}
                placeholder="Enter parameter value"
                disabled
              />
            </Box>
          </RowWrapper>
        </ColumnWrapper>
      </BaseContainer>

      <SectionTitle title="Process List" isOpen={true} hideToggle={true} />
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
        containerSx={{ width: '45vw' }}
      />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <ColumnWrapper>
          <Table
            tableHeader={tableHeader}
            tableData={tableData || []}
            isLoading={isLoading}
            onPageSizeChange={handlePageSizeChange}
            handlePageChange={handlePageChange}
            currentPage={page}
            totalPage={totalPage}
            pageSize={pageSize}
            footer={!isViewOnly && isMaker && routeMode !== 'detail' ? <TableFooter onClick={handleAdd} /> : undefined}
          />
          <RowWrapper sx={{ gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            {routeMode === 'detail' ? (
              <Button variant="outlined" onClick={handleClose}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="outlined" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="outlined" color="error" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              </>
            )}
          </RowWrapper>
        </ColumnWrapper>
      </BaseContainer>

      <ModalDef id="MODAL_ADD_BUSINESS_SUMMARY" component={AddBusinessSummaryModal} />
      <ModalDef id="MODAL_EDIT_BUSINESS_SUMMARY" component={EditBusinessSummaryModal} />
    </ColumnWrapper>
  );
};

export default ProcessPage;
