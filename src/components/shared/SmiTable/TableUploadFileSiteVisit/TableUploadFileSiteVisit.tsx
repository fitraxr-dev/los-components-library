import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import useSiteVisitContext from '@/components/pages/SiteVisit/shared/hooks/useSiteVisitContext';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import ModalUploadFile from './components/ModalUploadFile';
import { modal } from './TableUploadFileSiteVisit.contants';
import useTableUploadFile from './TableUploadFileSiteVisit.hook';

import type { TableUploadFileSiteVisitProps } from './TableUploadFileSiteVisit.types';


const TableUploadFileSiteVisit = (props: TableUploadFileSiteVisitProps) => {
  const theme = useTheme();
  const {
    fileList,
    handleAddFile,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeaderUploadFile,
    isGetDocumentListLoading,
    isValid,
  } = useTableUploadFile(props);
  const { siteVisitDetail } = useSiteVisitContext();

  return (
    <>
      {siteVisitDetail?.bucketId && isValid &&
        <ColumnWrapper sx={{ gap: 3 }}>
          <SectionTitle title="Upload Foto dan Video Site Visit" isOpen>
            <BaseContainer>
              <Table
                isLoading={isGetDocumentListLoading}
                tableData={fileList?.contents}
                tableHeader={tableHeaderUploadFile}
                currentPage={noPage}
                totalPage={fileList?.page?.totalPage}
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
                          onClick={() => handleAddFile()}
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
        id={modal.MODAL_UPLOAD_FILE}
        component={ModalUploadFile}
      />
      <ModalDef
        id={modal.FILE_DETAIL}
        component={ModalUploadFile}
      />
    </>
  );
};

export default TableUploadFileSiteVisit;
