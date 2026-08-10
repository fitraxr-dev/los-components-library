'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalAssign from '@/components/shared/SmiModal/ModalAssign';
import ModalReassign from '@/components/shared/SmiModal/ModalReassign';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/TableV2';
import Title from '@/components/shared/Title';

import ModalAddNew from './components/ModalAddNew/ModalAddNew';
import ModalTableDK from './components/ModalTableDK/ModalTableDK';
import { modalAnnualReview } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    canShowButtonAddNew,
    filter,
    listContents,
    listPage,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    showAssignTo,
    handleOpenAssignModal,
    handleOpenReassignModal,
    title,
    handleOpenAddNewModal,
    showAddNewButton,
  } = useList();

  return (
    <>
      <Title title={title} />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box width="45vw">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
                processTemplateType: showAddNewButton ? 'ANNUAL_REVIEW_DEPI' : 'ANNUAL_REVIEW',
                queryKeyList: ['bucket-list', 'bucket-list-assignment'],
              })}
              startIcon="upload"
            >
              Upload Dokumen
            </Button>
            {...(canShowButtonAddNew ? [
              showAddNewButton && <Button onClick={handleOpenAddNewModal}>Add New</Button>
            ] : []
            )}
          </Box>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={listContents}
            totalPage={listPage}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      {showAssignTo && pathname.includes('assignment') &&
        <RowWrapper justifyContent="end" sx={{ mt: 3 }}>
          <Button
            onClick={handleOpenAssignModal}
          >
            Assign To
          </Button>
        </RowWrapper>
      }
      {/* Assign */}
      <ModalDef
        id={MODAL.ASSIGN_TO}
        component={ModalAssign}
      />

      {showAssignTo && pathname.includes('monitoring') &&
        <RowWrapper justifyContent="end" sx={{ mt: 3 }}>
          <Button
            onClick={handleOpenReassignModal}
          >
            Re-assign To
          </Button>
        </RowWrapper>
      }
      {/* Reassign */}
      <ModalDef
        id={MODAL.REASSIGN_TO}
        component={ModalReassign}
      />

      {/* Add New */}
      <ModalDef
        id={modalAnnualReview.ADD_NEW}
        component={ModalAddNew}
      />

      {/* DK */}
      <ModalDef
        id={modalAnnualReview.MODAL_TABLE_DK}
        component={ModalTableDK}
      />

      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />
    </>
  );
};

export default ListPage;
