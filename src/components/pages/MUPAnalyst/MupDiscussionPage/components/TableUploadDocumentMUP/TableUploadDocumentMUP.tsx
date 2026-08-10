import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { useMupDiscussionContext } from '../../MupDiscussion.context';
import ModalUploadDocumentMUP from '../ModalUploadDocumentMUP';

import { modal } from './TableUploadDocumentMUP.constants';
import useTableUploadDocumentMUP from './TableUploadDocumentMUP.hook';


const TableUploadDocumentMUP = (props) => {
  const theme = useTheme();
  const { isRM } = useMupDiscussionContext();

  const {
    noPage,
    setNoPage,
    setItemPerPage,
    tableHeader,
    tableData,
    tablePage,
    handleOpenAddModal,
    isTableLoading,
    isEnableAddNew,
  } = useTableUploadDocumentMUP(props);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(3),
        }}
      >
        <SectionTitle title="Upload Dokumen MUP" isOpen sx={{ mb: 3 }}>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isTableLoading}
              tableHeader={tableHeader}
              tableData={tableData}
              currentPage={noPage}
              totalPage={tablePage?.totalPage ?? 1}
              handlePageChange={setNoPage}
              onPageSizeChange={setItemPerPage}
              footer={isRM && isEnableAddNew && <TableFooter onClick={handleOpenAddModal} />}
            />
          </BaseContainer>
        </SectionTitle>
      </Box>

      <ModalDef
        id={modal.UPLOAD_DOCUMENT_MUP}
        component={ModalUploadDocumentMUP}
      />
    </>
  );
};

export default TableUploadDocumentMUP;
