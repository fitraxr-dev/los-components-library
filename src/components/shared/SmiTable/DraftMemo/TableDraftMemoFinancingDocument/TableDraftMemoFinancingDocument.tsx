'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';


import ModalDraftMemoFinancingDocument from './components/ModalDraftMemoFinancingDocument';
import { modal } from './TableDraftMemoFinancingDocument.constants';
import { useTableDraftMemoFinancingDocument } from './TableDraftMemoFinancingDocument.hook';

import type { TableDraftMemoFinancingDocumentProps } from './TableDraftMemoFinancingDocument.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableDraftMemoFinancingDocument = (props: TableDraftMemoFinancingDocumentProps) => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const {
    noPage,
    setNoPage,
    setItemPerPage,
    handleOpenAddModal,
    handleDeleteDraft,
    attachmentListContents,
    attachmentListPage,
    attachmentListLoading,
    deleteAttachmentLoading,
  } = useTableDraftMemoFinancingDocument(props);

  const tableHeaderFinancingDocument: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '55px',
      },
      type: 'index',
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      render: (row, index) => (
        <Input
          key={index}
          type="dropdown"
          value={row.documentType.value}
          dropdownList={[{
            label: row.documentType.label,
            value: row.documentType.value,
          }]}
          disabled
        />
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: () => [
        {
          iconName: 'delete',
          isDisabled: deleteAttachmentLoading || viewOnly,
          onClick: (data) => handleDeleteDraft(data.documentType.value),
        },
      ],
      sx: {
        width: '68px',
      },
      type: 'action',
    },
  ];

  const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  const isViewOnly = viewOnly || (isKadivTL && viewOnly);

  return (
    <>
      <SectionTitle title="Document Pembiayaan" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderFinancingDocument}
            tableData={attachmentListContents}
            isLoading={attachmentListLoading}
            currentPage={noPage}
            totalPage={attachmentListPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={!isViewOnly && <TableFooter sx={{ mr: 4 }} onClick={handleOpenAddModal} />}
          />
        </BaseContainer>
      </SectionTitle>
      <ModalDef
        id={modal.FINANCING_DOCUMENT_DRAFT_MODAL}
        component={ModalDraftMemoFinancingDocument}
      />
    </>
  );
};

export default TableDraftMemoFinancingDocument;
