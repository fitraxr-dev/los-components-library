/*eslint-disable max-len*/
'use client';
import { useRef, useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { FormProvider, useWatch } from 'react-hook-form';

import { SITEVISIT_STATUS } from '@/configs/constants/siteVisit';
import { TypeModule, TypeProcess } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import useSiteVisitContext from '../shared/hooks/useSiteVisitContext';
import useSiteVisitForm from '../shared/hooks/useSiteVisitForm';
import useViewAllDocument from '../ViewAllDocumentPage/ViewAllDocument.hook';

import AddNewClientParty from './components/AddNewClientParty';
import AddNewOthersParty from './components/AddNewOthersParty';
import AddSiteVisit from './components/AddNewSiteVisit/AddSiteVisit';
import AddNewSmiParty from './components/AddNewSmiParty';
import { modalSiteVisit } from './SiteVisit.constants';
import { useSiteVisit } from './SiteVisit.hook';


const useSiteVisitFormWatcher = (control: any) => {
  const [
    clientNote,
    externalNote,
    surveyorNote,
    remarks,
    evidence,
    startDate,
    endDate,
    reportDate,
    institutionType,
    clientParty,
    externalParty,
    internalParty,
    deletedPartyId,
    debtorAddress,
    visitAddress,
  ] = useWatch({
    control,
    name: [
      'clientNote',
      'externalNote',
      'surveyorNote',
      'remarks',
      'evidence',
      'startDate',
      'endDate',
      'reportDate',
      'institutionType',
      'clientParty',
      'externalParty',
      'internalParty',
      'deletedPartyId',
      'debtorAddress',
      'visitAddress',
    ],
  });

  return {
    clientNote,
    clientParty,
    debtorAddress,
    deletedPartyId,
    endDate,
    evidence,
    externalNote,
    externalParty,
    institutionType,
    internalParty,
    remarks,
    reportDate,
    startDate,
    surveyorNote,
    visitAddress,
  };
};


const SiteVisit = () => {
  const { siteVisitDetail, updateState } = useSiteVisitContext();
  const { isPemda } = useViewAllDocument();

  const [isValidForm, setIsValidForm] = useState(false);

  const onSuccessSaveRef = useRef<((data: any, variables: any) => void) | null>(null);
  const visibleAddRef = useRef<boolean>(false);
  const visitCodeRef = useRef<any>(null);

  const {
    form,
    onSave,
    isSavePending,
    isLoadingData,
    handleGenerateDraft,
    resetForm,
  } = useSiteVisitForm({
    isPemda,
    onSuccessSave: (data, variables) => {
      onSuccessSaveRef.current?.(data, variables);
    },
    setIsValidForm,
    get visibleAdd() { return visibleAddRef.current; },
    get visitCode() { return visitCodeRef.current; },
  });

  // formValues diteruskan ke useSiteVisit untuk kebutuhan autoSave
  const formValues = useSiteVisitFormWatcher(form?.control);

  const {
    buttons,
    dataVisitHeader,
    dataVisitList,
    viewOnly,
    isTL,
    isLoading,
    isPending,
    updateStatus,
    onSuccessSave,
    warnBeforeLeaving,
    handleDecline,
    anomalyRow,
    queryClient,
    statusForm,
    handleGenerateVisitCode,
    visitCode,
    page,
    setPage,
    setPageSize,
    tablePage,
    isChecker,
    isMaker,
    isAutoSaveFetching,
    isSubmitPending,
    visibleAdd,
    setVisibleAdd,
  } = useSiteVisit(formValues);

  visibleAddRef.current = visibleAdd;
  visitCodeRef.current = visitCode;
  onSuccessSaveRef.current = onSuccessSave;

  const isWaitingApproval = statusForm === SITEVISIT_STATUS.WAITING_APPROVAL_TL || statusForm === SITEVISIT_STATUS.WAITING_APPROVAL_CHECKER;
  const disableAction = viewOnly || isLoading || isLoadingData || isAutoSaveFetching;
  const disableSave = disableAction || (!visibleAdd && !siteVisitDetail?.id);

  const renderActionButtons = () => {
    const actionButtons = [
      {
        color: 'error' as const,
        disabled: disableAction,
        label: 'Decline',
        onClick: handleDecline,
        show: buttons['DECLINE'],
        variant: 'outlined' as const,
      },
      {
        disabled: disableSave,
        isLoading: isSavePending,
        label: isAutoSaveFetching ? 'Auto Save ...' : 'Save',
        onClick: onSave,
        show: buttons['SAVE'],
      },
      {
        color: 'info' as const,
        disabled: !siteVisitDetail?.id ||
          (siteVisitDetail?.isFromHistory && !isPemda) ||
          disableAction || (!isPemda && !isValidForm),
        label: 'Generate draft laporan site visit',
        onClick: handleGenerateDraft,
        show: buttons['GENERATE_REPORT'],
        variant: 'contained' as const,
      },
      {
        color: 'info' as const,
        disabled: !isWaitingApproval || disableAction || !siteVisitDetail?.id,
        label: 'Return to Maker',
        onClick: () => updateStatus('RETURN_TO_MAKER'),
        show: buttons['RETURN_TO_MAKER'],
        variant: 'contained' as const,
      },
      {
        color: 'info' as const,
        disabled: !isWaitingApproval || disableAction || !siteVisitDetail?.id,
        label: 'Return to Staff',
        onClick: () => updateStatus('RETURN_TO_STAFF'),
        show: buttons['RETURN_TO_STAFF'],
        variant: 'contained' as const,
      },
      {
        color: 'success' as const,
        disabled: (isTL || isChecker ? !isWaitingApproval : isWaitingApproval) ||
          disableAction ||
          (!isTL && !isChecker && (!dataVisitList || dataVisitList.length === 0)) ||
          !isValidForm,
        label: 'Submit',
        onClick: () => updateStatus('SUBMIT'),
        show: buttons['SUBMIT'],
      },
      {
        color: 'success' as const,
        disabled: (isTL || isChecker || isMaker ? !isWaitingApproval : isWaitingApproval) ||
          disableAction ||
          (!isTL && !isChecker && !isMaker && (!dataVisitList || dataVisitList.length === 0)) ||
          !isValidForm,
        label: 'Approve',
        onClick: () => updateStatus('SUBMIT'),
        show: buttons['APPROVE'],
      },
    ];

    return actionButtons
      .filter(({ show }) => show)
      .map(({ label, show, ...buttonProps }, i) => (
        <Button key={i} sx={{ mr: 2 }} {...buttonProps}>
          {label}
        </Button>
      ));
  };

  return (
    <FormProvider {...form}>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="List Site Visit" />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableData={dataVisitList}
            tableHeader={dataVisitHeader}
            anomalyRow={anomalyRow}
            totalPage={tablePage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            footer={(!isPemda && !viewOnly && !isTL && !isChecker) && (
              <TableFooter
                onClick={() => {
                  resetForm();
                  handleGenerateVisitCode();
                  queryClient.invalidateQueries({ queryKey: ['site-visit-detail', 'site-visit-parties', 'site-visit-information']});
                  updateState({ siteVisitDetail: undefined });
                  setVisibleAdd(true);
                  warnBeforeLeaving();
                }}
              />
            )}
          />
        </BaseContainer>

        <Title title="Site Visit Details" />
        <TableDebtorInformation module={TypeModule.SITE_VISIT} process={TypeProcess.SITE_VISIT} />
        <AddSiteVisit
          isValidForm={isValidForm}
          isLoading={isPending}
          visible={visibleAdd || !!siteVisitDetail?.id}
        />
        <RowWrapper sx={{ gap: 3, justifyContent: 'end' }}>
          {renderActionButtons()}
        </RowWrapper>

        <ModalDef
          id={modalSiteVisit.ADD_NEW_PIHAK_LAIN}
          component={AddNewOthersParty}
        />
        <ModalDef
          id={modalSiteVisit.ADD_NEW_PIHAK_SMI}
          component={AddNewSmiParty}
        />
        <ModalDef
          id={modalSiteVisit.ADD_NEW_PIHAK_CLIENT}
          component={AddNewClientParty}
        />
      </ColumnWrapper>
    </FormProvider>
  );
};

export default SiteVisit;
