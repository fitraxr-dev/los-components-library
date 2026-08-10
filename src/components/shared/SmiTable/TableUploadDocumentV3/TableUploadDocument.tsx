import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';


import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import Button from '../../Button';
import ModalUploadDocumentExisting from '../../SmiModal/ModalUploadDocumentExisting';
import ModalUploadDocumentV3 from '../../SmiModal/ModalUploadDocumentV3';

import ModalDetailUploadDocument from './components/ModalDetailUploadDocument';
import { modal } from './TableUploadDocument.constants';
import useTableUploadDocument from './TableUploadDocument.hook';

import type { TableUploadDocumentProps } from './TableUploadDocument.types';


const TableUploadDocument = ({
  module,
  process,
  childId,
  title = 'Upload Dokumen',
  showModalSelector = false,
  actions = {},
  ownerId,
  approvedMandatory,
}: TableUploadDocumentProps) => {
  const theme = useTheme();
  const {
    documentList,
    handleAddDocument,
    isGetDocumentListLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeaderUploadDocument,
    viewOnly,
  } = useTableUploadDocument({
    actions,
    approvedMandatory,
    childId,
    module,
    ownerId,
    process,
    showModalSelector,
  });


  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title={title} isOpen>
          <BaseContainer>
            <Table
              isLoading={isGetDocumentListLoading}
              tableData={documentList?.contents}
              tableHeader={tableHeaderUploadDocument}
              currentPage={noPage}
              totalPage={documentList?.page?.totalPage}
              handlePageChange={setNoPage}
              onPageSizeChange={setItemPerPage}
              footer={(
                viewOnly ?
                  null :
                  <RowWrapper
                    sx={{ justifyContent: 'end', mb: 2 }}
                  >
                    <Button
                      variant="outlined"
                      startIcon="add-2"
                      startIconSx={{ fontSize: theme.spacing(3) }}
                      sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                      onClick={() => handleAddDocument()}
                    >
                      Add New
                    </Button>
                  </RowWrapper>
              )}
            />
          </BaseContainer>
        </SectionTitle>
      </ColumnWrapper>

      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocumentV3}
      />
      <ModalDef
        id={modal.DOCUMENT_DETAIL}
        component={ModalDetailUploadDocument}
      />
      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT_EXISTING}
        component={ModalUploadDocumentExisting}
      />
    </>
  );
};

export default TableUploadDocument;
