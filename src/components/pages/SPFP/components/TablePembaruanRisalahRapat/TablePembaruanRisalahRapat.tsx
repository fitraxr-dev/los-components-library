import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { downloadFile } from '@/helpers/utils';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import ModalUploadDocumentRisalah from './components/ModalUploadDocumentRisalah';
import { modal, TABLE_HEADER } from './TablePembaruanRisalahRapat.constants';
import { useTablePembaruanRisalahRapat } from './TablePembaruanRisalahRapat.hook';

import type { TablePembaruanRisalahRapatProps } from './TablePembaruanRisalahRapat.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TablePembaruanRisalahRapat = (props: TablePembaruanRisalahRapatProps) => {
  const { viewOnly } = useViewOnly();
  const { isExpired, isTerminated } = props;
  const theme = useTheme();

  const {
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    isDeleteLoading,
    noPage,
    risalahRapatList,
    risalahRapatLoading,
    risalahRapatPage,
    setItemPerPage,
    setNoPage,
  } = useTablePembaruanRisalahRapat(props);

  const tableHeaderRisalahRapat: Array<TableHeader> = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (row) => {
        const actions = [
          {
            iconName: 'preview-document',
            isDisabled: row?.document ? false : true,
            onClick: (data) =>
              window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: row?.document ? false : true,
            onClick: (row) => downloadFile(row.document, row.fileName),
          },
        ];

        // Show edit and delete buttons only if isDraft is true
        if (row.isDraft === true) {
          actions.push(
            {
              iconName: 'edit',
              isDisabled: risalahRapatLoading,
              onClick: (row) => handleOpenEditModal(row),
            },
            {
              iconName: 'delete',
              isDisabled: isDeleteLoading,
              onClick: (row) => handleOpenDeleteModal(row),
            }
          );
        }

        return actions;
      },
      sx: {
        minWidth: '6vh',
      },
      type: 'action',
    },
  ];

  return (
    <>
      <SectionTitle
        title={props.title || 'Pembaruan Risalah Rapat'}
        isOpen
        sx={{
          mb: 3,
          ...((!isExpired || isTerminated) && {
            '& > .MuiBox-root > span': {
              color: theme.palette.grey[500],
            },
          }),
        }}
      >
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderRisalahRapat}
            tableData={risalahRapatList}
            isLoading={risalahRapatLoading}
            currentPage={noPage}
            totalPage={risalahRapatPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={isExpired && !isTerminated ? <TableFooter onClick={handleOpenAddModal} /> : null}
            emptyMessage={(!isExpired || isTerminated) ? 'This section will be activated once the meeting minutes validity period has ended' : undefined}
          />
        </BaseContainer>
      </SectionTitle>

      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT_RISALAH}
        component={ModalUploadDocumentRisalah}
      />
    </>
  );
};

export default TablePembaruanRisalahRapat;
