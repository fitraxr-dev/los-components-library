'use client';

import React from 'react';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import DetailModal from '../../components/DetailModal/DetailModal';

import { useSummary } from './Summary.hook';


const SummaryPage = () => {
  const { push, reset } = useBreadcrumbs();

  const {
    isLoading,
    addNewBusinessSummaryData,
    updateBusinessSummaryData,
    addNewBusinessSummaryHeader,
    updateBusinessSummaryHeader,
    pageAdd,
    pageUpdate,
    setPageAdd,
    setPageSizeAdd,
    setPageUpdate,
    setPageSizeUpdate,
    handleClose,
    updateStatus,
    isCreate,
    isMaker,
    viewOnly,
    shouldShowCloseButton,
    hasDataToSubmit,
    tablePageAdd,
    tablePageUpdate,
  } = useSummary();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-va', label: 'Parameter VA' });
    push({ href: null, label: 'Summary' });
  }, [push, reset]);

  const disableAction = viewOnly || isLoading || !hasDataToSubmit;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Summary" />

      {addNewBusinessSummaryData?.length > 0 && (
        <SectionTitle
          title="Add New Virtual Account"
          isOpen={true}
          hideToggle={true}
        >
          <BaseContainer sx={{ boxShadow: 7, mb: 3 }}>
            <Table
              tableHeader={addNewBusinessSummaryHeader}
              tableData={addNewBusinessSummaryData}
              isLoading={isLoading}
              currentPage={pageAdd}
              totalPage={tablePageAdd?.totalPage || 1}
              handlePageChange={setPageAdd}
              onPageSizeChange={setPageSizeAdd}
            />
          </BaseContainer>
        </SectionTitle>
      )}

      {updateBusinessSummaryData?.length > 0 && (
        <SectionTitle
          title="Update Virtual Account"
          isOpen={true}
          hideToggle={true}
        >
          <BaseContainer sx={{ boxShadow: 7, mb: 3 }}>
            <Table
              tableHeader={updateBusinessSummaryHeader}
              tableData={updateBusinessSummaryData}
              isLoading={isLoading}
              currentPage={pageUpdate}
              totalPage={tablePageUpdate?.totalPage || 1}
              handlePageChange={setPageUpdate}
              onPageSizeChange={setPageSizeUpdate}
              isMaintenanceParameterBar={true}
            />
          </BaseContainer>
        </SectionTitle>
      )}


      <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 3 }}>
        {shouldShowCloseButton ? (
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        ) : (
          <>
            {isMaker && (isCreate || !viewOnly) && (
              <Button
                disabled={disableAction}
                variant="outlined"
                color="error"
                onClick={() => updateStatus('CANCELED')}
              >
                Cancel
              </Button>
            )}
            {isMaker && (isCreate || !viewOnly) && (
              <Button
                disabled={disableAction}
                variant="contained"
                color="success"
                onClick={() => updateStatus('SUBMIT')}
              >
                Submit
              </Button>
            )}

            {!isMaker && (
              <>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  disabled={disableAction}
                  variant="contained"
                  onClick={() => updateStatus('RETURN_TO_MAKER')}
                >
                  Return to Maker
                </Button>
                <Button
                  disabled={disableAction}
                  variant="outlined"
                  color="error"
                  onClick={() => updateStatus('REJECT')}
                >
                  Reject
                </Button>
                <Button
                  disabled={disableAction}
                  variant="contained"
                  color="success"
                  onClick={() => updateStatus('SUBMIT')}
                >
                  Approve
                </Button>
              </>
            )}
          </>
        )}
      </RowWrapper>
      <DetailModal id="DETAIL_MODAL_VA" />
    </ColumnWrapper>
  );
};

export default SummaryPage;
