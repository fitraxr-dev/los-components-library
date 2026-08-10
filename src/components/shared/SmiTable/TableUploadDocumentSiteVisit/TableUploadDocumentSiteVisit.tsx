import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import useSiteVisitContext from '@/components/pages/SiteVisit/shared/hooks/useSiteVisitContext';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';


import ModalUploadDocument from './components/ModalUploadDocument';
import { modal } from './TableUploadDocumentSiteVisit.contants';
import useTableUploadDocument from './TableUploadDocumentSiteVisit.hook';

import type { TableUploadDocumentSiteVisitProps } from './TableUploadDocumentSiteVisit.types';


const TableUploadDocumentSiteVisit = (props: TableUploadDocumentSiteVisitProps) => {
  const theme = useTheme();
  const {
    documentList,
    handleAddDocument,
    isGetDocumentListLoading,
    isVisitDetailLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeaderUploadDocument,
    isValid,
    visitDetailData,
  } = useTableUploadDocument(props);
  const { siteVisitDetail } = useSiteVisitContext();

  return (
    <>
      {siteVisitDetail?.bucketId && isValid &&
        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Document Site Visit" isOpen>
            <BaseContainer>
              <Table
                isLoading={isGetDocumentListLoading}
                tableData={documentList?.contents}
                tableHeader={tableHeaderUploadDocument}
                currentPage={noPage}
                totalPage={documentList?.page?.totalPage}
                handlePageChange={setNoPage}
                onPageSizeChange={setItemPerPage}
                footer={
                  props?.disabled ? undefined :
                    (
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
        || null}
      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocument}
      />
      <ModalDef
        id={modal.DOCUMENT_DETAIL}
        component={ModalUploadDocument}
      />
    </>
  );
};

export default TableUploadDocumentSiteVisit;
