'use client';

import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';

import BaseContainer from '@/components/shared/BaseContainer';
import Search from '@/components/shared/Input/components/Search';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import ModalUploadDocumentElo from './components/ModalUploadDocumentElo';
import { MODAL_UPLOAD_DOCUMENT_ELO, tableHeaderList } from './TableEloDocument.constants';
import { useTableEloDocument } from './TableEloDocument.hook';

import type { TableUploadDocumentProps } from '../../TableUploadDocument/TableUploadDocument.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableEloDocument = (props: TableUploadDocumentProps) => {
  const [state] = useApp();

  const downloadMutation = useDownloadGeneral({
    onError: (error) => {
      showNiceModalV2({
        title: 'Download gagal',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Download berhasil',
        type: 'success',
      });
    },
  });

  const handleDownload = (id: number, fileName?: string) => {
    downloadMutation.mutate({ fileName, id });
  };

  const {
    eloDocumentLoading,
    eloDocumentList,
    eloDocumentPage,
    isDeleteLoading,
    noPage,
    setNoPage,
    setItemPerPage,
    handleAddDocument,
    handleOpenEditModal,
    handleOpenDeleteModal,
    readOnly,
    viewOnly,
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
        onClick: (row) => handleDownload(row.id, row.fileName),
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
    ...tableHeaderList,
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
    <>
      <SectionTitle title="Document ELO" isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Search
            value={filter}
            isDebounced
            hasFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
          <Table
            tableHeader={tableHeaderDocument}
            tableData={eloDocumentList}
            isLoading={eloDocumentLoading}
            currentPage={noPage}
            totalPage={eloDocumentPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={isBusinessDivision && !viewOnly && !readOnly ? <TableFooter onClick={handleAddDocument} /> : null}
          />
        </BaseContainer>
      </SectionTitle>

      {/* Modals */}
      <ModalDef
        id={MODAL_UPLOAD_DOCUMENT_ELO}
        component={ModalUploadDocumentElo}
      />
    </>
  );
};

export default TableEloDocument;
