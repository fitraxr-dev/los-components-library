'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';


import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import FinancingDocumentDraftModal from './components/FinancingDocumentDraftModal';
import { modal } from './FinancingDocumentDraftTable.constants';
import { useFinancingDocumentDraftTable } from './FinancingDocumentDraftTable.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const FinancingDocumentDraftTable = () => {


  const viewOnly = false;

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
  } = useFinancingDocumentDraftTable();

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
      options: (props) => [
        {
          iconName: 'delete',
          onClick: (data) => handleDeleteDraft(data.documentType.value),
          // isDisabled: deleteAttachmentLoading || props.viewOnly || viewOnly,
        },
      ],
      sx: {
        width: '68px',
      },
      type: 'action',
    },
  ];

  // const isKadivTL = state.currentRole.includes(roles.KADIV) || state.currentRole.includes(roles.TL);
  // const isViewOnly = viewOnly || (isKadivTL && viewOnly);
  const isViewOnly = viewOnly;
  return (
    <>
      <SectionTitle title="Document Pembiayaan" />
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

      <ModalDef
        id={modal.FINANCING_DOCUMENT_DRAFT}
        component={FinancingDocumentDraftModal}
      />
    </>
  );
};

export default FinancingDocumentDraftTable;
