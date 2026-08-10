import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import TextStyle from '@/components/shared/TextStyle';

import { modal } from './TATDetail.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTATDetail = () => {
  const theme = useTheme();
  const [viewOnly, setViewOnly] = useState(true);

  const MAINTENANCE_TAT_DETAIL = [
    {
      active: 'Ya',
      endOfDayDefault: '15:00',
      extraEndOfDay: '17:00',
      feature: 'TAT',
      index: '1',
    },
  ];

  const MAINTENANCE_TAT_APPROVAL = [
    {
      multiRow: {
        header: ['index'],
        row: [
          {
            active: 'Ya',
            createdBy: 'Reni',
            createdDate: '20 Mei 2024',
            endOfDayDefault: '15:00',
            extraEndOfDay: '16:00',
            feature: 'TAT',
            status: 'Current',
          },
          {
            active: 'Ya',
            createdBy: 'Reni',
            createdDate: '20 Mei 2024',
            endOfDayDefault: '15:00',
            extraEndOfDay: '17:00',
            feature: 'TAT',
            status: 'Last Modified',
          },
        ],
      },
    },
  ];


  const TABLE_HEADER_MAINTENANCE_TAT_DETAIL: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'feature',
      label: 'Fitur',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'endOfDayDefault',
      label: 'End Of Day Default',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'extraEndOfDay',
      label: 'Extra End Of Day',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'active',
      label: 'Active',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {},
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const TABLE_HEADER_MAINTENANCE_TAT_APPROVAL: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <TextStyle variant="body4" weight={600} color={theme.palette.primary.main}>
          {row.status}
        </TextStyle>
      ),
    },
    {
      key: 'endOfDayDefault',
      label: 'End Of Day Default',
    },
    {
      key: 'extraEndOfDay',
      label: 'Extra End Of Day',
    },
    {
      key: 'active',
      label: 'Active',
    },
    {
      key: 'createdBy',
      label: 'Created By',
    },
    {
      key: 'createdDate',
      label: 'Created Date',
    },
  ];

  const handleApprove = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          console.log('🚀 ~ handleApprove ~ comment:', comment);
          closeNiceModal(MODAL.GLOBAL.COMMENT);

          showNiceModalV2({ onClose: () => {
            setViewOnly(true);
          }, title: 'Approved', type: 'success' });
        },
      },
    );
  };

  const handleReject = async () => {
    NiceModal.show(
      modal.REJECT_MODAL,
      {
        onReject: (reason) => {
          console.log('🚀 ~ handleReject ~ reason:', reason);
          closeNiceModal(modal.REJECT_MODAL);

          showNiceModalV2({ onClose: () => {
            setViewOnly(true);
          }, title: 'Rejected', type: 'success' });
        },
      },
    );
  };

  return {
    MAINTENANCE_TAT_APPROVAL,
    MAINTENANCE_TAT_DETAIL,
    TABLE_HEADER_MAINTENANCE_TAT_APPROVAL,
    TABLE_HEADER_MAINTENANCE_TAT_DETAIL,
    handleApprove,
    handleReject,
    setViewOnly,
    viewOnly,
  };
};

export default useTATDetail;
