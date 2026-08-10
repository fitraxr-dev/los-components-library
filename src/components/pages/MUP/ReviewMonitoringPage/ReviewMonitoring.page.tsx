'use client';
import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { reviewMonitoringItemStatus, tableHeaderList } from './ReviewMonitoring.constants';
import useReviewMonitoring from './ReviewMonitoring.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const ReviewMonitoringPage = () => {
  const { viewOnly } = useViewOnly();
  const { goToNextStep } = useMUPContext();
  const [state, _] = useApp();
  const {
    handleSubmitAskForInfo,
    isFetching,
    list,
    page: currentPage,
    pageSize,
    setPage,
    setPageSize,
  } = useReviewMonitoring();
  const stepper = state.stepper;

  const isTl = state.currentRole.includes(roles.TL);
  const isRm = state.currentRole.includes(roles.RM);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isCancelled = stepper.from === 'MIP_REVIEW_CANCELLED';

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'groupType',
      label: 'Action',
      options: (row) => {
        let found = false;
        if (!isCancelled && !viewOnly) {
          if (isRm) {
            found = row.status === reviewMonitoringItemStatus.ASK_FOR_INFO
          || row.status === reviewMonitoringItemStatus.DEPI_WAITING_ASK_FOR_INFO_FROM_BUSINESS;
          } else if (isTl) {
            found = row.status === reviewMonitoringItemStatus.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_TL
          || row.status === reviewMonitoringItemStatus.DEPI_WAITING_ASK_FOR_INFO_APPROVAL_TL
          || row.status === reviewMonitoringItemStatus.DEPI_WAITING_UPDATE_FROM_BUSINESS_APPROVAL_TL;
          } else if (isKadiv) {
            found = row.status === reviewMonitoringItemStatus.BUSINESS_WAITING_ASK_FOR_INFO_APPROVAL_KADIV
          || row.status === reviewMonitoringItemStatus.DEPI_WAITING_ASK_FOR_INFO_APPROVAL_KADIV
          || row.status === reviewMonitoringItemStatus.DEPI_WAITING_UPDATE_FROM_BUSINESS_APPROVAL_KADIV;
          }
        }
        return found ? [
          {
            iconName: 'edit',
            onClick: (data) => {
              handleOnClickAskForInfo(data);
            },
          },
        ] : [];
      },
      type: 'action',
    },
  ];

  const handleOnClickAskForInfo = (rowData) => {
    switch (true) {
      case isRm:
        NiceModal.show(
          MODAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              closeNiceModal(MODAL.GLOBAL.COMMENT);
              if (radioValue === '1') {
                handleSubmitAskForInfo({ action: 'SUBMIT', comment, id: rowData.bucketProcessId, process: rowData.process });
              } else {
                handleSubmitAskForInfo({ action: 'ASK_FOR_INFO_TL', comment, id: rowData.bucketProcessId, process: rowData.process });
              }
            },
            radioLabel: 'Forward to',
            radioOptions: [
              { label: 'Divisi', value: '1' },
              { label: 'TL', value: '2' }
            ],
          },
        );
        break;
      case isTl:
        NiceModal.show(
          MODAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              closeNiceModal(MODAL.GLOBAL.COMMENT);
              if (radioValue === '1') {
                handleSubmitAskForInfo({ action: 'SUBMIT', comment, id: rowData.bucketProcessId, process: rowData.process });
              } else {
                handleSubmitAskForInfo({ action: 'ASK_FOR_INFO_KADIV', comment, id: rowData.bucketProcessId, process: rowData.process });
              }
            },
            radioLabel: 'Forward to',
            radioOptions: [
              { label: 'Divisi', value: '1' },
              { label: 'Kadiv', value: '2' }
            ],
          },
        );
        break;
      case isKadiv:
        NiceModal.show(
          MODAL.GLOBAL.COMMENT,
          {
            onSave: ({ comment, radioValue }) => {
              closeNiceModal(MODAL.GLOBAL.COMMENT);
              handleSubmitAskForInfo({ action: 'SUBMIT', comment, id: rowData.bucketProcessId, process: rowData.process });
            },
          },
        );
        break;
    }
  };

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title
        title="MIP Review Monitoring"
        buttons={[]}
      />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <BaseContainer
        sx={{
          boxShadow: 2,
          p: 2,
        }}
      >
        <Table
          tableHeader={tableHeader}
          isLoading={isFetching}
          tableData={list}
          currentPage={currentPage}
          pageSize={pageSize}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </BaseContainer>

      {!isFetching &&
      <RowWrapper sx={{ gap: 3, justifyContent: 'end', py: 3 }}>
        <Button onClick={goToNextStep} >Next</Button>
      </RowWrapper>
      }
    </ColumnWrapper>
  );
};

export default ReviewMonitoringPage;
