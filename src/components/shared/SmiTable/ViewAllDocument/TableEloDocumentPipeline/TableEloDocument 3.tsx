// import React from 'react';

// import { ModalDef } from '@ebay/nice-modal-react';

// import BaseContainer from '@/components/shared/BaseContainer';
// import ColumnWrapper from '@/components/shared/ColumnWrapper';
// import Search from '@/components/shared/Input/components/Search';
// import SectionTitle from '@/components/shared/SectionTitle';
// import Table from '@/components/shared/Table';

// import ModalUploadDocumentElo from './components/ModalUploadDocumentElo';
// import { MODAL_UPLOAD_DOCUMENT_ELO } from './TableEloDocument.constants';
// import { useTableEloDocument } from './TableEloDocument.hook';

'use client';

import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { downloadFileV2 } from '@/helpers/utils';
import useApp from '@/hooks/useApp';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Search from '@/components/shared/Input/components/Search';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { modal, TABLE_HEADER } from '../constants';


import ModalUploadDocumentElo from './components/ModalUploadDocumentElo';
import { MODAL_UPLOAD_DOCUMENT_ELO } from './TableEloDocument.constants';
import { useTableEloDocument } from './TableEloDocument.hook 3';

import type { TableUploadDocumentProps } from '../../TableUploadDocument/TableUploadDocument.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableEloDocument = (props: TableUploadDocumentProps) => {
  const [state] = useApp();

  const {
    financingDocumentLoading,
    financingDocumentList,
    financingDocumentPage,
    isDeleteLoading,
    setItemPerPage,
    noPage,
    setNoPage,
    handleAddDocument,
    handleOpenEditModal,
    handleOpenDeleteModal,
    readOnly,
    viewOnly,
    isDpop,
    isBusinessDivision,
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
  } = useTableEloDocument(props);

  const isSuperAdmin = state.currentRole.includes(roles.SUPER_ADMIN);

  const isDisabled = isSuperAdmin || readOnly || viewOnly;

  const handleActionButton = (row) => {
    let res = [];
    res.push(
      {
        iconName: 'preview-document',
        isDisabled: isDeleteLoading,
        onClick: (data) =>
          window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
      },
      {
        iconName: 'download',
        isDisabled: isDeleteLoading,
        onClick: (row) => downloadFileV2(row.document, row.fileName),
      },
    );

    if (!isDisabled && (row.hasSubmitted || !row.isFromOtherProcess)) {
      res.unshift({
        iconName: 'edit',
        isDisabled: (row) => isDeleteLoading || !row?.isEditable,
        onClick: async (row) => handleOpenEditModal(row.id),
      },
      {
        iconName: 'delete',
        isDisabled: (row) => isDeleteLoading || !row?.isDeletable,
        onClick: async (row) => handleOpenDeleteModal(row.id),
      });
    }
    return res;
  };

  const tableHeaderDocument: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'divisionLabel',
      label: 'Divisi',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'uploadedDate',
      label: 'Uploaded Date',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: (row) => handleActionButton(row),
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    },
  ];

  return (
    <ColumnWrapper gap={2}>
      <SectionTitle title="Document ELO" />
      <Search
        value={filter}
        isDebounced
        hasFilter
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderDocument}
          tableData={financingDocumentList}
          isLoading={financingDocumentLoading}
          currentPage={noPage}
          totalPage={financingDocumentPage?.totalPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          footer={isBusinessDivision && !viewOnly && !readOnly ? <TableFooter onClick={handleAddDocument} /> : null}
        />
      </BaseContainer>
      <ModalDef
        id={MODAL_UPLOAD_DOCUMENT_ELO}
        component={ModalUploadDocumentElo}
      />
    </ColumnWrapper>
  );
};

export default TableEloDocument;
