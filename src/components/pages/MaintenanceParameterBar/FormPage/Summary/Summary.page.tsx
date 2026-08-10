'use client';
import * as React from 'react';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useSummary } from './Summary.hook';


const SummaryPage = () => {
  const { push, reset } = useBreadcrumbs();
  const {
    isLoading,
    tableDataUpdate,
    tablePageUpdate,
    tableDataAdd,
    tablePageAdd,
    addNewBusinessSummaryHeader,
    updateBusinessSummaryHeader,
    handleCancel,
    handleClose,
    updateStatus,
    isMaker,
    viewOnly,
    statusForm,
    shouldShowCloseButton,
    // ADD table pagination
    pageAdd,
    setPageAdd,
    setPageSizeAdd,
    pageUpdate,
    setPageUpdate,
    setPageSizeUpdate,
    hasDataToSubmit,
  } = useSummary();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-bar', label: 'Mapping Business Call & Business Call Summary' });
    push({ label: 'Summary' });
  }, [push, reset]);

  const disableAction = viewOnly || isLoading || !hasDataToSubmit;

  return (

    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Summary" />

      <SectionTitle
        title="Add New Business Summary"
        isOpen={true}
        hideToggle={true}
      >
        <BaseContainer sx={{ boxShadow: 7, mb: 3 }}>
          <Table
            tableHeader={addNewBusinessSummaryHeader}
            tableData={tableDataAdd}
            isLoading={isLoading}
            currentPage={pageAdd}
            totalPage={tablePageAdd?.totalPage || 1}
            handlePageChange={setPageAdd}
            onPageSizeChange={setPageSizeAdd}
          />
        </BaseContainer>
      </SectionTitle>

      <SectionTitle
        title="Update Business Summary"
        isOpen={true}
        hideToggle={true}
      >
        <BaseContainer sx={{ boxShadow: 7, mb: 3 }}>
          <Table
            tableHeader={updateBusinessSummaryHeader}
            tableData={tableDataUpdate}
            isLoading={isLoading}
            currentPage={pageUpdate}
            totalPage={tablePageUpdate?.totalPage || 1}
            handlePageChange={setPageUpdate}
            onPageSizeChange={setPageSizeUpdate}
            isMaintenanceParameterBar={true}
          />
        </BaseContainer>
      </SectionTitle>

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
            <Button
              variant="outlined"
              onClick={handleClose}
            >
              Close
            </Button>

            {isMaker && (
              <>
                <Button
                  disabled={disableAction}
                  variant="outlined"
                  color="error"
                  onClick={() => updateStatus('CANCELED')}
                >
                  Cancel
                </Button>
                <Button
                  disabled={disableAction}
                  variant="contained"
                  color="success"
                  onClick={() => updateStatus('SUBMIT')}
                >
                  Submit
                </Button>
              </>
            )}

            {!isMaker && (
              <>
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

    </ColumnWrapper>
  );
};

export default SummaryPage;
