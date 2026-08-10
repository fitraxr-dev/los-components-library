import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { downloadFile } from '@/helpers/utils';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import ModalUploadDocumentRisalah from './components/ModalUploadDocumentRisalah.tsx';
import { modal, TABLE_HEADER } from './TableUpdateRisalahRapat.constants';
import { useTableUpdateRisalahRapat } from './TableUpdateRisalahRapat.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableUpdateRisalahRapat = () => {
  const { viewOnly } = useViewOnly();

  const {
    handleOpenAddModal,
    isDeleteLoading,
    noPage,
    risalahRapatList,
    risalahRapatLoading,
    risalahRapatPage,
    setItemPerPage,
    setNoPage,
  } = useTableUpdateRisalahRapat();

  const theme = useTheme();

  const statusRR = localStorage.getItem('statusRR');

  const tableHeaderRisalahRapat: Array<TableHeader> = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (row) => [
        {
          iconName: 'preview-document',
          isDisabled: isDeleteLoading,
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          isDisabled: isDeleteLoading,
          onClick: (row) => downloadFile(row.document, row.fileName),
        },
      ],
      sx: {
        width: '12%',
      },
      type: 'action',
    },
  ];

  return (
    <>
      <SectionTitle
        title="Pembaharuan Risalah Rapat"
        sx={{
          mb: 3,
          ...((statusRR !== 'expired') && {
            '& > .MuiBox-root > span': {
              color: theme.palette.grey[500],
            },
          }),
        }}
        isOpen
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
            footer={statusRR === 'expired' ? <TableFooter onClick={handleOpenAddModal} /> : null}
            emptyMessage={statusRR !== 'expired' && 'Pembaruan Belum Diperlukan Karena Risalah Rapat Masih Berlaku.'}
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

export default TableUpdateRisalahRapat;
