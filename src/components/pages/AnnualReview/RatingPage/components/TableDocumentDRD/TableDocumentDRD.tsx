'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Typography } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalDetailUploadDocument from '@/components/shared/SmiTable/TableUploadDocument/components/ModalDetailUploadDocument';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import ModalUploadDocument from './components/ModalUploadDocument';
import useTableDocumentDrd from './TableDocumentDRD.hook';


const TableDocumentDrd = ({ isPemda }: { isPemda: any }) => {

  const {
    drdDocumentList,
    handleOpenAddModal,
    modal,
    tableHeader,
    isLoading,
    theme,
    isApprovedStatus,
  } = useTableDocumentDrd();

  const isEmptyDrdList = !drdDocumentList || drdDocumentList.length === 0;

  const getWarningText = () => {
    if (isEmptyDrdList && !isPemda) {
      return '* Harap Upload Kertas Kerja Rating untuk dapat melanjutkan ke proses berikutnya.';
    }

    if (!isEmptyDrdList && isApprovedStatus) {
      return '*Please select document for DRD process';
    }

    return ' ';
  };

  return (
    <>
      <Typography variant="body2">
        Upload Kertas Kerja Rating
        {!isPemda && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          maxHeight="82vh"
          tableHeader={tableHeader}
          tableData={drdDocumentList || []}
          isLoading={isLoading}
          footer={
            <RowWrapper sx={{ justifyContent: 'space-between', mt: 2 }}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.custom.softRed}
              >
                {getWarningText()}
              </TextStyle>
              <TableFooter sx={{ mr: 2 }} onClick={handleOpenAddModal} />
            </RowWrapper>
          }
        />

        <ModalDef
          id={modal.MODAL_UPLOAD_DOCUMENT}
          component={ModalUploadDocument}
        />
        <ModalDef
          id={modal.DOCUMENT_DETAIL}
          component={ModalDetailUploadDocument}
        />

      </BaseContainer>
    </>
  );
};

export default TableDocumentDrd;
