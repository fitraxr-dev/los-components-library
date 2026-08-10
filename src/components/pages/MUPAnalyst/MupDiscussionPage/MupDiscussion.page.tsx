'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import TableUploadDocument from './components/TableUploadDocument';
import TableUploadDocumentMUP from './components/TableUploadDocumentMUP/TableUploadDocumentMUP';
import { MupDiscussionContext } from './MupDiscussion.context';
import useMupDiscussion from './MupDiscussion.hook';


const MupDiscussionPage = () => {
  const theme = useTheme();

  const {
    _module,
    actionOptions,
    handleOpenAddDocument,
    noPage,
    process,
    setItemPerPage,
    setNoPage,
    tableUploadDocumentData,
    tableUploadDocumentPage,
    isTableUploadDocumentLoading,
    isEnableConfirmation,
    currentStaffName,
    bucketMasterId,
    isDocumentConfirmed,
    setIsDocumentConfirmed,
    isGetBcmSuccess,
    tableHeader,
    analystId,
    renderActionButtons,
    handleBackToListPage,
    viewOnly,
    callbackTableDocumentMUP,
    canView,
    canUpdate,
  } = useMupDiscussion();

  if (!canView) {
    return null;
  }

  const contextValue = {
    _module,
    analystId,
    bucketMasterId,
    currentStaffName,
    isGetBcmSuccess,
    process,
  };

  return (
    <MupDiscussionContext.Provider value={contextValue}>
      <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
        <Title title="Pembahasan MUP" />
        <TableDebtorInformation module={_module} process={process} />
        <TableUploadDocumentMUP callbackDataTable={callbackTableDocumentMUP} />

        <TableUploadDocument
          module={_module}
          process={process}
          title="Upload Dokumen Lainnya"
          tableHeader={tableHeader}
          tableData={tableUploadDocumentData}
          tablePage={tableUploadDocumentPage}
          isLoading={isTableUploadDocumentLoading}
          tableActionOptions={actionOptions}
          noPage={noPage}
          setNoPage={setNoPage}
          setItemPerPage={setItemPerPage}
          handleOpenAddModal={handleOpenAddDocument}
          hasAddButton={canUpdate && !viewOnly}
        />

        {isEnableConfirmation && (
          <Input
            type="radio"
            label="Apakah Dokumen MUP sudah dikonfirmasi?"
            value={isDocumentConfirmed}
            onChange={(val) => setIsDocumentConfirmed(val.target.value === 'true')}
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false }
            ]}
            sx={{ flex: 1 }}
            isMandatory
          />
        )}

        <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
          {viewOnly && (
            <Button
              variant="outlined"
              onClick={handleBackToListPage}
            >
              Close
            </Button>
          )}
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>
    </MupDiscussionContext.Provider>

  );
};

export default MupDiscussionPage;
