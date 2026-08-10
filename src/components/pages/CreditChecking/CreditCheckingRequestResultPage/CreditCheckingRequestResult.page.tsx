'use client';
import * as React from 'react';

import { accessid } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useCheckAccess from '@/hooks/useCheckAccess';


import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocumentCc from '@/components/shared/SmiTable/TableUploadDocumentCc';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import ConfirmationInfo from './components/ConfirmationInfo';
import DetailRequest from './components/Detail/Detail';
import ManagementShareholder from './components/ManagementShareholder';
import CreditCheckingRequestResultProvider from './CreditCheckingRequestResult.context';
import useCreditCheckingRequestResult from './CreditCheckingRequestResult.hook';


const CreditCheckingRequestResultPage = () => {
  const canEditCreditChecking = useCheckAccess(accessid.REQUEST_CREDIT_CHECKING_UPDATE);

  const {
    bucketDetail,
    handleRequestEdit,
    isRequestMode,
    isVerificationMode,
    masintonChange,
    masintonForm,
    masintonMultiChange,
    selectedDebtor,
    selectedManagement,
    selectedOtherRelation,
    selectedShareholder,
    setSelectedDebtor,
    setSelectedManagement,
    setSelectedOtherRelation,
    setSelectedShareholder,
    renderActionButtons,
    isRenderAskForInfoEditButton,
    isShowTableUploadDocument,
    hasInitializedSelection,
    initializeTableSelection,
    isRequestModule,
  } = useCreditCheckingRequestResult();

  const ctxValue = React.useMemo(
    () => ({
      bucketDetail,
      form: masintonForm,
      hasInitializedSelection: {
        debtor: hasInitializedSelection.current.debtor,
        management: hasInitializedSelection.current.management,
        otherRelation: hasInitializedSelection.current.otherRelation,
        shareholder: hasInitializedSelection.current.shareholder,
      },
      initializeTableSelection,
      selectedDebtor,
      selectedManagement,
      selectedOtherRelation,
      selectedShareholder,
      setField: masintonChange,
      setMultiField: masintonMultiChange,
      setSelectedDebtor,
      setSelectedManagement,
      setSelectedOtherRelation,
      setSelectedShareholder,
    }),
    [
      masintonForm,
      masintonChange,
      masintonMultiChange,
      bucketDetail,
      selectedDebtor,
      selectedShareholder,
      selectedManagement,
      selectedOtherRelation,
      setSelectedDebtor,
      setSelectedShareholder,
      setSelectedManagement,
      setSelectedOtherRelation,
      initializeTableSelection,
    ],
  );

  const renderEditButton = () => {
    if (!(isRenderAskForInfoEditButton && canEditCreditChecking)) return null;
    return (
      <Button
        variant="text"
        color="error"
        startIcon="edit"
        textVariant="display2"
        startIconSx={{ mr: 0 }}
        sx={{ minWidth: 0, padding: '0 !important' }}
        onClick={handleRequestEdit}
      />
    );
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <RowWrapper sx={{ alignItems: 'center', gap: 2 }}>
        <Title
          title={
            isRequestMode
              ? 'Request Credit Checking'
              : isVerificationMode
                ? 'Credit Checking Document Verification'
                : 'Credit Checking Result'
          }
        />
        {renderEditButton()}
      </RowWrapper>

      <TableDebtorInformation
        module={TypeModule.CREDIT_CHECKING}
        process={
          isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP
        }
      />

      <DetailRequest form={masintonForm} onChange={masintonChange} multiChange={masintonMultiChange} />

      <CreditCheckingRequestResultProvider value={ctxValue}>
        <ManagementShareholder />
      </CreditCheckingRequestResultProvider>

      {isShowTableUploadDocument && (
        <>
          <ConfirmationInfo />
          <TableUploadDocumentCc
            module={TypeModule.CREDIT_CHECKING}
            process={
              isRequestModule
                ? TypeProcess.CREDIT_CHECKING
                : TypeProcess.CREDIT_CHECKING_DPOP
            }
            showModalSelector
          />
        </>
      )}

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>{renderActionButtons()}</RowWrapper>
    </ColumnWrapper>
  );
};

export default CreditCheckingRequestResultPage;
