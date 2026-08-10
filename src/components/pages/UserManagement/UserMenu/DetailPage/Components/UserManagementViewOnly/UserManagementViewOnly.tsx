'use client';
import { Box } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import HStack from '@/components/shared/HStack';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useUserManagementViewOnly from './UserManagementViewOnly.hook';

import type { UserModeProps } from '../../../shared/components/UserForm/UserForm.types';


const UserManagementViewOnly = () => {
  const canEditUser = useCheckAccess(accessid.USER_LIST_UPDATE);

  const {
    statusAllowEdit,
    handleEditUser,
    detailUser,
    theme,
    positionMapping,
    divisionMapping,
    renderActionButtons,
  } = useUserManagementViewOnly();

  return (
    <>
      <HStack justify="space-between">
        <Title title="User Details" />
        {statusAllowEdit && canEditUser ?
          <Button
            startIcon="edit"
            startIconSx={{ 'path': { 'stroke': '#ffffff', 'stroke-width': 2.5 } }}
            onClick={handleEditUser}
          >
            Edit User
          </Button> : null}
      </HStack>

      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(1),
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginY: '30px',
        }}
      >
        <Cell title="User ID" value={detailUser?.userId ?? '-'} />
        <Cell title="User Group" value={detailUser?.userGroup?.label ?? '-'} />
        <Cell title="Nama" value={detailUser?.fullName ?? '-'} />
        <Cell title="Privy ID" value={detailUser?.privyId ?? '-'} />
        <Cell title="Email" value={detailUser?.email ?? '-'} />
        <Cell title="Status User" value={detailUser?.statusLabel ?? '-'} />
        <Cell title="NIK" value={detailUser?.nik ?? '-'} />
        <Cell title="Posisi" value={positionMapping() ?? '-'} />
        <Cell title="Role" value={detailUser?.roleRefactor.name ?? '-'} />
        <Cell title="Last Login Date" value={detailUser?.lastLoginDate ?? '-'} />
        <Cell title="Divisi" value={divisionMapping() ?? '-'} />
        <Cell title="Keterangan" value={detailUser?.description ?? '-'} />
        <Cell title="Report To" value={detailUser?.superior?.fullName ?? '-'} />
      </Box>


      <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
        {renderActionButtons()}
      </RowWrapper>
    </>
  );
};

export default UserManagementViewOnly;
