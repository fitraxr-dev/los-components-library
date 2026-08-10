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

import ModalDraftMemoSupportingDocument from './components/ModalDraftMemoSupportingDocument';
import { modal } from './TableDraftMemoSupportingDocument.constants';
import { useTableDraftMemoSupportingDocument } from './TableDraftMemoSupportingDocument.hook';

import type { TableDraftMemoSupportingDocumentProps } from './TableDraftMemoSupportingDocument.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableDraftMemoSupportingDocument = (props: TableDraftMemoSupportingDocumentProps) => {
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
    attachmenListLoading,
    deleteAttachmentLoading,
  } = useTableDraftMemoSupportingDocument(props);

  const tableHeaderSupportingDocument: Array<TableHeader> = [
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
          onClick: (data) => {
            handleDeleteDraft(data.documentType.value);
          },
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
      <SectionTitle title="Supporting Document" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderSupportingDocument}
            tableData={attachmentListContents}
            isLoading={attachmenListLoading}
            currentPage={noPage}
            totalPage={attachmentListPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={!isViewOnly && <TableFooter sx={{ mr: 4 }} onClick={handleOpenAddModal} />}
          />
        </BaseContainer>
      </SectionTitle>
      <ModalDef
        id={modal.SUPPORTING_DOCUMENT_DRAFT_MODAL}
        component={ModalDraftMemoSupportingDocument}
      />
    </>
  );
};

export default TableDraftMemoSupportingDocument;
