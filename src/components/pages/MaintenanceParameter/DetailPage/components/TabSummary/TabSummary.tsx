'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import AddNewSummary from '../../../components/addNewSummary/AddNewSummary';
import ApprovalStatusModal from '../../../components/ApprovalStatusModal/ApprovalStatusModal';

import { useSummary } from './TabSummary.hook';


const TabSummary = () => {
  const theme = useTheme();

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
  } = useSummary();

  const handleCancelClick = () => {
    form.reset();
  };

  const handleSave = () => {
    form.handleSubmit((data) => {
    })();
  };

  const handleSubmit = () => {
    form.handleSubmit((data) => {
    })();
  };

  const disableAction = viewOnly || isLoading;

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

        <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 3 }}>
          {isMaker && (
            <Button
              disabled={disableAction}
              onClick={handleCancel}
              variant="outlined"
            >
              Cancel
            </Button>
          )}

          {!isMaker && (
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
                onClick={() => updateStatus('RETURN_TO_MAKER')}
                variant="contained"
              >
                Return to Maker
              </Button>
              <Button
                disabled={disableAction}
                onClick={() => updateStatus('REJECT')}
                variant="outlined"
                color="error"
              >
                Reject
              </Button>
            </>
          )}

          <Button
            color="success"
            disabled={disableAction}
            onClick={() => updateStatus('SUBMIT')}
          >
            {!isMaker ? 'Approve' : 'Submit'}
          </Button>
        </RowWrapper>

        <ModalDef
          component={AddNewSummary}
          id="MODAL_ADD_SUMMARY"
        />

      </ColumnWrapper>
    </FormProvider>
  );
};

export default TabSummary;
