import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';


import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalUploadDocumentExisting from '@/components/shared/SmiModal/ModalUploadDocumentExisting';
import Table from '@/components/shared/Table';

import Button from '../../Button';

import ModalDetailUploadDocument from './components/ModalDetailUploadDocument';
import ModalUploadDocumentRipple from './components/ModalUploadDocumentRipple';
import { modal } from './TableUploadDocumentRipple.constants';
import useTableUploadDocument from './TableUploadDocumentRipple.hook';

import type { TableUploadDocumentRippleProps } from './TableUploadDocumentRipple.types';

/**
 * <TableUploadDocumentRipple
     module={TypeModule.ENGAGEMENT_AGREEMENT}
     process={TypeProcess.ENGAGEMENT_AGREEMENT}
     title="Document Pembiayaan"
     rippleTo={rippleToDocument} /> component for rendering TableUploadDocumentRippleProps.
 *
 * @component
 * @param {TableUploadDocumentRippleProps}  - TableUploadDocumentRippleProps to be rendered.
 * @returns {React.Component} Rendered TableUploadDocumentRippleProps  component.
 * @typeProps
 * documentParent?: DocumentTypeRequestDtoDocumentParentEnum;
  process: string;
  module: string;
  title?: string;
  ownership?: DocumentTypeRequestDtoOwnershipEnum;
  childId?: string; //optional for parsing childId GET/SAVE
  rippleTo: RippleToDocument[];{module, procces, bucketProcessId}
  isDocumentCategoryDisable?: boolean; // The props below are used when viewing-all-document
  type?: DocumentTypeRequestDtoDocumentCategoryEnum; // The  props below are used when viewing-all-document
  documentCategory?: DocumentTypeRequestDtoDocumentCategoryEnum; // The  props below are used when viewing-all-document
 *
 * @example
 *   <TableUploadDocumentRipple
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        rippleTo={rippleToDocument}
        title="Document Pembiayaan" //optional
        documentParent={DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT} //optional
        // The 3 props below are used when viewing-all-document
        isDocumentCategoryDisable
        type={DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT}
        documentCategory={DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT}
      />
 *
 */


const TableUploadDocumentRipple = (props: TableUploadDocumentRippleProps) => {
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
  } = useTableUploadDocument(props);


  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle title={props?.title ?? 'Upload Dokumen'} isOpen>

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
        id={modal.MODAL_UPLOAD_DOCUMENT_RIPPLE}
        component={ModalUploadDocumentRipple}
      />
      <ModalDef
        id={modal.MODAL_DETAIL_DOCUMENT_RIPPLE}
        component={ModalDetailUploadDocument}
      />
      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT_EXISTING}
        component={ModalUploadDocumentExisting}
      />
    </>
  );
};

export default TableUploadDocumentRipple;
