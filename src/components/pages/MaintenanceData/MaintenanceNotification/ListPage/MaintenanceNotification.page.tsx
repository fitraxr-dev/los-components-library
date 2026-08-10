'use client';

import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import {
  useMaintenanceNotificationContext,
} from '@/components/layouts/MaintenanceNotificationLayout/MaintenanceNotification.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from './components/ApprovalStatusModal';
import { modal } from './MaintenanceNotification.constant';
import { useMaintenanceNotification } from './MaintenanceNotification.hooks';


const ListPage = () => {
  // record log activity
  const { recordActivity } = useRecordLog();

  const theme = useTheme();
  const {
    anomalyRowStyle,
    filter,
    handleApprovalStatusModal,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useMaintenanceNotification();

  const { handleSetBreadcrumb } = useMaintenanceNotificationContext();
  useEffect(() => {
    handleSetBreadcrumb([]);

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      module: TypeModule.MAINTENANCE_NOTIFICATION,
      process: TypeProcess.MAINTENANCE_NOTIFICATION,
      remarks: 'view maintenance notification',
    });
  }, []);

  return (
    <>
      <Title title="Maintenance Template Notification List" />
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
