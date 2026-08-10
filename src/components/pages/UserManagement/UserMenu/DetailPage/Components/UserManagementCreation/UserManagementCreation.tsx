'use client';
import { Box } from '@mui/material';

import { DROPDOWN_STATUS } from '@/components/pages/UserManagement/UserMenu/shared/constants';
import Button from '@/components/shared/Button';
import HStack from '@/components/shared/HStack';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import useUserManagementCreation from './UserManagementCreation.hook';


const UserManagementCreation = () => {
  const {
    positionList,
    setValue,
    register,
    divisionList,
    userList,
    watchFields,
    roleList,
    handleSubmit,
    handleOnSave,
    handleCancel,
    isSaveLoading,
    groupList,
    isEdit,
    handleSetUserGroup,
  } = useUserManagementCreation();


  return (
    <>
      <HStack justify="space-between">
        <Title title={`${isEdit ? 'Edit' : 'Add'} User`} />
      </HStack>
      <RowWrapper gap={2} mt={3}>
        <Box width="50%">
          <Input
            type="text"
            label="User ID"
            {...register('userId')}
            value={watchFields.userId}
            disabled
          />
        </Box>
        <Box width="50%">
          <Input
            label="User Group"
            type="dropdown"
            placeholder="Pilih satu"
            containerSx={{ flex: 1 }}
            dropdownList={groupList}
            {...register('userGroup')}
            value={watchFields.userGroup.key}
            onChange={(e) => handleSetUserGroup(e)}
          />
        </Box>
      </RowWrapper>

      <RowWrapper gap={2} mt={3}>
        <Box width="50%">
          <Input
            placeholder="Masukkan nama"
            type="text"
            label="Name"
            {...register('fullName')}
            value={watchFields.fullName}
            onChange={(e) => setValue('fullName', e)}
          />
        </Box>
        <Box width="50%">
          <Input
            placeholder="Masukkan Privy ID"
            type="text"
            label="Privy ID"
            {...register('privyId')}
            value={watchFields.privyId}
            onChange={(e) => setValue('privyId', e)}
          />
        </Box>
      </RowWrapper>

      <RowWrapper gap={2} mt={3}>
        <Box width="50%">
          <Input
            placeholder="Masukkan email"
            type="text"
            label="Email"
            {...register('email')}
            value={watchFields.email}
            onChange={(e) => setValue('email', e)}
          />
        </Box>
        <Box width="50%">
          <Input
            placeholder="Masukan Status"
            type="dropdown"
            label="Status User"
            dropdownList={DROPDOWN_STATUS}
            {...register('status')}
            value={watchFields.status}
            onChange={(e) => setValue('status', e)}
          />
        </Box>
      </RowWrapper>

      <RowWrapper gap={2} mt={3}>
        <Box width="50%">
          <Input

            placeholder="Masukkan NIK"
            label="NIK"
            {...register('nik')}
            value={watchFields.nik}
            onChange={(e) => setValue('nik', e)}
          />
        </Box>
        <Box width="50%">
          <MultipleAutoComplete
            dropdownList={positionList}
            label="Posisi"
            placeholder="Masukkan Posisi"
            {...register('position')}
            value={watchFields.position}
            onChange={(value) => {
              setValue('position', value);
            }}
            onInputChange={() => null}
          />
        </Box>
      </RowWrapper>

      <RowWrapper gap={2} mt={3}>
        <Box width="50%">
          <Input
            placeholder="Masukkan Role"
            type="dropdown"
            label="Role"
            {...register('roleCode')}
            value={watchFields.roleCode}
            onChange={(e) => setValue('roleCode', e)}
            dropdownList={roleList}
          />
        </Box>
        <Box width="50%">
          <Input
            placeholder="Last login date"
            label="Last Login Date"
            {...register('lastLogin')}
            value={watchFields.lastLogin}
            disabled
          />
        </Box>
      </RowWrapper>

      <RowWrapper gap={2} mt={3}>
        <Box width="50%">
          <MultipleAutoComplete
            dropdownList={divisionList}
            label="Division"
            placeholder="Pilih salah satu"
            {...register('divisionCode')}
            value={watchFields.divisionCode}
            onChange={(value) => {
              setValue('divisionCode', value);
            }}
            onInputChange={() => null}
          />
        </Box>
        <Box width="50%">
          <Input
            label="Keterangan"
            type="text"
            placeholder="Masukan Keterangan"
            {...register('description')}
            value={watchFields.description}
            onChange={(e) => setValue('description', e)}
          />
        </Box>
      </RowWrapper>
      <RowWrapper gap={2} mt={3}>
        <Box width="50%">
          <Input
            label="Report To"
            type="dropdown"
            disabled={watchFields.roleCode?.includes('KADIV')}
            placeholder="Pilih satu"
            containerSx={{ flex: 1 }}
            dropdownList={userList}
            {...register('superiorCode')}
            value={watchFields.superiorCode}
            onChange={(e) => setValue('superiorCode', e)}
          />
        </Box>
      </RowWrapper>
      <RowWrapper sx={{ gap: 3, justifyContent: 'end' }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
        >
          Cancel
        </Button>

        <Button
          disabled={isSaveLoading}
          isLoading={isSaveLoading}
          onClick={handleSubmit(handleOnSave)}
        >
          Submit
        </Button>
      </RowWrapper>
    </>
  );
};

export default UserManagementCreation;
