'use client';

import React, { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import BaseContainer from '@/components/shared/BaseContainer';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useGetAuditTrailLog from '../hooks/useGetAuditTrailLog';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const AuditTrailAccordion = () => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { processId, bucketProcessId } = useIdentity();
  const { recordActivity } = useRecordLog();

  // Fetch audit trail log data from API
  const { data: auditTrailList = [], isPending: isLoading } = useGetAuditTrailLog({
    itemPerPage,
    noPage,
  });

  const handleOpenDetail = (logData: any) => {
    recordActivity({
      activity: ActivityType.PREVIEW,
      bucketProcessId: String(processId ?? bucketProcessId),
      module: TypeModule.FAST_TRACK,
      process: TypeProcess.FAST_TRACK,
      remarks: 'view detail log audit trail',
    });
    NiceModal.show(MODAL.FAST_TRACK.AUDIT_TRAIL_DETAIL, { logData, logId: logData.logId });
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'no',
      label: 'No',
      sx: {
        maxWidth: '5vw',
        minWidth: '5vw',
      },
    },
    {
      key: 'section',
      label: 'Section',
      render: (data) => (
        <TextStyle variant="body4" weight={600}>
          {data.section ?? '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '12vw',
        minWidth: '12vw',
      },
    },
    {
      key: 'actionType',
      label: 'Action Type',
      render: (data) => (
        <TextStyle variant="body4">
          {data.actionType ?? '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '12vw',
        minWidth: '12vw',
      },
    },
    {
      key: 'documentNumber',
      label: 'Nomor Dokumen',
      render: (data) => (
        <TextStyle variant="body4">
          {data.documentNumber ?? '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '15vw',
        minWidth: '15vw',
      },
    },
    {
      key: 'uploadedBy',
      label: 'Upload By',
      render: (data) => (
        <TextStyle variant="body4">
          {data.uploadedBy ?? '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '12vw',
        minWidth: '12vw',
      },
    },
    {
      key: 'division',
      label: 'Divisi',
      render: (data) => (
        <TextStyle variant="body4">
          {data.division ?? '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '10vw',
        minWidth: '10vw',
      },
    },
    {
      key: 'uploadedDate',
      label: 'Uploaded Date',
      render: (data) => (
        <TextStyle variant="body4">
          {data.uploadedDate ? formatDateTime(data.uploadedDate) : '-'}
        </TextStyle>
      ),
      sx: {
        maxWidth: '15vw',
        minWidth: '15vw',
      },
    },
    {
      key: 'action',
      label: 'Detail',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => handleOpenDetail(data),
        },
      ],
      type: 'action',
    },
  ];

  return (
    <>
      <Title
        title="Log Audit Trail: Upload Document Pembahasan Fast Track"
        sx={{ mb: 3 }}
      />
      <BaseContainer>
        <Table
          tableHeader={tableHeader}
          tableData={auditTrailList}
          isLoading={isLoading}
          currentPage={noPage}
          totalPage={Math.ceil(auditTrailList.length / itemPerPage) || 1}
          handlePageChange={(page) => setNoPage(page)}
          onPageSizeChange={(size) => {
            setItemPerPage(size);
            setNoPage(1);
          }}
        />
      </BaseContainer>
    </>
  );
};

export default AuditTrailAccordion;
