import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { useMipDiscussionContext } from '../../MipDiscussion.context';
import ModalUploadDocumentMIP from '../ModalUploadDocumentMIP';

import { modal } from './TableUploadDocumentMIP.constants';
import useTableUploadDocumentMIP from './TableUploadDocumentMIP.hook';


const TableUploadDocumentMIP = () => {
  const theme = useTheme();
  const { isRM, isStaffSuperAdmin, isSuperAdminMaker } = useMipDiscussionContext();

  const {
    noPage,
    setNoPage,
    setItemPerPage,
    tableHeader,
    tableData,
    tablePage,
    isEnableAddNew,
    isGetBcmSuccess,
    isViewOnly,
    handleOpenAddModal,
    isTableLoading,
  } = useTableUploadDocumentMIP();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <SectionTitle title="Upload Dokumen MIP" isOpen>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isTableLoading}
              tableHeader={tableHeader}
              tableData={tableData}
              currentPage={noPage}
              totalPage={tablePage?.totalPage ?? 1}
              handlePageChange={setNoPage}
              onPageSizeChange={setItemPerPage}
              footer={
                (isRM || isStaffSuperAdmin || isSuperAdminMaker) && isEnableAddNew && !isViewOnly &&
                <TableFooter onClick={handleOpenAddModal} />
              }
            />
          </BaseContainer>
        </SectionTitle>
      </Box>

      <ModalDef
        id={modal.UPLOAD_DOCUMENT_MIP}
        component={ModalUploadDocumentMIP}
      />
    </>
  );
};

export default TableUploadDocumentMIP;
