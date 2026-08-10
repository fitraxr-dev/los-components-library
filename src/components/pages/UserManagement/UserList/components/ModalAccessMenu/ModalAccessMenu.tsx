import React, { createElement } from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import TableAccessMenu from '../../../components/TableAccessMenu';
import { modal } from '../../constants';

import type { ModalAccessMenuProps } from './ModalAccessMenu.types';


const ModalAccessMenu = create((props: ModalAccessMenuProps) => {
  const { accessMenuItems } = props;
  const modalId = modal.ACCESS_MENU;
  const { visible } = useModal();
  const theme = useTheme();

  const tableHeader = [
    {
      isDisabled: false,
      isSelected: false,
      key: 'checkbox',
      onSelectChange: () => { },
      render: () => { },
      sx: {
        minWidth: '4vw',
      },
      type: 'checkbox',
    },
    {
      key: 'label',
      label: (labelName) => createElement(
        TextStyle,
        {
          variant: 'body4',
          weight: 600,
        },
        labelName
      ),
      sx: {
        width: '70%',
      },
      type: 'label',
    },
    {
      key: 'view',
      label: 'View',
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'create',
      label: 'Create',
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'edit',
      label: 'Edit',
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'download',
      label: 'Download',
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'showMenu',
      label: 'Show Menu',
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'action',
      options: [
        {
          iconName: 'delete',
          isDisabled: true,
          isLoading: false,
          onClick: () => { },
        }
      ],
      sx: {
        minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  return (
    <SectionModal
      title=""
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '65vw' }}
    >
      <ColumnWrapper gap={theme.spacing(3)} marginBottom={theme.spacing(3)}>
        <Title title="Menu Access Name" />
        {accessMenuItems.map((menu, idx) => (
          <TableAccessMenu
            tableData={menu.subMenu}
            tableLabel={menu.label}
            tableId={menu.id}
            isLoading={false}
            tableIndex={idx}
            tableStatus={menu.status}
            tableHeader={tableHeader}
            key={menu.id}
            viewOnly={true}
          />
        ))}
      </ColumnWrapper>
      <RowWrapper justifyContent="end">
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>Close</Button>
      </RowWrapper>
    </SectionModal>

  );
});

export default ModalAccessMenu;
