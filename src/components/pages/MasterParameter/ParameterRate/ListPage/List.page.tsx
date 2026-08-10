'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from './components/ApprovalStatusModal';
import HistoryRateModal from './components/HistoryRateModal';
import { MODAL } from './List.constant';
import useList from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { push, reset } = useBreadcrumbs();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-rate', label: 'Parameter Rate' });
  }, [push, reset]);

  const {
    handleOpenApprovalStatusModal,
    handleOpenHistoryRateModal,
    isLoading,
    tableData,
    tableHeader,
    canAdd,
  } = useList();

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: !rowData.isEditable ? '#FFF5E4' : 'inherit',
  });

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-rate',
      module: TypeModule.PARAMETER_RATE,
      process: TypeProcess.PARAMETER_RATE,
      remarks: 'Opened Parameter Rate List Page',
    });
  }, []);

  return (
    <>
      <Title title="Maintenance Parameter Rate" />
      <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'flex-end' }}>
        <Button
          onClick={handleOpenHistoryRateModal}
        >
          History Rate
        </Button>
        <Button
          onClick={handleOpenApprovalStatusModal}
        >
          Approval Status
        </Button>
      </RowWrapper>
      <ColumnWrapper gap={theme.spacing(1)}>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            isLoading={isLoading}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.APPROVAL_STATUS_MODAL}
        component={ApprovalStatusModal}
      />

      <ModalDef
        id={MODAL.HISTORY_RATE_MODAL}
        component={HistoryRateModal}
      />
    </>
  );
};

export default ListPage;
