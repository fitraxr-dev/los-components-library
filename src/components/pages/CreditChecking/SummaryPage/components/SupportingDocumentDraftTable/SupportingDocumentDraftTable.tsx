'use client';
import React from 'react';

import { roles } from '@/configs/constants';


import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { useSupportingDocumentDraftTable } from './SupportingDocumentDraftTable.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const SupportingDocumentDraftTable = () => {


  const viewOnly = false;
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
  } = useSupportingDocumentDraftTable();

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
      options: (props) => [
        {
          iconName: 'delete',
          onClick: (data) => {
            handleDeleteDraft(data.documentType.value);
          },
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
      <SectionTitle title="Supporting Document" />
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
    </>
  );
};

export default SupportingDocumentDraftTable;
