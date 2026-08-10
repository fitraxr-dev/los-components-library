'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import AddNewSummary from '../../components/addNewSummary/AddNewSummary';

import { useSummary } from './Summary.hook';


const SummaryPage = () => {
  const { push, reset } = useBreadcrumbs();
  const params = useParams();
  const { recordActivity } = useRecordLog();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-lov', label: 'Parameter LOV' });
    const currentPath = window.location.pathname;
    push({ href: currentPath, label: 'Summary' });
  }, [push, reset]);

  // Record activity for initial page load
  React.useEffect(() => {
    const description = decodeURIComponent(params.description as string);
    const processId = params.processId as string;
    const moduleName = params.module as string;

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      menuCode: 'parameter-lov',
      module: moduleName,
      process: 'parameter-lov',
      remarks: `view summary step in parameter lov: ${description}`,
    });
  }, [params, recordActivity]);

  const {
    addData,
    form,
    handleAdd,
    handleApprovalStatusModal,
    handleCancel,
    handleClose,
    handleDecline,
    isLoading,
    isMaker,
    tableDataUpdate,
    tableHeaderAddNew,
    tableHeaderUpdate,
    updateData,
    updateStatus,
    viewOnly,
    hasDataToSubmit,
  } = useSummary();

  const disableAction = viewOnly || isLoading || !hasDataToSubmit;
  const disableActionCancel = viewOnly || isLoading;

  return (
    <FormProvider {...form}>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Summary" />

        {/* Table 1 - Update Data */}
        <SectionTitle
          hideToggle={true}
          isOpen={true}
          title="Update"
        >
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              currentPage={1}
              isLoading={isLoading}
              tableData={tableDataUpdate}
              tableHeader={tableHeaderUpdate}
              totalPage={updateData?.totalPages || 1}
              isMaintenanceParameterBar={true}
            />
          </BaseContainer>
        </SectionTitle>

        {/* Table 2 - Add New Data */}
        <SectionTitle
          hideToggle={true}
          isOpen={true}
          title="Add New"
        >
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              currentPage={1}
              isLoading={isLoading}
              tableData={addData?.contents || []}
              tableHeader={tableHeaderAddNew}
              totalPage={addData?.totalPages || 1}
            />
          </BaseContainer>
        </SectionTitle>

        <RowWrapper sx={{ gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          {isMaker ? (
            <>
              <Button
                onClick={handleClose}
                variant="outlined"
              >
                Close
              </Button>
              {isMaker && (!viewOnly) && (
                <>
                  <Button
                    disabled={disableActionCancel}
                    onClick={handleCancel}
                    color="error"
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    disabled={disableAction}
                    onClick={() => updateStatus('SUBMIT')}
                    variant="contained"
                  >
                    Submit
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                disabled={disableAction}
                onClick={handleClose}
                variant="outlined"
              >
                Close
              </Button>
              <Button
                disabled={disableAction}
                onClick={() => updateStatus('REJECT')}
                variant="outlined"
                color="error"
              >
                Reject
              </Button>
              <Button
                disabled={disableAction}
                onClick={() => updateStatus('RETURN_TO_MAKER')}
                variant="contained"
              >
                Return to Maker
              </Button>
              <Button
                color="success"
                disabled={disableAction}
                onClick={() => updateStatus('SUBMIT')}
                variant="contained"
              >
                Approve
              </Button>
            </>
          )}
        </RowWrapper>

        <ModalDef
          component={AddNewSummary}
          id="MODAL_ADD_SUMMARY"
        />

      </ColumnWrapper>
    </FormProvider>
  );
};

export default SummaryPage;
