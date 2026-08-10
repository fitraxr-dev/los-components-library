'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { CANCELED, END_PROCESS } from '@/configs/constants';
import { formatDate } from '@/helpers/date';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Switch from '@/components/shared/Switch';
import Title from '@/components/shared/Title';

import DeclineModal from './components/DeclineModal';
import { modal } from './Request.constants';
import { useRequest } from './Request.hook';


const Request = () => {
  const theme = useTheme();

  const {
    control,
    watch,
    isPermanent,
    setIsPermanent,
    today,
    handleSave,
    handleClose,
    isSaveLoading,
    canUpdateSku,
    formattedActionButton,
    renderActionButtons,
    directorateList,
    divisionList,
    reasonList,
    userList,
    handleDirectorateChange,
    handleDivisionChange,
    handlePersonChange,
    handleReasonChange,
    handleReassignDirectorateChange,
    handleReassignDivisionChange,
    handleReassignPersonChange,
    handleInputChange,
    isKadivPosition,
    isDetail,
    isFormValid,
    isStepEnabled,
    isLoadingDetail,
    isShowEndProcess,
    isViewOnly,
    handleSubmit,
    isCanCancel,
    isSelectedPersonDisabled,
    isReassignToDisabled,
  } = useRequest();

  if (isLoadingDetail) {
    return (
      <ColumnWrapper sx={{ alignItems: 'center', gap: 3, justifyContent: 'center', minHeight: '400px' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <CircularProgress size={40} />
        </Box>
      </ColumnWrapper>
    );
  }


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper>
        <Title title="Request" />
      </RowWrapper>

      <SectionTitle title="Select Person" />
      <ColumnWrapper gap={theme.spacing(3)}>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(3),
          }}
        >
          <Controller
            name="selectedPerson.directorate"
            control={control}
            rules={{ required: 'Directorate is required' }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                label="Direktorat"
                placeholder="Choose Direktorat"
                isMandatory
                onChange={(value) => handleDirectorateChange(value, 'selectedPerson')}
                onInputChange={(value) => handleInputChange('selectedPerson', 'directorate', value)}
                dropdownList={directorateList.selectedPerson || []}
                value={field?.value && { label: field?.value }}
                disabled={isStepEnabled || isSelectedPersonDisabled || isViewOnly}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="selectedPerson.division"
            control={control}
            rules={{ required: 'Division is required' }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                label="Divisi"
                placeholder="Choose Divisi"
                isMandatory
                onChange={(value) => handleDivisionChange(value, 'selectedPerson')}
                onInputChange={(value) => handleInputChange('selectedPerson', 'division', value)}
                dropdownList={divisionList.selectedPerson || []}
                value={field?.value && { label: field?.value }}
                disabled={isStepEnabled || isSelectedPersonDisabled || isViewOnly || !watch('selectedPerson.directorate')}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="selectedPerson.name"
            control={control}
            rules={{
              required: 'Name is required',
              validate: (value) => value?.id && value?.label ? true : 'Name is required',
            }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                label="Nama"
                placeholder="Choose Nama"
                isMandatory
                onChange={(value) => handlePersonChange(value, 'selectedPerson')}
                onInputChange={(value) => handleInputChange('selectedPerson', 'user', value)}
                dropdownList={userList.selectedPerson || []}
                value={field?.value}
                disabled={isStepEnabled || isViewOnly || !watch('selectedPerson.division')}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="selectedPerson.jobPosition"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Jabatan"
                placeholder="Jabatan"
                disabled
              />
            )}
          />
        </Box>
      </ColumnWrapper>

      <SectionTitle title="Re-assign To" />
      <ColumnWrapper gap={theme.spacing(3)}>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mt: theme.spacing(3),
          }}
        >
          <Controller
            name="reassignTo.directorate"
            control={control}
            rules={{ required: 'Directorate is required' }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                label="Direktorat"
                placeholder="Choose Direktorat"
                isMandatory
                onChange={(value) => handleReassignDirectorateChange(value, 'reassignTo')}
                onInputChange={(value) => handleInputChange('reassignTo', 'directorate', value)}
                dropdownList={directorateList.reassignTo || []}
                value={field?.value && { label: field?.value }}
                disabled={isStepEnabled || isViewOnly || isReassignToDisabled}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="reassignTo.division"
            control={control}
            rules={{ required: 'Division is required' }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                label="Divisi"
                placeholder="Choose Divisi"
                isMandatory
                onChange={(value) => handleReassignDivisionChange(value, 'reassignTo')}
                onInputChange={(value) => handleInputChange('reassignTo', 'division', value)}
                dropdownList={divisionList.reassignTo || []}
                value={field?.value && { label: field?.value }}
                disabled={isStepEnabled || isViewOnly || isReassignToDisabled || !watch('reassignTo.directorate')}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="reassignTo.name"
            control={control}
            rules={{
              required: 'Name is required',
              validate: (value) => value?.id && value?.label ? true : 'Name is required',
            }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                label="Nama"
                placeholder="Choose Nama"
                isMandatory
                onChange={(value) => handleReassignPersonChange(value, 'reassignTo')}
                onInputChange={(value) => handleInputChange('reassignTo', 'user', value)}
                dropdownList={userList.reassignTo || []}
                value={field?.value}
                disabled={isStepEnabled || isViewOnly || !watch('reassignTo.division')}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="reassignTo.jobPosition"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Jabatan"
                placeholder="Jabatan"
                disabled
              />
            )}
          />
          {isKadivPosition && (
            <>
              <Controller
                name="reassignTo.skuNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Nomor SKU"
                    placeholder="Input Nomor SKU"
                    disabled={isStepEnabled || isViewOnly}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="reassignTo.skuDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    label="Tanggal SKU"
                    type="date"
                    placeholder="Choose Tanggal SKU"
                    format="DD MMM YYYY"
                    disabled={isStepEnabled || isViewOnly}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </>)}
          <Box
            sx={{
              display: 'grid',
              gap: theme.spacing(3),
              gridColumn: 'span 2',
              gridTemplateColumns: 'repeat(1, 1fr)',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gap: theme.spacing(3),
                gridTemplateColumns: 'repeat(2, 1fr)',
              }}
            >
              <Controller
                control={control}
                name="reassignTo.startDate"
                rules={{
                  required: !isPermanent ? 'Start Date is required' : false,
                }}
                render={({ field: { ref, value, ...field }, fieldState: { error } }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Duration Start Date"
                    type="date"
                    containerSx={{ flex: 1 }}
                    placeholder="Start Date"
                    format="DD MMM YYYY"
                    disabled={isStepEnabled || isPermanent || isViewOnly}
                    value={isPermanent ? formatDate(new Date(), 'YYYY-MM-DD') : value}
                    minDate={today}
                    isMandatory={!isPermanent}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="reassignTo.endDate"
                rules={{
                  required: !isPermanent ? 'End Date is required' : false,
                  validate: (value) => {
                    if (isPermanent) return true;
                    if (!value) return 'End Date is required';
                    if (watch('reassignTo.startDate') && value < watch('reassignTo.startDate')) {
                      return 'End Date must be after Start Date';
                    }
                    return true;
                  },
                }}
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    label="Duration End Date"
                    type="date"
                    containerSx={{ flex: 1 }}
                    placeholder="End Date"
                    format="DD MMM YYYY"
                    minDate={watch('reassignTo.startDate')}
                    isMandatory={!isPermanent}
                    disabled={isStepEnabled || isPermanent || isViewOnly || !watch('reassignTo.startDate')}
                    error={!!error}
                    helperText={error?.message}
                    value={isPermanent ? '' : field.value}
                  />
                )}
              />
            </Box>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              gridColumn: 'span 2',
            }}
          >
            <Switch
              label="Permanent"
              checked={isPermanent}
              onChange={() => !isStepEnabled && setIsPermanent(!isPermanent)}
              disabled={isStepEnabled || isViewOnly}
            />
          </Box>
          <Controller
            name="reassignTo.reason"
            control={control}
            rules={{
              required: 'Reason is required',
              validate: (value) => value?.id && value?.label ? true : 'Reason is required',
            }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                label="Reason"
                placeholder="Choose Reason"
                isMandatory
                onChange={handleReasonChange}
                dropdownList={reasonList}
                value={field?.value}
                disabled={isStepEnabled || isViewOnly}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          {isPermanent && (
            <Controller
              name="reassignTo.remarks"
              control={control}
              rules={{
                maxLength: {
                  message: 'Remarks must be 1000 characters or less',
                  value: 1000,
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  label="Remarks"
                  type="area"
                  placeholder="Input Remarks"
                  disabled={isStepEnabled || isViewOnly}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        </Box>
      </ColumnWrapper>

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3, py: 3 }}>
        {isShowEndProcess && !isViewOnly &&
          <Button
            onClick={() => handleSubmit(END_PROCESS)}
            color="error"
            variant="outlined"
          >
            End Assignment
          </Button>
        }
        {isCanCancel && !isViewOnly &&
          <Button
            onClick={() => handleSubmit(CANCELED)}
            variant="outlined"
            color="error"
            disabled={isSaveLoading}
          >
            Cancel
          </Button>
        }
        {canUpdateSku && !isDetail && !isViewOnly && (
          <Button
            isLoading={isSaveLoading}
            onClick={handleSave}
            disabled={!isFormValid || isSaveLoading}
          >
            Save
          </Button>
        )}
        {(isViewOnly || (!isViewOnly && Object.keys(formattedActionButton).length === 0)) && (
          <Button variant="outlined" onClick={handleClose}>Close</Button>
        )}
        {renderActionButtons()}

      </RowWrapper>

      <ModalDef
        id={modal.DECLINE}
        component={DeclineModal}
      />
    </ColumnWrapper>
  );
};

export default Request;
