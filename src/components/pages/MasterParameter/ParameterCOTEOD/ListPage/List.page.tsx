'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Divider } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from './components/ApprovalStatusModal';
import { MODAL } from './List.constant';
import useList from './List.hook';


const ListPage = () => {
  const { recordActivity } = useRecordLog();
  const { push, reset } = useBreadcrumbs();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-cot-eod', label: 'Parameter COT & EOD' });
  }, [push, reset]);

  const {
    handleOpenApprovalStatusModal,
    cot,
    eod,
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
      menuCode: 'parameter-cot-eod',
      module: TypeModule.PARAMETER_COT_EOD,
      process: TypeProcess.PARAMETER_COT_EOD,
      remarks: 'Opened Parameter COT & EOD List Page',
    });
  }, []);

  return (
    <>
      <Title
        title="Maintenance Parameter COT & EOD"
        buttons={[
          {
            label: 'Approval Status',
            onClick: handleOpenApprovalStatusModal,
          }
        ]}
      />

      <Divider sx={{ my: 3 }} />

      <ColumnWrapper gap={3}>
        <ColumnWrapper gap={1}>
          <TextStyle variant="title2" weight={700} color="primary.main">Cut of Time (COT)</TextStyle>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              tableHeader={cot.tableHeader}
              tableData={cot.tableData}
              isLoading={cot.isLoading}
              anomalyRow={anomalyRowStyle}
            />
          </BaseContainer>
        </ColumnWrapper>

        <ColumnWrapper gap={1}>
          <TextStyle variant="title2" weight={700} color="primary.main">End of Day (EOD)</TextStyle>
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              tableHeader={eod.tableHeader}
              tableData={eod.tableData}
              isLoading={eod.isLoading}
              anomalyRow={anomalyRowStyle}
            />
          </BaseContainer>
        </ColumnWrapper>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.APPROVAL_STATUS_MODAL}
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
