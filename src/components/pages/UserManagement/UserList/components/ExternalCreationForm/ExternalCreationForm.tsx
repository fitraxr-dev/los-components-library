import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

import { formatDate } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import MultipleAutoComplete from '@/components/shared/Input/components/Search/components/MultipleAutoComplete';
import RowWrapper from '@/components/shared/RowWrapper';
import Title from '@/components/shared/Title';

import { modal } from '../../constants';
import ModalAccessMenu from '../ModalAccessMenu';

import useNonLdapCreationForm from './ExternalCreationForm.hook';

import type { ExternalCreationFormProps } from './ExternalCreationForm.types';


const ExternalCreationForm = (props: ExternalCreationFormProps) => {
  const theme = useTheme();
  const {
    accessMenuList,
    control,
    handleOnSave,
    handleOnSubmit,
    handleOpenAccessMenuModal,
    handleSubmit,
    isEdit,
    isSaveUserLoading,
    isValid,
    positionList,
    roleList,
    userGroupList,
    userStatusList,
    watch,
    isHasBucketProcessId,
    isHasProcessId,
    handleOnCancelProcess,
    handleOnInputChange,
    handleOnAccessMenuChange,
    isAdd,
    handleResetNextInput,
    reasonList,
  } = useNonLdapCreationForm(props);

  const tomorrowFormattedForInput = dayjs().add(1, 'day').format('YYYY-MM-DD');


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
          render={({ field: { value, onChange, ...field }, fieldState: { error, invalid } }) => {
            const err = error as unknown as { id: { message: string }; label: { message: string } };

            return (
              <Autocomplete
                {...field}
                label="User Group"
                value={value}
                placeholder="Choose User Group"
                dropdownList={userGroupList}
                error={!!error}
                onInputChange={(val) => handleOnInputChange('userGroup', val)}
                onChange={(val) => {
                  onChange(val);
                  handleResetNextInput('userGroup');
                }}
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
              placeholder="Masukkan Nama"
              isMandatory
              required
              error={!!error}
              helperText={invalid ? error?.message : ''}
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
                handleResetNextInput('role');
              }}
              disabled={!watch('userGroup.id')}
              error={!!error}
              helperText={invalid ? error?.message : ''}
            />
          )}
        />
        <Controller
          control={control}
          name="position"
          render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => {
            return (
              <MultipleAutoComplete
                {...field}
                dropdownList={positionList}
                label="Posisi"
                placeholder="Search Position..."
                onInputChange={() => { }}
                onChange={(val) => {
                  onChange(val);
                }}
                isMandatory
                error={!!error}
                sortingType="last-in"
                helperText={invalid ? error?.message : ''}
                disabled={!watch('role')}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="institute"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="text"
              label="Instansi"
              placeholder="Instansi"
              isMandatory
              required
              error={!!error}
              helperText={invalid ? error?.message : ''}
            />
          )}
        />
        {isEdit && (
          <Controller
            control={control}
            name="userStatus"
            render={({ field }) => (
              <Input
                {...field}
                type="dropdown"
                label="Status User"
                dropdownList={userStatusList}
                placeholder="Pilih Status User"
                isMandatory
                required
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="expiredDate"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="date"
              label="Expired Date"
              onChange={(val) => field.onChange(formatDate(val, 'YYYY-MM-DD'))}
              placeholder="Pilih Expired Date"
              isMandatory
              required
              error={!!error}
              helperText={invalid ? error?.message : ''}
              minDate={tomorrowFormattedForInput}

            />
          )}
        />
        {isEdit ? (
          <Controller
            control={control}
            name="reason"
            render={({ field: { value, ...field }, fieldState: { error, invalid } }) => {
              const _value = value as unknown as { id: string; label: string };

              return (
                <Autocomplete
                  {...field}
                  label="Reason"
                  placeholder="Pilih Reason"
                  value={_value}
                  dropdownList={reasonList}
                  onInputChange={(val) => handleOnInputChange('reason', val)}
                  error={!!error}
                  helperText={invalid ? error.message : ''}
                  isMandatory
                />
              );
            }}
          />
        ) : (
          <Controller
            control={control}
            name="reason"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="text"
                label="Reason"
                placeholder="Masukkan Reason"
                isMandatory
                required
                disabled
                error={!!error}
                helperText={invalid ? error?.message : ''}
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error, invalid } }) => (
            <Input
              {...field}
              type="area"
              label="Keterangan"
              placeholder="Masukkan Keterangan"
              error={!!error}
              helperText={invalid && error?.message}
            />
          )}
        />
      </Box>
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        {(isAdd || (isEdit && (isHasBucketProcessId || isHasProcessId))) && (

          <Button
            onClick={handleOnCancelProcess}
            variant="outlined"
            color="error"
          >
            Cancel Process
          </Button>)}
        <Button
          onClick={handleSubmit(handleOnSave)}
          disabled={isSaveUserLoading}
          isLoading={isSaveUserLoading}
        >
          Save
        </Button>
        {(isAdd || (isEdit && (isHasBucketProcessId || isHasProcessId))) && (
          <Button
            color="success"
            onClick={handleSubmit(handleOnSubmit)}
            disabled={!isValid || isAdd || isSaveUserLoading}
          >
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

export default ExternalCreationForm;
