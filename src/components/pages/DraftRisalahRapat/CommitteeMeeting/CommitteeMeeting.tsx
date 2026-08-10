'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Grid, useTheme } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import useRisalahRapatLayout from '@/components/layouts/RisalahRapatLayout/RisalahRapatLayout.hooks';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import { MODAL_ID } from './CommitteeMeeting.constant';
import useCommitteeMeeting from './CommitteeMeeting.hooks';
import ModalMember from './components/ModalMember';
import TableMeetingMember from './components/TableMeetingMember';
import TableReceiverMember from './components/TableReceiverMember';


const CommitteeMeeting = () => {
  const theme = useTheme();
  const { goToNextStep } = useRisalahRapatLayout();
  const { viewOnly } = useViewOnly();

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      agenda: '',
      debtorName: '',
      leader: undefined,
      location: '',
      noMup: '',
      quorum: '',
      schedule: '',
      sectorLabel: '',
      timeRangeEnd: '',
      timeRangeStart: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const allFormValues = useWatch({ control });

  const {
    handleSave,
    handleSaveAndNext,
    isAutoSaveFetching,
    isLoading,
    meetingDetailData,
    meetingMemberLeaderOptions,
    quorumOptions,
  } = useCommitteeMeeting(allFormValues);

  React.useEffect(() => {
    if (meetingDetailData) {
      reset(meetingDetailData);
    }
  }, [meetingDetailData, reset]);

  const leader = useWatch({ control, name: 'leader' });
  const timeRangeStart = useWatch({ control, name: 'timeRangeStart' });

  React.useEffect(() => {
    if (!timeRangeStart) return;
    trigger('timeRangeEnd');
  }, [timeRangeStart, trigger]);

  React.useEffect(() => {
    if (!meetingMemberLeaderOptions || leader === undefined || leader === null || leader === '') return;

    const isLeaderStillExists = meetingMemberLeaderOptions.some((option) => option.value === leader);
    if (!isLeaderStillExists) {
      setValue('leader', undefined);
    }
  }, [leader, meetingMemberLeaderOptions, setValue]);

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Informasi Rapat Komite" />
        <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />

        <BaseContainer sx={{ boxShadow: 7, gap: 3, padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="debtorName"
                render={({ field }) => (
                  <Input
                    label="Nama Customer"
                    placeholder="Nama Customer"
                    type="text"
                    {...field}
                    disabled
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="sectorLabel"
                render={({ field }) => (
                  <Input
                    label="Bidang Usaha"
                    placeholder="Bidang Usaha"
                    type="text"
                    {...field}
                    disabled
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="schedule"
                rules={!viewOnly ? { required: 'Hari/Tanggal Rapat wajib diisi' } : undefined}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="Hari/Tanggal Rapat"
                    placeholder="Choose Hari/Tanggal Rapat"
                    type="date"
                    {...field}
                    disabled={viewOnly}
                    isMandatory
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Box>
                <RowWrapper mb={1}>
                  <TextStyle weight={600}>
                    Rentang Waktu
                    <TextStyle component="span" weight={600} color={theme.palette.error.main}>
                      *
                    </TextStyle>
                  </TextStyle>
                </RowWrapper>
                <Box sx={{ alignItems: 'flex-start', display: 'flex', gap: 2 }}>
                  <Controller
                    control={control}
                    name="timeRangeStart"
                    rules={!viewOnly ? {
                      required: 'Jam mulai wajib diisi',
                    } : undefined}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        label=""
                        placeholder="Choose Time From"
                        type="time"
                        {...field}
                        disabled={viewOnly}
                        error={!!error}
                        helperText={error?.message}
                        rightComponent={<TextStyle weight={500}>to</TextStyle>}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="timeRangeEnd"
                    rules={!viewOnly ? {
                      required: 'Jam selesai wajib diisi',
                      validate: {
                        minTime: (value) => {
                          if (!value || !timeRangeStart) return true;

                          return value >= timeRangeStart || 'Jam selesai harus setelah jam mulai';
                        },
                      },
                    } : undefined}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        label=""
                        placeholder="Choose Time To"
                        type="time"
                        {...field}
                        disabled={viewOnly}
                        minTime={timeRangeStart || undefined}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="agenda"
                rules={!viewOnly ? { required: 'Agenda rapat wajib diisi' } : undefined}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="Agenda Rapat"
                    placeholder="Input Agenda Rapat"
                    type="text"
                    {...field}
                    disabled={viewOnly}
                    isMandatory
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="noMup"
                render={({ field }) => (
                  <Input
                    label="No. Memo MUP"
                    placeholder="Input No. Memo MUP"
                    type="text"
                    {...field}
                    disabled
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="location"
                rules={!viewOnly ? { required: 'Tempat rapat wajib diisi' } : undefined}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="Tempat"
                    placeholder="Input Tempat"
                    type="text"
                    {...field}
                    disabled={viewOnly}
                    isMandatory
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="leader"
                rules={!viewOnly ? { required: 'Ketua rapat wajib dipilih' } : undefined}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="Ketua Rapat"
                    placeholder="Choose Ketua Rapat"
                    type="dropdown"
                    dropdownList={meetingMemberLeaderOptions}
                    {...field}
                    disabled={viewOnly}
                    isMandatory
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name="quorum"
                rules={!viewOnly ? { required: 'Kuorum wajib dipilih' } : undefined}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    label="Kuorum"
                    placeholder="Choose Kuorum"
                    type="dropdown"
                    dropdownList={quorumOptions}
                    {...field}
                    disabled={viewOnly}
                    isMandatory
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <TableMeetingMember />
          <TableReceiverMember />
        </BaseContainer>

        <RowWrapper gap={2} alignItems="center" justifyContent="end" py={3}>
          {!viewOnly && (
            <Button
              onClick={handleSubmit(handleSave)}
              isLoading={isLoading || isSubmitting}
              disabled={!isValid || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>
          )}
          <Button
            onClick={viewOnly ? goToNextStep : handleSubmit(handleSaveAndNext)}
            isLoading={isLoading || isSubmitting}
          >
            Next
          </Button>
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={MODAL_ID.MODAL_MEMBER}
        component={ModalMember}
      />
    </>
  );
};

export default CommitteeMeeting;
