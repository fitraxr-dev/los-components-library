import { createElement } from 'react';

import { useTheme } from '@mui/material';

import TableAccessMenu from '@/components/pages/UserManagement/components/TableAccessMenu';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useTabCurrentAccess from './TabCurrentAccess.hook';


const TabCurrentAccess = () => {
  const theme = useTheme();

  const {
    accessMenuItems, accessName,
  } = useTabCurrentAccess();

  const tableHeader = [
    {
      isDisabled: false,
      isSelected: false,
      key: 'checkbox',
      onSelectChange: () => {},
      render: () => {},
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
          onClick: () => {},
        }
      ],
      sx: {
        minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <BaseContainer>
        <ColumnWrapper gap={theme.spacing(3)}>
          <Title title={accessName} />
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
      </BaseContainer>
    </ColumnWrapper>
  );
};

export default TabCurrentAccess;
