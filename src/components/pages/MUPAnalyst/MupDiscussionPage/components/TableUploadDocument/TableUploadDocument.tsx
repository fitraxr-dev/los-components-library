import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalUploadDocument from '@/components/shared/SmiModal/ModalUploadDocument';
import Table from '@/components/shared/Table';

import { modal } from './TableUploadDocument.constants';

import type { TableUploadDocumentProps } from './TableUploadDocument.types';


const TableUploadDocument = (props: TableUploadDocumentProps) => {
  const {
    title = 'Upload Dokumen Lainnya',
    tableData,
    tableHeader,
    tablePage,
    isLoading,
    noPage,
    setNoPage,
    setItemPerPage,
    hasAddButton = false,
    handleOpenAddModal,
  } = props;

  const theme = useTheme();

  return (
    <>
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <SectionTitle title={title} isOpen sx={{ mb: 3 }}>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isLoading}
              tableData={tableData}
              tableHeader={tableHeader}
              currentPage={noPage}
              totalPage={tablePage?.totalPage}
              handlePageChange={setNoPage}
              onPageSizeChange={setItemPerPage}
              footer={(
                hasAddButton &&
                <RowWrapper
                  sx={{ justifyContent: 'end', mb: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={handleOpenAddModal}
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
        component={ModalUploadDocument}
      />
    </>
  );
};

export default TableUploadDocument;
