'use client';

import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import {
  useMaintenanceReminderContext,
} from '@/components/layouts/MaintenanceReminderLayout/MaintenanceReminder.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from './components/ApprovalStatusModal';
import { modal } from './MaintenanceReminder.constant';
import { useMaintenanceReminder } from './MaintenanceReminder.hooks';


const ListPage = () => {
  // record log activity
  const { recordActivity } = useRecordLog();

  const theme = useTheme();
  const {
    anomalyRowStyle,
    handleApprovalStatusModal,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useMaintenanceReminder();

  const { handleSetBreadcrumb } = useMaintenanceReminderContext();
  useEffect(() => {
    handleSetBreadcrumb([]);

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      module: TypeModule.MAINTENANCE_REMINDER,
      process: TypeProcess.MAINTENANCE_REMINDER,
      remarks: 'view maintenance reminder',
    });
  }, []);

  return (
    <>
      <Title title="Maintenance Template Reminder List" />
      <ColumnWrapper gap={theme.spacing(3)}>
        <RowWrapper sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button onClick={handleApprovalStatusModal}>Approval Status</Button>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef
        id={modal.APPROVAL_STATUS_MODAL}
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
