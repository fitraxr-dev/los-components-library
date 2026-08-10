import React from 'react';

import { useTheme } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import TableAccessMenu from '@/components/pages/UserManagement/components/TableAccessMenu';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle/TextStyle';
import Title from '@/components/shared/Title';

import useTabAccessMenu from './TabAccessMenu.hook';


const TabAccessMenu = () => {
  const { isStaff } = useUserManagementContext();
  const theme = useTheme();
  const {
    accessName,
    handleOpenEditAccess,
    tableHeader,
    accessMenuItems,
    isUserHasChanged,
    isAccessWait,
    isShowButton,
  } = useTabAccessMenu();

  const canEditAccess = useCheckAccess(accessid.ACCESS_MENU_UPDATE) && isShowButton;

  return (
    <BaseContainer sx={{ boxShadow: 7, marginTop: theme.spacing(3) }}>
      <ColumnWrapper gap={theme.spacing(3)} paddingTop={theme.spacing(2)}>
        <RowWrapper justifyContent="space-between">
          <Title title={accessName} />
          {(canEditAccess) && (
            <Button startIcon="edit" onClick={handleOpenEditAccess} disabled={isUserHasChanged}>
              Edit Access
            </Button>
          )}
        </RowWrapper>
        {isUserHasChanged && (
          <RowWrapper gap={theme.spacing(1)} alignItems="center">
            <Icon iconName="information-shape" />
            <TextStyle
              weight={600}
              variant="body3"
              color={theme.palette.primary.main}
            >
              Data ini sedang dalam proses pengajuan, silakan cek pada Approval Status
            </TextStyle>

          </RowWrapper>
        )}
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
  );
};

export default TabAccessMenu;
