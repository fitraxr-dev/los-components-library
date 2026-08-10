'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';

import TableUploadDocumentMUP from './components/TableUploadDocumentMUP/TableUploadDocumentMUP';
import { MupDiscussionContext } from './MupDiscussion.context';
import useMupDiscussion from './MupDiscussion.hook';


const MupDiscussionPage = () => {
  const theme = useTheme();

  const {
    _module,
    process,
    currentStaffName,
    ownerId,
    isRM,
    bucketMasterId,
    isGetBcmSuccess,
    analystId,
    renderActionButtons,
    callbackTableDocumentMUP,
  } = useMupDiscussion();

  const contextValue = {
    _module,
    analystId,
    bucketMasterId,
    currentStaffName,
    isGetBcmSuccess,
    isRM,
    process,
  };

  return (
    <MupDiscussionContext.Provider value={contextValue}>
      <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
        <Title title="Pembahasan MUP" />
        <TableDebtorInformation module={_module} process={process} />
        <TableUploadDocumentMUP callbackDataTable={callbackTableDocumentMUP} />


        <TableUploadDocument
          ownerId={ownerId}
          module={_module}
          process={process}
          title="Upload Dokumen Lainnya"
          // showModalSelector={true}
        />
        <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>
    </MupDiscussionContext.Provider>

  );
};

export default MupDiscussionPage;
