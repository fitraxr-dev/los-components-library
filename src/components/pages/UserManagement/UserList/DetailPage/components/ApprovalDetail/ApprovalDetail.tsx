import React from 'react';

import { Box, useTheme } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useApprovalDetail from './ApprovalDetail.hook';

import type { ApprovalDetailProps } from './ApprovalDetail.types';


const ApprovalDetail = (props: ApprovalDetailProps) => {
  const theme = useTheme();

  const {
    userDetailCellData,
    accountDetailCellData,
    renderActionButtons,
    isDraft,
    isReturnToStaff,
    isShowButton,
    handleEditUser,
    isDetailSubmissionSuccess,
  } = useApprovalDetail(props);
  const canEditUser = useCheckAccess(accessid.USER_LIST_UPDATE) && isShowButton;
  const { isStaff } = useUserManagementContext();


  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <RowWrapper justifyContent="space-between" marginBottom={theme.spacing(3)} alignItems="center">
        <Title title="User Details" />
        {canEditUser && <Button startIcon="edit" onClick={handleEditUser}>Edit User</Button>}
      </RowWrapper>
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
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ApprovalDetail;
