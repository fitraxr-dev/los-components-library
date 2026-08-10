'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';


import { TypeModule, TypeProcess } from '@/enums/Module';

import ActionButtons from '@/components/shared/ActionButtons';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import ModalDetailDocument from '../components/ModalDetailDocument';
import { modal } from '../Documentation.constants';

import useELODocument from './ELODocument.hook';


const ELODocumentPage = () => {
  const theme = useTheme();

  const {
    handleOpenSubmitModal,
    isSubmitLoading,
    handleClose,
    actions,
  } = useELODocument();

  return (
    <>
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title title="Documentation" />

        <TableEloDocument
          module={TypeModule.MAINTENANCE_DATA}
          process={TypeProcess.MAINTENANCE_CUSTOMER}
          dataAsOf
          clientSideFiltering={false}
        />

        <ActionFooterDetail />

      </ColumnWrapper>

      <ModalDef
        id={modal.DETAIL_DOCUMENT}
        component={ModalDetailDocument}
      />
    </>
  );
};

export default ELODocumentPage;
