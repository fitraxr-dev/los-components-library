import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import { modal } from '../../constants';
import ModalAccessMenu from '../ModalAccessMenu';

import useLdapCreationForm from './InternalCreationForm.hook';

import type { InternalCreationFormProps } from './InternalCreationForm.types';


const InternalCreationForm = (props: InternalCreationFormProps) => {
  const theme = useTheme();

  const {
    control,
    handleOnSave,
    handleOnSubmit,
    handleSubmit,
    positionList,
    roleList,
    userGroupList,
    divisionList,
    isEdit,
    userStatusList,
    accessMenuList,
    reasonList,
    handleOpenAccessMenuModal,
    watch,
    setValue,
    directorateList,
    userSearchList,
    isReportToMandatory,
    handleOnCancelProcess,
    handleOnInputChange,
    handleResetNextInputByCurrentId,
    isAdd,
    isUserSearchEnable,
    isValid,
    superiorRole,
    isHasBucketProcessId,
    handleOnAccessMenuChange,
    isHasProcessId,
  } = useLdapCreationForm(props);

  return (
    <BaseContainer sx={{ paddingBottom: theme.spacing(4) }}>
      <Title title="User Details" sx={{ marginBottom: theme.spacing(3) }} />
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginBottom: theme.spacing(5),
        }}
      >
        {isEdit && (
          <>
            <Controller
              control={control}
              name="processId"
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="ID Process"
                  placeholder="Masukkan ID Process"
                  disabled
                />
              )}
            />
            <Controller
              control={control}
              name="userId"
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="User ID"
                  placeholder="Masukkan User ID"
                  disabled
                />
              )}
            />
          </>
        )}
        <Controller
          control={control}
          name="userGroup"
          render={({ field: { onChange, value, ...field }, fieldState: { error, invalid } }) => {
            const err = error as unknown as { id: { message: string }; label: { message: string } };
            const _value = value as { id: string; label: string };

            return (
              <Autocomplete
                {...field}
                label="User Group"
                placeholder="Choose User Group"
                dropdownList={userGroupList}
                error={!!error}
                value={_value}
                onChange={(val) => {
                  onChange(val);
                  handleResetNextInputByCurrentId('userGroup');
                }}
                onInputChange={(val) => handleOnInputChange('userGroup', val)}
                helperText={invalid && err.label?.message}
                isMandatory
              />
            );
          }}
        />
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="text"
              label="Nama"
              placeholder="Choose Nama"
              error={!!error}
              helperText={invalid && error.message}
              isMandatory
            />
          )}
        />
        <Controller
          control={control}
          name="nik"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="text"
              label="No Induk Karyawan"
              placeholder="Masukkan No Induk Karyawan"
              error={!!error}
              helperText={invalid && error.message}
            />
          )}
        />
        <Controller
          control={control}
          name="privyId"
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Account Privy ID"
              placeholder="Masukkan Privy ID"
            />
          )}
        />
        <RowWrapper
          gap={theme.spacing(3)}
          justifyContent="space-between"
        >
          <Box width="70%">
            <Controller
              control={control}
              name="accessMenu"
              render={({ field: { onChange, value, ...field }, fieldState: { error, invalid } }) => {
                const err = error as unknown as { id: { message: string }; label: { message: string } };
                return (
                  <Autocomplete
                    {...field}
                    value={value}
                    placeholder="Menu Access Name"
                    label="Menu Access"
                    onInputChange={(val) => handleOnInputChange('accessMenu', val)}
                    onChange={(val) => {
                      onChange(val);
                      handleOnAccessMenuChange(val);
                    }}
                    dropdownList={accessMenuList}
                    error={!!error}
                    helperText={invalid && err.label?.message}
                    isMandatory
                  />
                );
              }}
            />
          </Box>
          <Button
            onClick={handleOpenAccessMenuModal}
            disabled={!watch('accessMenu.id')}
            sx={{
              position: 'relative',
              top: '19.34px',
            }}
          >
            Lihat Akses
          </Button>
        </RowWrapper>
        <Controller
          control={control}
          name="proposalReference"
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Referensi Pengajuan"
              placeholder="Masukkan Referensi Pengajuan"
            />
          )}
        />
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="dropdown"
              label="Role"
              placeholder="Pilih Role"
              dropdownList={roleList}
              isMandatory
              required
              onChange={(val) => {
                onChange(val);
                handleResetNextInputByCurrentId('role');
                if (val !== 'STAFF' && val !== 'TL') {
                  setValue('reportTo', { id: '', label: '' });
                }
              }}
              disabled={!watch('userGroup.id')}
              error={!!error}
              helperText={invalid && error.message}
            />
          )}
        />
        <Controller
          control={control}
          name="directorate"
          render={({ field: { onChange, value, ...field }, fieldState: { error, invalid } }) => {
            const err = error as unknown as { id: { message: string }; label: { message: string } };

            return (
              <Autocomplete
                {...field}
                label="Direktorat"
                placeholder="Pilih Direktorat"
                dropdownList={directorateList}
                value={value}

                onInputChange={(val) => handleOnInputChange('directorate', val)}
                onChange={(val) => {
                  onChange(val);
                  handleResetNextInputByCurrentId('directorate');
                }}
                error={!!error}
                helperText={invalid && err.label?.message}
                isMandatory
                disabled={!watch('role')}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="division"
          render={({ field: { onChange, value, ...field }, fieldState: { error, invalid } }) => {
            const err = error as unknown as { id: { message: string }; label: { message: string } };

            return (
              <Autocomplete
                {...field}
                label="Divisi"
                placeholder="Pilih Divisi"
                dropdownList={divisionList}
                value={value}
                onInputChange={(val) => handleOnInputChange('division', val)}
                onChange={(val) => {
                  onChange(val);
                  handleResetNextInputByCurrentId('division');
                }}
                error={!!err?.label?.message}
                helperText={invalid && err.label?.message}
                isMandatory
                disabled={!watch('directorate.id')}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="position"
          render={({ field: { ...field }, fieldState: { error, invalid } }) => (
            <Box marginTop="-2%">
              <MultipleAutoComplete
                {...field}
                dropdownList={positionList}
                label="Posisi"
                placeholder="Search Position..."
                onInputChange={() => { }}
                onOpen={() => handleOnInputChange('position', '')}
                isMandatory
                disabled={!watch('division.id')}
                error={!!error}
                helperText={invalid ? error.message : ''}
                sortingType="last-in"
              />
            </Box>
          )}
        />
        <Controller
          control={control}
          name="reportTo"
          render={({ field: { value, ...field }, fieldState: { error, invalid } }) => {
            const err = error as unknown as { id: { message: string }; label: { message: string } };
            const _value = value as { id: string; label: string };

            return (
              <Autocomplete
                {...field}
                label="Report To"
                placeholder="Report To"
                dropdownList={userSearchList}
                value={_value}
                onInputChange={(val) => handleOnInputChange('reportTo', val)}
                error={!!err?.label?.message}
                helperText={invalid && err.label?.message}
                isMandatory={isReportToMandatory}
                disabled={!isUserSearchEnable || !superiorRole}
              />
            );
          }}
        />
        {isEdit && (
          <Controller
            control={control}
            name="userStatus"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="dropdown"
                label="Status User"
                placeholder="Pilih Status User"
                dropdownList={userStatusList}
                isMandatory
                error={!!error}
                helperText={invalid ? error.message : ''}
              />
            )}
          />
        )}
        {/* {isEdit ? ( */}
        <Controller
          control={control}
          name="reason"
          render={({ field: { value, ...field }, fieldState: { error, invalid } }) => {
            const _value = value as unknown as { id: string; label: string };
            const err = error as unknown as { id: { message: string }; label: { message: string } };

            return (
              <Autocomplete
                {...field}
                label="Reason"
                placeholder="Pilih Reason"
                value={_value}
                disabled={!isEdit}
                dropdownList={reasonList}
                onInputChange={(val) => handleOnInputChange('reason', val)}
                error={!!err?.label?.message}
                helperText={invalid && err.label?.message}
                isMandatory
              />
            );
          }}
        />
        {/* ) : (
          <Controller
            control={control}
            name="reason"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="text"
                label="Reason"
                placeholder="Reason"
                isMandatory
                disabled={!isEdit}
                error={!!error}
                helperText={invalid ? error.message : ''}
              />
            )}
          />
        )} */}
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              {...field}
              type="area"
              label="Keterangan"
              placeholder="Masukkan Keterangan"
            />
          )}
        />
      </Box>
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        {(isAdd || (isEdit && (isHasBucketProcessId || isHasProcessId))) && (
          <Button onClick={handleOnCancelProcess} color="error" variant="outlined">
            Cancel Process
          </Button>)}
        <Button onClick={handleSubmit(handleOnSave)}>
          Save
        </Button>
        {(isAdd || (isEdit && (isHasBucketProcessId || isHasProcessId))) && (
          <Button disabled={isAdd || !isValid} color="success" onClick={handleSubmit(handleOnSubmit)}>
            Submit
          </Button>
        )}
      </RowWrapper>

      <ModalDef
        id={modal.ACCESS_MENU}
        component={ModalAccessMenu}
      />
    </BaseContainer>
  );
};

export default InternalCreationForm;
