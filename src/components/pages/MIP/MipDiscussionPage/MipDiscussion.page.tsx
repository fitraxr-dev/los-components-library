'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';

import TableUploadDocumentMIP from './components/TableUploadDocumentMIP/TableUploadDocumentMIP';
import { MipDiscussionContext } from './MipDiscussion.context';
import useMipDiscussion from './MipDiscussion.hook';


const MipDiscussionPage = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const { processId: identityProcessId } = useIdentity();

  const {
    _module,
    process,
    processId,
    isAnalyst,
    currentStaffName,
    isRM,
    isTL,
    isStaff,
    isStaffSuperAdmin,
    isSuperAdminMaker,
    isSuperAdminChecker,
    ownerId,
    bucketMasterId,
    isDocumentConfirmed,
    // renderActions,
    setIsDocumentConfirmed,
    isGetBcmSuccess,
    analystId,
    renderActionButtons,
    stepperStatus,
    stepperSteps,
  } = useMipDiscussion();

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  useUpdateMipr({
    bucketParent: identityProcessId,
    stepperStatus,
    steps: stepperSteps,
  });

  const contextValue = {
    _module,
    analystId,
    bucketMasterId,
    currentStaffName,
    isGetBcmSuccess,
    isRM,
    isStaffSuperAdmin,
    isSuperAdminMaker,
    process,
    processId,
  };

  return (
    <MipDiscussionContext.Provider value={contextValue}>
      <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
        <Title title="Pembahasan MIP" />
        <TableDebtorInformation module={_module} process={process} />
        <TableUploadDocumentMIP />


        <TableUploadDocument
          ownerId={ownerId}
          module={_module}
          process={process}
          showModalSelector={true}
          withDocElo={false}
        // actions={renderActions}
        // cantAddNew={isAnalyst && !isStaff}
        // excludeProcess={true}
        />

        {isAnalyst && (
          <Input
            disabled={viewOnly || !(isStaff || isTL || isSuperAdminMaker || isSuperAdminChecker || isStaffSuperAdmin)}
            type="radio"
            label="Apakah Dokumen MIP sudah dikonfirmasi?"
            value={isDocumentConfirmed}
            onChange={(val) => setIsDocumentConfirmed(val.target.value === 'true' ? true : false)}
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false }
            ]}
            sx={{ flex: 1 }}
            isMandatory
          />
        )}
        <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>
    </MipDiscussionContext.Provider>

  );
};

export default MipDiscussionPage;
