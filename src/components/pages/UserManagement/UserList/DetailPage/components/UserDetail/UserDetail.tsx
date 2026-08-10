'use client';
import { Box } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useUserDetail from './UserDetail.hook';

import type { UserDetailProps } from './UserDetail.types';


const UserDetail = (props: UserDetailProps) => {
  const canEditUser = useCheckAccess(accessid.USER_LIST_UPDATE);

  const {
    handleEditUser,
    isUserHasChanged,
    theme,
    userDetailCellData,
    accountDetailCellData,
    renderActionButtons,
  } = useUserDetail(props);
  const { isStaff } = useUserManagementContext();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <RowWrapper justifyContent="space-between" marginBottom={theme.spacing(3)}>
        <Title title="User Details" />
        {canEditUser && (
          <Button
            startIcon="edit"
            onClick={handleEditUser}
            disabled={isUserHasChanged}
          >
            Edit User
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
            User ini sedang dalam proses pengajuan, silakan cek pada Approval Status
          </TextStyle>

        </RowWrapper>
      )}
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Box
          sx={{
            '& .MuiGrid-root': {
              paddingY: theme.spacing(1),
            },
            display: 'grid',
            gridGap: theme.spacing(1),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          {userDetailCellData.map((cell) => (
            <Cell key={cell.title} title={cell.title} value={cell.value || '-'} />
          ))}
        </Box>
      </BaseContainer>
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title title="Account Details" />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Box
            sx={{
              '& .MuiGrid-root': {
                paddingY: theme.spacing(1),
              },
              display: 'grid',
              gridGap: theme.spacing(1),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {accountDetailCellData.map((cell) => (
              <Cell key={cell.title} title={cell.title} value={cell.value || '-'} />
            ))}
          </Box>
        </BaseContainer>
      </ColumnWrapper>
      <RowWrapper justifyContent="end">
        {!isStaff && renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default UserDetail;
